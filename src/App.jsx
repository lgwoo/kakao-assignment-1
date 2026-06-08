import { useState, useEffect } from 'react'
import WeekNav from './components/WeekNav'
import FilterTabs from './components/FilterTabs'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'
import { getTodayString, getMondayOfWeek, formatDateKey } from './utils/dateUtils'

const STORAGE_KEY = 'todo-app-data'

function loadFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return { todos: [], nextId: 1 }
  try {
    const data = JSON.parse(raw)
    return {
      todos: Array.isArray(data.todos) ? data.todos : [],
      nextId: typeof data.nextId === 'number' ? data.nextId : 1,
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return { todos: [], nextId: 1 }
  }
}

export default function App() {
  const [{ todos, nextId }, setStore] = useState(loadFromStorage)
  const [filter, setFilter] = useState('all')
  const [selectedDate, setSelectedDate] = useState(getTodayString)
  const [weekOffset, setWeekOffset] = useState(0)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ todos, nextId }))
    } catch {
      // localStorage 공간 부족
    }
  }, [todos, nextId])

  function addTodo(text) {
    setStore(prev => ({
      todos: [...prev.todos, { id: prev.nextId, text, completed: false, date: selectedDate }],
      nextId: prev.nextId + 1,
    }))
  }

  function toggleComplete(id) {
    setStore(prev => ({
      ...prev,
      todos: prev.todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t),
    }))
  }

  function deleteTodo(id) {
    setStore(prev => ({
      ...prev,
      todos: prev.todos.filter(t => t.id !== id),
    }))
  }

  function saveTodo(id, newText) {
    setStore(prev => ({
      ...prev,
      todos: prev.todos.map(t => t.id === id ? { ...t, text: newText } : t),
    }))
  }

  function navigateWeek(direction) {
    const newOffset = weekOffset + direction
    setWeekOffset(newOffset)
    setSelectedDate(formatDateKey(getMondayOfWeek(newOffset)))
  }

  function goToToday() {
    setWeekOffset(0)
    setSelectedDate(getTodayString())
  }

  return (
    <div className="min-h-screen bg-app-bg flex justify-center px-4 py-[60px]">
      <div className="w-full max-w-[560px]">
        <h1 className="text-[2rem] font-bold text-primary mb-6 tracking-tight">Todo</h1>
        <WeekNav
          todos={todos}
          selectedDate={selectedDate}
          weekOffset={weekOffset}
          onSelectDate={setSelectedDate}
          onNavigateWeek={navigateWeek}
          onGoToToday={goToToday}
        />
        <TodoInput onAdd={addTodo} />
        <FilterTabs
          filter={filter}
          todos={todos}
          selectedDate={selectedDate}
          onFilterChange={setFilter}
        />
        <TodoList
          todos={todos}
          filter={filter}
          selectedDate={selectedDate}
          onToggleComplete={toggleComplete}
          onDelete={deleteTodo}
          onSave={saveTodo}
        />
      </div>
    </div>
  )
}
