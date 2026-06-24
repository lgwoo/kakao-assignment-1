import TodoEditForm from '@/components/TodoEditForm'

export default async function TodoEditPage({ params }: { params: { todoId: string } }) {
  const todoId = params.todoId  // URL의 [todoId] 값
  
  // 나중에 여기서 actions.ts 호출해서 기존 todo 데이터 가져옴
  // const todo = await getTodo(Number(todoId))
  
  return (
    <div>
      <h1>수정</h1>
      <TodoEditForm todoId={Number(todoId)} />
    </div>
  )
}
