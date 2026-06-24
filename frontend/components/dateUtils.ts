export function formatDateKey(date : Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getTodayString(): string {
  return formatDateKey(new Date())
}

export function getMondayOfWeek(weekOffset = 0): Date {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const day = today.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  const monday = new Date(today)
  monday.setDate(today.getDate() + diffToMonday + weekOffset * 7)
  return monday
}

export function getWeekDates(weekOffset = 0): Date[] {
  const monday = getMondayOfWeek(weekOffset)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}
