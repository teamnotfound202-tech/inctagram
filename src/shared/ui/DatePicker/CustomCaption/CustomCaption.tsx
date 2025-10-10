import s from './CustomCaption.module.scss'
export const CustomMonthDropdown = (props: {
  date: Date
  onChange: (date: Date) => void
}) => {
  const { date, onChange } = props

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 50 + i)

  const handleMonthChange = (monthIndex: number) => {
    const newDate = new Date(date)
    newDate.setMonth(monthIndex)
    onChange(newDate)
  }

  const handleYearChange = (year: number) => {
    const newDate = new Date(date)
    newDate.setFullYear(year)
    onChange(newDate)
  }

  return (
    <div className={s.customDropdowns}>
      <div className={s.selectWrapper}>
        <select
          value={date.getMonth()}
          onChange={(e) => handleMonthChange(Number(e.target.value))}
          className={s.monthSelect}
          aria-label="Select month"
        >
          {months.map((month, index) => (
            <option key={month} value={index}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div className={s.selectWrapper}>
        <select
          value={date.getFullYear()}
          onChange={(e) => handleYearChange(Number(e.target.value))}
          className={s.yearSelect}
          aria-label="Select year"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}