import { getSocket } from '@/shared/lib/socket/getSocket'
import { SocketEvent } from '@/shared/lib/constants/constants'

export const subscribeToEvent = <T>(event: SocketEvent, callback:(data:T)=>void) => {
  const socket = getSocket()
  socket.on(event,callback)
  return () => {
    socket.off(event,callback)
  }
}
export const emitEvent = <T = any>(
  event: SocketEvent,
  data?: T,
  callback?: (response: any) => void
) => {
  const socket = getSocket()

  if (callback) {
    // С callback (ожидаем ответ)
    socket.emit(event, data, callback)
  } else {
    // Без callback (fire-and-forget)
    socket.emit(event, data)
  }
}