import { ISOStringFormat } from 'date-fns'
import { Avatar, BaseResponse } from '@/features/publicUserApi/types'

export type Status = 'SENT' | 'RECEIVED' | 'READ'
export type MessageType = 'TEXT' | 'IMAGE' | 'VOICE'

export type MessageItem = {
  id: number
  ownerId: number
  receiverId: number
  messageText: string
  createdAt: ISOStringFormat
  updatedAt: ISOStringFormat
  messageType: MessageType
  status: Status
  userName: string
  avatars: Avatar[]
  notReadCount: number
}
export type MessageSendRequest = {
  message: string,
  receiverId: number
}
export type IncomingMessage=Omit<MessageItem, 'userName'|'avatars'|'notReadCount'>
export type AllMessages = BaseResponse<MessageItem>
export type MessagesByUserName = BaseResponse<IncomingMessage>
