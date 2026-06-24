import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'http://localhost:8000'  // 미션 6에서 env로 교체

export async function PUT(
  request: NextRequest,
  { params }: { params: { todoId: string } }
) {
  const body = await request.json()
  const res = await fetch(`${BACKEND_URL}/todos/${params.todoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: { todoId: string } }
) {
  const res = await fetch(`${BACKEND_URL}/todos/${params.todoId}`, {
    method: 'DELETE',
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}