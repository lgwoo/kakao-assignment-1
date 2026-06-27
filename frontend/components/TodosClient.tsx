"use client"

import { useEffect, useState } from 'react'
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


  async function addTodo(text: string) {
    const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, date: selectedDate }),
    })
    const newTodo = await res.json()
    setTodos(prev => [...prev, newTodo])
}


  async function toggleComplete(id: number) {
  const todo = todos.find(t => t.id === id)!
  const res = await fetch(`/api/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !todo.completed }),
  })
  const updated = await res.json()
  setTodos(prev => prev.map(t => t.id === id ? updated : t))
}
    

  async function deleteTodo(id: number) {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete todo')
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  async function saveTodo(id: number, newText: string) {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText }),
    })
    const updated = await res.json()
    setTodos(prev => prev.map(t => t.id === id ? updated : t))
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

useEffect(() => {
  async function fetchTodos() {
    try {
      const res = await fetch(`/api/todos?date=${selectedDate}`)
      if (!res.ok) throw new Error('Network response was not ok')
      const data = await res.json()
      setTodos(data)
    } catch (error) {
      console.error("Failed to fetch todos:", error)
    }
  }
  fetchTodos()
}, [selectedDate])


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
