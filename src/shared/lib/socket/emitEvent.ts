import {SocketEvent} from "@/shared/lib/constants/constants";
import {getSocket} from "@/shared/lib/socket/getSocket";

export const emitEvent = <T, K>(event: SocketEvent, payload: T, callback: (data: K) => void) => {
    const socket = getSocket()
    socket.emit(event, payload, callback)
}