import { getSocket } from '@/shared/lib/socket/getSocket'
import { SocketEvent } from '@/shared/lib/constants/constants'

export const emitToEvent = <T, U>(event: SocketEvent, message: U, callback: (data: T) => void) => {
  const socket = getSocket()
  socket.emit(event, message, callback)
}
