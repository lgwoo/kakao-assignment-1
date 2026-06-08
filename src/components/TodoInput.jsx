import { useState, useRef } from 'react'

export default function TodoInput({ onAdd }) {
  const [value, setValue] = useState('')
  const [showError, setShowError] = useState(false)
  const inputRef = useRef(null)

  function handleAdd() {
    const text = value.trim()
    if (!text) {
      setShowError(true)
      inputRef.current?.focus()
      return
    }
    setShowError(false)
    onAdd(text)
    setValue('')
    inputRef.current?.focus()
  }

  function handleChange(e) {
    setValue(e.target.value)
    if (showError) setShowError(false)
  }

  return (
    <div className="mb-5">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="할 일을 입력하세요"
          maxLength={200}
          className="flex-1 h-12 px-4 border-2 border-app-border rounded-[10px] text-[0.95rem] text-app-dark bg-white outline-none focus:border-primary transition-colors"
        />
        <button
          onClick={handleAdd}
          className="h-12 px-[22px] bg-primary text-white rounded-[10px] text-[0.95rem] font-semibold cursor-pointer transition-colors hover:bg-primary-dark active:scale-[0.97] whitespace-nowrap border-0"
        >
          추가
        </button>
      </div>
      {showError && (
        <p className="mt-2 text-[0.82rem] text-error">할 일을 입력해주세요.</p>
      )}
    </div>
  )
}
