export const ACCESS_TOKEN = 'auth-token'
export const SAVED_IMAGES = 'saved-images'
export const LANGUAGE = 'language'

export const SOCKET_EVENTS = {
  NOTIFICATIONS: 'notifications',
  RECEIVE_MESSAGE :'receive-message',//: Event for sending and receiving messages.
  UPDATE_MESSAGE : 'update-message',//: Event for updating an existing message.
  MESSAGE_DELETED : 'message-deleted',//:Event triggered when a message is deleted.
  MESSAGE_SEND : 'message-send',//:/ Event triggered when a message is sent to the recipient.
  ERROR : 'error'
} as const
export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS]