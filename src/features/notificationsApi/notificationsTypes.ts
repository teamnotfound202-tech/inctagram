import { ISOStringFormat } from 'date-fns'

export type NotificationTypes = {
  id: number
  message: string
  isRead: boolean
  createdAt: ISOStringFormat
}
export type NotificationsResponse = {
  pageSize: number
  totalCount: number
  notReadCount: number
  items: NotificationTypes[]
}
export type NotificationsMarkAsRead = {
  ids:number[]
}
export type newNotification = {
  clientId: string
  createdAt: ISOStringFormat
  eventType:number
  id:number
  isRead:boolean
  message:string
  notifyAt: ISOStringFormat
}