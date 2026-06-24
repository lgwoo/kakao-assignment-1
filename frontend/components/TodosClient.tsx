"use client"

import { useState } from 'react'
import { Todo } from '@/types/todo'
import { getTodayString, getMondayOfWeek, formatDateKey } from '@/utils/dateUtils'
import WeekNav from './WeekNav'
import FilterTabs from './FilterTabs'
import TodoInput from './TodoInput'
import TodoList from './TodoList'

export default function TodosClient() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [selectedDate, setSelectedDate] = useState(getTodayString())
  const [weekOffset, setWeekOffset] = useState(0)


  function addTodo(text: string) {
    setTodos(prev => [...prev, { id: Date.now(), text, completed: false, date: selectedDate }])
  }

  function toggleComplete(id: number) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  function deleteTodo(id: number) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function saveTodo(id: number, newText: string) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, text: newText } : t))
  }

  function navigateWeek(direction: number) {
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
        <WeekNav todos={todos} selectedDate={selectedDate} weekOffset={weekOffset} onSelectDate={setSelectedDate} onNavigateWeek={navigateWeek} onGoToToday={goToToday} />
        <TodoInput onAdd={addTodo} />
        <FilterTabs filter={filter} todos={todos} selectedDate={selectedDate} onFilterChange={setFilter} />
        <TodoList todos={todos} filter={filter} selectedDate={selectedDate} onToggleComplete={toggleComplete} onDelete={deleteTodo} onSave={saveTodo} />
      </div>
    </div>
  )
}
