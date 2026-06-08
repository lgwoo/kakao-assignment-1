import { useState, useRef, useEffect } from 'react'

export default function TodoItem({ todo, onToggleComplete, onDelete, onSave }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.text)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const editInputRef = useRef(null)

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus()
      editInputRef.current?.select()
    }
  }, [isEditing])

  function handleStartEdit() {
    setEditValue(todo.text)
    setIsEditing(true)
    setShowDeleteConfirm(false)
  }

  function handleSave() {
    const trimmed = editValue.trim()
    if (!trimmed) {
      editInputRef.current?.focus()
      return
    }
    onSave(todo.id, trimmed)
    setIsEditing(false)
  }

  function handleEditKeyDown(e) {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') {
      setIsEditing(false)
      setEditValue(todo.text)
    }
  }

  function handleConfirmDelete() {
    onDelete(todo.id)
    setShowDeleteConfirm(false)
  }

  const btnBase = 'h-8 px-3 rounded-[7px] text-[0.78rem] font-semibold transition-colors active:scale-95 cursor-pointer border-0'

  return (
    <li className={`flex items-center gap-3 border rounded-[10px] p-[14px_16px] transition-shadow hover:shadow-[0_2px_10px_rgba(103,43,224,0.08)] ${todo.completed ? 'bg-[#faf9fe] border-app-border' : 'bg-white border-app-border'}`}>
      {isEditing ? (
        <input
          ref={editInputRef}
          type="text"
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onKeyDown={handleEditKeyDown}
          maxLength={200}
          className="flex-1 h-9 px-[10px] border-2 border-primary rounded-[7px] text-[0.95rem] text-app-dark outline-none"
        />
      ) : (
        <span className={`flex-1 text-[0.95rem] leading-[1.4] break-all ${todo.completed ? 'line-through text-app-muted' : 'text-app-dark'}`}>
          {todo.text}
        </span>
      )}

      <div className="flex gap-[6px] shrink-0 items-center">
        <button
          onClick={() => onToggleComplete(todo.id)}
          className={`${btnBase} ${todo.completed ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-primary-light text-primary hover:bg-[#ddd4f7]'}`}
        >
          {todo.completed ? '취소' : '완료'}
        </button>

        {isEditing ? (
          <button onClick={handleSave} className={`${btnBase} bg-primary text-white hover:bg-primary-dark`}>
            저장
          </button>
        ) : (
          <button
            onClick={handleStartEdit}
            disabled={todo.completed}
            className={`${btnBase} bg-[#f0f0f0] text-[#555] hover:bg-[#e0e0e0] ${todo.completed ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            수정
          </button>
        )}

        {showDeleteConfirm ? (
          <div className="flex items-center gap-1">
            <span className="text-[0.75rem] text-error whitespace-nowrap">삭제할까요?</span>
            <button onClick={handleConfirmDelete} className={`${btnBase} bg-error text-white hover:bg-[#c03030]`}>
              예
            </button>
            <button onClick={() => setShowDeleteConfirm(false)} className={`${btnBase} bg-[#f0f0f0] text-[#555] hover:bg-[#e0e0e0]`}>
              아니오
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className={`${btnBase} bg-[#fdeaea] text-error hover:bg-[#fbd4d4]`}
          >
            삭제
          </button>
        )}
      </div>
    </li>
  )
}
