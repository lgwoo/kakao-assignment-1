import { getTodayString, getWeekDates, formatDateKey } from '../utils/dateUtils'

const DAY_NAMES = ['월', '화', '수', '목', '금', '토', '일']

export default function WeekNav({ todos, selectedDate, weekOffset, onSelectDate, onNavigateWeek, onGoToToday }) {
  const dates = getWeekDates(weekOffset)
  const todayStr = getTodayString()

  const first = dates[0]
  const last = dates[6]
  const firstY = first.getFullYear()
  const firstM = first.getMonth() + 1
  const lastM = last.getMonth() + 1
  const lastY = last.getFullYear()

  let rangeText = `${firstY}년 ${firstM}월 ${first.getDate()}일 ~ `
  if (lastY !== firstY) rangeText += `${lastY}년 `
  if (lastM !== firstM) rangeText += `${lastM}월 `
  rangeText += `${last.getDate()}일`

  return (
    <div className="bg-white border border-app-border rounded-[14px] p-3 mb-5">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => onNavigateWeek(-1)}
          aria-label="이전 주"
          className="w-10 h-10 rounded-lg text-primary text-2xl flex items-center justify-center hover:bg-primary-xlight transition-colors cursor-pointer"
        >
          ‹
        </button>
        <span className="text-[0.88rem] font-bold text-app-dark text-center flex-1 mx-2">
          {rangeText}
        </span>
        <button
          onClick={onGoToToday}
          className="h-8 px-7 border-[1.5px] border-primary rounded-full text-primary text-[0.78rem] font-bold hover:bg-primary hover:text-white transition-colors cursor-pointer"
        >
          오늘
        </button>
        <button
          onClick={() => onNavigateWeek(1)}
          aria-label="다음 주"
          className="w-10 h-10 rounded-lg text-primary text-2xl flex items-center justify-center hover:bg-primary-xlight transition-colors cursor-pointer ml-2"
        >
          ›
        </button>
      </div>

      <div className="flex gap-1">
        {dates.map((date, i) => {
          const dateStr = formatDateKey(date)
          const isToday = dateStr === todayStr
          const isSelected = dateStr === selectedDate
          const count = todos.filter(t => t.date === dateStr).length

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={[
                'flex-1 min-w-0 flex flex-col items-center gap-[5px] py-3 px-2 rounded-[10px] transition-colors cursor-pointer select-none border-0',
                isSelected
                  ? 'bg-primary hover:bg-primary-dark ' + (isToday ? 'shadow-[inset_0_0_0_2px_rgba(255,255,255,0.55)]' : '')
                  : isToday
                  ? 'bg-primary-xlight hover:bg-primary-xlight'
                  : 'hover:bg-primary-xlight',
              ].join(' ')}
            >
              <span className={`text-[0.72rem] font-semibold ${isSelected ? 'text-white' : isToday ? 'text-primary' : 'text-app-muted'}`}>
                {DAY_NAMES[i]}
              </span>
              <span className={`text-base font-bold leading-none ${isSelected ? 'text-white' : isToday ? 'text-primary' : 'text-app-dark'}`}>
                {date.getDate()}
              </span>
              {count > 0 && (
                <span className={`text-[0.68rem] font-bold rounded-full px-[6px] py-[1px] min-w-[18px] text-center leading-[1.6] ${isSelected ? 'bg-white/25 text-white' : 'bg-primary-light text-primary'}`}>
                  {count}
                </span>
              )}
              {count === 0 && <span className="h-[1.4rem]" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
