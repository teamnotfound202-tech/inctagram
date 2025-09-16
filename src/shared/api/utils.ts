import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export function getTypedErrorData<T>(
  error: unknown
): { status?: number | string; data?: T } | null {
  if (typeof error === 'object' && error !== null && 'status' in error && 'data' in error) {
    const err = error as FetchBaseQueryError & { data: T }
    return {
      status: err.status,
      data: err.data,
    }
  }
  return null
}
