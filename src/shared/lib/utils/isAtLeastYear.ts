import type { Validate } from 'react-hook-form'
import { GeneralInformaitionValues } from '@/shared/api/types'

// ≥ N лет: принимает string (ISO) ИЛИ Date
const makeAtLeastYears =
  (n: number): Validate<string | Date, GeneralInformaitionValues> =>
    (value) => {
      if (value === '' || value == null) return 'Укажите дату рождения'

      let y: number, m: number, d: number

      if (value instanceof Date) {
        if (isNaN(value.getTime())) return 'Некорректная дата'
        y = value.getFullYear()
        m = value.getMonth()
        d = value.getDate()
      } else if (typeof value === 'string') {
        const ymd = value.slice(0, 10).split('-')
        if (ymd.length !== 3) return 'Некорректная дата'
        y = Number(ymd[0])
        m = Number(ymd[1]) - 1
        d = Number(ymd[2])
        if (!y || m < 0 || !d) return 'Некорректная дата'
      } else {
        return 'Некорректная дата'
      }

      const dob = new Date(y, m, d) // локальная календарная дата (без времени)
      const today = new Date()
      const cutoff = new Date(today.getFullYear() - n, today.getMonth(), today.getDate())

      return dob <= cutoff || `Вам должно быть не менее ${n} лет`
    }

// частный случай: 13 лет
export const validateAtLeast13: Validate<string | Date, GeneralInformaitionValues> =
  makeAtLeastYears(13)
