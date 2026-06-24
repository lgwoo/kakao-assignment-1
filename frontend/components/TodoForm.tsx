"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getTodayString } from '@/utils/dateUtils'

export default function TodoForm() {
  const [text, setText] = useState('')
  const [date, setDate] = useState(getTodayString())
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.trim(), date }),
    })
    if (res.ok) router.push('/todos')
  }


  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="할 일" maxLength={200} />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <button type="submit">추가</button>
      <button type="button" onClick={() => router.push('/todos')}>취소</button>
    </form>
  )
}
