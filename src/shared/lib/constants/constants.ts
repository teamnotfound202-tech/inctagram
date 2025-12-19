export const ACCESS_TOKEN = 'auth-token'
export const SAVED_IMAGES = 'saved-images'
export const LANGUAGE = 'language'

export const SOCKET_EVENTS = {
  NOTIFICATIONS: 'notifications',
  RECEIVE_MESSAGE: 'receive-message',
  UPDATE_MESSAGE: 'update-message',
  MESSAGE_DELETED: 'message-deleted',
  MESSAGE_SEND: 'message-send',
  ERROR: 'error'
} as const
export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS]

