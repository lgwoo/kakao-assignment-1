"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TodoForm() {
  const [text, setText] = useState('')
  const [date, setDate] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // 미션 5에서 API 연동 — 지금은 콘솔 확인만
    console.log({ text, date })
    router.push('/todos')
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
