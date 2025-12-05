import {getSocket} from '@/shared/lib/socket/getSocket'
import {SocketEvent} from '@/shared/lib/constants/constants'

export const subscribeToEvent = <T>(event: SocketEvent, callback: (data: T) => void) => {
    const socket = getSocket()
    socket.on(event, callback)
    return () => {
        socket.off(event, callback)
    }
}

export const emitEvent = <T>(event: SocketEvent, ...args: any) => {
    const socket = getSocket()
    socket.emit(event, ...args)
    return () => {
        socket.off(event, (...args)=>{})
    }
}