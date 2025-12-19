import { ISOStringFormat } from 'date-fns'

type AvatarUser = {
  url: string
  width: number
  height: number
  fileSize: number
  createdAt: ISOStringFormat
}

type MessageType = 'TEXT' | 'IMAGE' | 'VOICE'
type StatusType = 'SENT' | 'RECEIVED' | 'READ'

export type GetMessengerData = {
  pageSize: number
  totalCount: number
  notReadCount: number
  items: [
    {
      id: number
      ownerId: number
      receiverId: number
      messageText: string
      createdAt: ISOStringFormat
      updatedAt: ISOStringFormat
      messageType: MessageType
      status: StatusType
      userName: string
      avatars: AvatarUser[]
      notReadCount: number
    },
  ]
}

export type SendMessageType = {
  receiverId: number
  message: string
}

export type MessageItemType = {
  id: number
  ownerId: number
  receiverId: number
  messageText: string
  createdAt: ISOStringFormat
  updatedAt: ISOStringFormat
  messageType: MessageType
  status: StatusType
}

export type GetMessages = {
  totalCount: number
  pageSize: number
  items: MessageItemType[]
}