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

export  const dateFormatterForServer = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  return new Date(Date.UTC(year, month, day)).toISOString()
}

export const formatDateFromServer = (dateString: string) => {
  const [datePart] = dateString.split('T')
  const [year, month, day] = datePart.split('-')
  return `${day}.${month}.${year}`
}

export const dateNextPayment = (dateString: string) => {
  const d = new Date(dateString)
  d.setUTCDate(d.getUTCDate() + 1)

  const dd = String(d.getUTCDate()).padStart(2, '0')
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const yyyy = d.getUTCFullYear()

  return `${dd}.${mm}.${yyyy}`
}
