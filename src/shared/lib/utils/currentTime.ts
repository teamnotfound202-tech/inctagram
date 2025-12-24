import { ISOStringFormat } from 'date-fns'

export const currentTime = (date: ISOStringFormat)=> {
  return new Intl.DateTimeFormat('ru-Ru', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}