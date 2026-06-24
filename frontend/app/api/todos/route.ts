import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'http://localhost:8000'  // 미션 6에서 env로 교체

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const res = await fetch(`${BACKEND_URL}/todos${date ? `?date=${date}` : ''}`)
  const data = await res.json()
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const res = await fetch(`${BACKEND_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
