"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface TodoEditFormProps {
  todoId: number
}

export default function TodoEditForm({ todoId }: TodoEditFormProps) {
  const [text, setText] = useState('')
  const [date, setDate] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log({ todoId, text, date })  // 미션 5에서 PUT API 연동
    router.push('/todos')
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
