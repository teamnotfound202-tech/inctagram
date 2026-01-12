import { GetMessengerUser } from '@/features/messenger/api/type'
import { Avatar, UserFromSearch } from '@/features/publicUserApi/types'

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function isAvatar(v: unknown): v is Avatar {
  return isPlainObject(v) && typeof v.url === 'string'
}

export function isUserMessage(x: unknown): x is GetMessengerUser {
  if (!isPlainObject(x)) return false
  const o = x as Record<string, unknown>

  const avatarsOk = Array.isArray(o.avatars) && (o.avatars.length === 0 || isAvatar(o.avatars[0]))
  return (
    typeof o.id === 'number' &&
    typeof o.ownerId === 'number' &&
    typeof o.receiverId === 'number' &&
    typeof o.messageText === 'string' &&
    typeof o.createdAt === 'string' &&
    typeof o.updatedAt === 'string' &&
    (o.messageType === 'TEXT' || o.messageType === 'IMAGE' || o.messageType === 'VOICE') &&
    (o.status === 'SENT' || o.status === 'RECEIVED' || o.status === 'READ') &&
    typeof o.userName === 'string' &&
    avatarsOk &&
      typeof o.notReadCount === 'number'
  )
}


export function isUserFromSearch(x: unknown): x is UserFromSearch {
  if (!isPlainObject(x)) return false
  const o = x as Record<string, unknown>

  const avatarsOk = Array.isArray(o.avatars) && (o.avatars.length === 0 || isAvatar(o.avatars[0]))

  return (
    typeof o.id === 'number' &&
    typeof o.userName === 'string' &&
    (typeof o.firstName === 'string' || typeof o.firstName === 'object') &&
    (typeof o.lastName === 'string' || typeof o.lastName === 'object') &&
    avatarsOk
  )
}