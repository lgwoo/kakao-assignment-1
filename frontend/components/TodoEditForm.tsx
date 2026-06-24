"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface TodoEditFormProps {
  todoId: number
  initialText: string
  initialDate: string
}

export default function TodoEditForm({ todoId, initialText, initialDate }: TodoEditFormProps) {
  const [text, setText] = useState(initialText)
  const [date, setDate] = useState(initialDate)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch(`/api/todos/${todoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.trim(), date }),
    })
    if (res.ok) router.push('/todos')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="할 일" maxLength={200} />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <button type="submit">저장</button>
      <button type="button" onClick={() => router.push('/todos')}>취소</button>
    </form>
  )
}
