'use server'

const BACKEND_URL = process.env.BACKEND_URL!

export async function getTodos(date: string) {
  const res = await fetch(`${BACKEND_URL}/todos?date=${date}`)
  if (!res.ok) throw new Error('Failed to fetch todos')
  return res.json()
}

export async function getTodo(id: number) {
  const res = await fetch(`${BACKEND_URL}/todos/${id}`)
  if (!res.ok) throw new Error('Todo not found')
  return res.json()
}
