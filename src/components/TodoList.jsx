import TodoItem from './TodoItem'

function getEmptyMessage(filter) {
  if (filter === 'active') return '진행 중인 할 일이 없어요.'
  if (filter === 'completed') return '완료된 할 일이 없어요.'
  return '이 날의 할 일이 없어요. 추가해보세요!'
}

export default function TodoList({ todos, filter, selectedDate, onToggleComplete, onDelete, onSave }) {
  const byDate = todos.filter(t => t.date === selectedDate)
  const filtered =
    filter === 'active' ? byDate.filter(t => !t.completed)
    : filter === 'completed' ? byDate.filter(t => t.completed)
    : byDate

  if (filtered.length === 0) {
    return (
      <p className="text-center text-app-muted text-[0.9rem] mt-10">
        {getEmptyMessage(filter)}
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-[10px] list-none p-0">
      {filtered.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onSave={onSave}
        />
      ))}
    </ul>
  )
}
