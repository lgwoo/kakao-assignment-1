import TodoEditForm from '@/components/TodoEditForm'
import { getTodo } from '@/app/actions'

export default async function TodoEditPage({ params }: { params: { todoId: string } }) {
  const todoId = Number(params.todoId)
  const todo = await getTodo(todoId) 
  
  return (
    <div>
      <h1>수정</h1>
      <TodoEditForm todoId={todoId} initialText={todo.text} initialDate={todo.date} />
    </div>
  )
}
