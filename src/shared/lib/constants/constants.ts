export const ACCESS_TOKEN = 'auth-token'
export const SAVED_IMAGES = 'saved-images'
export const LANGUAGE = 'language'

export const SOCKET_EVENTS = {
  NOTIFICATIONS: 'notifications',
} as const
export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS]