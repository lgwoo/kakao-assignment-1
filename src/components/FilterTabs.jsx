const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'active', label: '진행 중' },
  { key: 'completed', label: '완료' },
]

export default function FilterTabs({ filter, todos, selectedDate, onFilterChange }) {
  const byDate = todos.filter(t => t.date === selectedDate)
  const counts = {
    all: byDate.length,
    active: byDate.filter(t => !t.completed).length,
    completed: byDate.filter(t => t.completed).length,
  }

  return (
    <div className="flex gap-1.5 mb-5 border-b-2 border-app-border">
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={[
            'h-11 px-5.5 rounded-t-lg text-[0.88rem] font-semibold transition-colors -mb-0.5 border-0 border-b-2 cursor-pointer',
            filter === key
              ? 'text-primary border-primary bg-primary-xlight'
              : 'text-app-muted border-transparent hover:text-primary hover:bg-primary-light',
          ].join(' ')}
        >
          {counts[key] > 0 ? `${label} (${counts[key]})` : label}
        </button>
      ))}
    </div>
  )
}
