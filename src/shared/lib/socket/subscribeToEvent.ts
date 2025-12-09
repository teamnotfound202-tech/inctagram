import { getSocket } from '@/shared/lib/socket/getSocket'
import { SocketEvent } from '@/shared/lib/constants/constants'

export const subscribeToEvent = <T>(event: SocketEvent, callback:(data:T)=>void) => {
  const socket = getSocket()
  socket.on(event,callback)
  return () => {
    socket.off(event,callback)
  }
}
export const emitEvent = <T, R = any>(
  event: string,
  data: T,
  callback?: (response: R) => void
): void => {
  const socket = getSocket() // предполагаем синхронный вызов

  if (!socket || !socket.connected) {
    console.error(`Cannot emit ${event}: socket not connected`)
    return
  }

  if (callback) {
    socket.emit(event, data, callback) // ⚡️ Socket.IO поддерживает колбэки!
  } else {
    socket.emit(event, data)
  }
}