// import {io, Socket } from 'socket.io-client'
// import { ACCESS_TOKEN } from '@/shared/lib'
//
// let socket: Socket | null = null
// export type ErrorSocket = {error:{ message: string, error: string }, message: string} | {status: string,message:string}
//
// async function  refreshAccessToken(): Promise<string> {
//   const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/update`, {
//     method: 'POST',
//     credentials: 'include'
//   })
//
//   if (!resp.ok) throw new Error('Refresh token failed')
//
//   const { accessToken } = await resp.json()
//   localStorage.setItem(ACCESS_TOKEN, accessToken)
//   return accessToken
// }
//
//
// const getToken = () => {
//   return typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN) : ''
// }
//
// // Функция для обновления токена в сокете
// const updateSocketToken = (socket: Socket, token: string) => {
//   // // Обновляем query в опциях менеджера
//   socket.io.opts.query = { accessToken: token };
// };
//
//
// export const getSocket = () => {
//   if (!socket) {
//     socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
//       query: {
//         accessToken: getToken() ?? '',
//       },
//       // path: '',
//       autoConnect: false,
//       transports: ['websocket'],
//     })
//
//     // перед любой попыткой реконнекта подставляем актуальный токен
//     socket.on('reconnect_attempt', () => {
//       const freshToken = getToken() ?? ''
//       console.log('Reconnect attempt with fresh token from localStorage')
//       updateSocketToken(socket!, freshToken)
//     })
//
//     socket.on('connect', () => {
//       console.log('Подключились!!!')
//     })
//
//     socket.on('error', async (err: Error | ErrorSocket) => {
//       console.log('Ошибка((!!!')
//       const isUnauthorized =
//         err.message === 'Authentication error' ||
//         (err && 'error' in err && err.error.error === 'AUTH_ERROR') ||
//         (err && 'status' in err && err.status === 'error') ||
//         err.message === 'Forbidden resource'
//
//       if (!isUnauthorized) return
//
//       try {
//         const newToken = await refreshAccessToken()
//         updateSocketToken(socket!, newToken)
//         socket!.disconnect() // оборвать текущее/висящее подключение
//         socket!.connect()
//       } catch {
//         localStorage.removeItem(ACCESS_TOKEN)
//       }
//     })
//
//     socket.on('disconnect', () => {
//       console.log('Разъединение((!!!')
//     })
//   }
//
//   // Всегда обновляем токен перед подключением
//   const currentToken = getToken() ?? ''
//   updateSocketToken(socket, currentToken)
//   // Переподключаемся с актуальным токеном
//   if (!socket.connected) {
//     socket.connect()
//   }
//   console.log(socket.io.opts.query)
//   return socket
// }






import { io, Socket } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL!
export type ErrorSocket =
  | { error: { message: string; error: string }; message: string }
  | { status: string; message: string }

let socket: Socket | null = null

export const ACCESS_TOKEN = 'auth-token'
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!

let refreshPromise: Promise<string> | null = null

export function getToken(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(ACCESS_TOKEN) ?? ''
}

export async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const resp = await fetch(`${BACKEND_URL}/auth/update`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!resp.ok) throw new Error('Refresh failed')
      const { accessToken } = await resp.json()
      localStorage.setItem(ACCESS_TOKEN, accessToken)
      return accessToken
    })().finally(() => (refreshPromise = null))
  }
  return refreshPromise
}

export function willExpireSoon(token: string, skewMs = 30_000): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return typeof payload.exp === 'number' ? payload.exp * 1000 - Date.now() < skewMs : true
  } catch {
    return true // не смогли декодировать — считаем невалидным
  }
}

function setQueryToken(s: Socket, token: string) {
  // менеджер-уровень (участвует в следующем handshake)
  s.io.opts.query = { ...(s.io.opts.query as Record<string, string>), accessToken: token }
}

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket'],
      query: { accessToken: getToken() }, // начальный токен как строка
    })

    // перед каждой авто-попыткой — подставляем свежий токен
    socket.on('reconnect_attempt', () => {
      setQueryToken(socket!, getToken())
    })
  }
  return socket
}

/** Гарантирует, что соединение установлено с актуальным токеном */
export async function ensureConnectedWithFreshToken(): Promise<Socket> {
  const s = getSocket()

  // 1) обеспечить валидный токен
  let token = getToken()
  if (!token || willExpireSoon(token)) {
    token = await refreshAccessToken()
  }

  // 2) если рукопожатие ещё не делали — достаточно обновить query и подключиться
  setQueryToken(s, token)

  // 3) если уже было соединение с «старым» токеном — нужно новое handshake
  if (s.connected || s.active) {
    s.disconnect()
  }
  s.connect()

  // 4) дождаться установления соединения или ошибки
  await new Promise<void>((resolve, reject) => {
    const onConnect = () => { cleanup(); resolve() }
    const onError = (err: Error | ErrorSocket) => {
      cleanup()
      reject(err)
    }
    const cleanup = () => {
      s.off('connect', onConnect)
      s.off('connect_error', onError)
    }
    s.once('connect', onConnect)
    s.once('connect_error', onError)
  })

  return s
}

/** Эмит с гарантией актуального токена и ожиданием ack (c таймаутом). */
export async function emitWithAuth<Payload, Ack = unknown>(
  event: string,
  payload: Payload,
  timeoutMs = 8000
): Promise<string> {
const s: Socket = await ensureConnectedWithFreshToken()

return new Promise<string>((resolve, reject) => {
  // socket.timeout(...) — встроенный таймаут ожидания ack
  s.timeout(timeoutMs).emit(event, payload, () => resolve('Ok'))
})
}