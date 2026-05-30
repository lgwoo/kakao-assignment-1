// ===== 상태 =====
// 모든 Todo 항목을 담는 배열. 각 항목: { id, text, completed }
let todos = [];

// 자동 증가 ID (삭제 후 중복 방지)
let nextId = 1;

// 현재 활성 필터: 'all' | 'active' | 'completed'
let currentFilter = 'all';

// ===== DOM 참조 =====
const todoInput  = document.getElementById('todoInput');
const addBtn     = document.getElementById('addBtn');
const todoList   = document.getElementById('todoList');
const errorMsg   = document.getElementById('errorMsg');
const emptyMsg   = document.getElementById('emptyMsg');
// 필터 탭 버튼 NodeList
const filterTabs = document.querySelectorAll('.filter-tab');

// ===== 이벤트 등록 =====

// 추가 버튼 클릭
addBtn.addEventListener('click', handleAddTodo);

// 입력창에서 Enter 키를 눌러도 추가
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleAddTodo();
});

// 필터 탭 클릭 — 이벤트 위임으로 한 번에 처리
document.querySelector('.filter-tabs').addEventListener('click', (e) => {
  const tab = e.target.closest('.filter-tab');
  if (!tab) return;
  setFilter(tab.dataset.filter);
});

// ===== 필터 변경 =====
function setFilter(filter) {
  currentFilter = filter;

  // 탭 active 클래스 갱신
  filterTabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.filter === filter);
  });

  renderTodoList();
}

// ===== 현재 필터에 맞는 Todo 배열 반환 =====
function getFilteredTodos() {
  if (currentFilter === 'active')    return todos.filter((t) => !t.completed);
  if (currentFilter === 'completed') return todos.filter((t) =>  t.completed);
  return todos; // 'all'
}

// ===== Todo 추가 =====
function handleAddTodo() {
  const text = todoInput.value.trim();

  // 빈 입력 검증
  if (!text) {
    showError(true);
    todoInput.focus();
    return;
  }

  showError(false);

  // 새 Todo 객체 생성
  const newTodo = { id: nextId++, text, completed: false };
  todos.push(newTodo);

  todoInput.value = '';
  todoInput.focus();

  renderTodoList();
}

// ===== Todo 완료 토글 =====
function toggleComplete(id) {
  const todo = findTodoById(id);
  if (todo) todo.completed = !todo.completed;
  renderTodoList();
}

// ===== Todo 삭제 =====
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  renderTodoList();
}

// ===== Todo 수정 시작: 텍스트 → 입력창으로 전환 =====
function startEdit(id) {
  const item = document.querySelector(`[data-id="${id}"]`);
  const todo = findTodoById(id);
  if (!item || !todo) return;

  // 텍스트 span 숨기고 입력창 생성
  const textEl = item.querySelector('.todo-text');
  textEl.classList.add('hidden');

  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'edit-input';
  editInput.value = todo.text;
  editInput.maxLength = 200;

  // 수정 버튼 → 저장 버튼으로 교체
  const editBtn = item.querySelector('.btn-edit');
  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn btn-save';
  saveBtn.textContent = '저장';
  saveBtn.addEventListener('click', () => saveEdit(id, editInput));

  // Enter 키로도 저장
  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveEdit(id, editInput);
  });

  // 텍스트 span 자리에 입력창 삽입
  item.insertBefore(editInput, textEl);
  editBtn.replaceWith(saveBtn);
  editInput.focus();
  editInput.select();
}

// ===== Todo 수정 저장 =====
function saveEdit(id, editInput) {
  const newText = editInput.value.trim();

  // 빈 값이면 저장하지 않고 포커스 유지
  if (!newText) {
    editInput.focus();
    return;
  }

  const todo = findTodoById(id);
  if (todo) todo.text = newText;

  // 전체 목록 재렌더링으로 수정 모드 해제
  renderTodoList();
}

// ===== 목록 렌더링 =====
function renderTodoList() {
  // 기존 목록 초기화
  todoList.innerHTML = '';

  const filtered = getFilteredTodos();

  // 빈 상태 메시지: 필터 결과가 없을 때 필터에 맞는 문구 표시
  if (filtered.length === 0) {
    emptyMsg.classList.remove('hidden');
    emptyMsg.textContent = getEmptyMessage();
  } else {
    emptyMsg.classList.add('hidden');
  }

  filtered.forEach((todo) => {
    const li = createTodoElement(todo);
    todoList.appendChild(li);
  });
}

// ===== 필터별 빈 상태 안내 문구 =====
function getEmptyMessage() {
  if (currentFilter === 'active')    return '진행 중인 할 일이 없어요.';
  if (currentFilter === 'completed') return '완료된 할 일이 없어요.';
  return '아직 할 일이 없어요. 추가해보세요!';
}

// ===== 단일 Todo 항목 DOM 생성 =====
function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = `todo-item${todo.completed ? ' completed' : ''}`;
  li.dataset.id = todo.id;

  // 텍스트
  const textSpan = document.createElement('span');
  textSpan.className = 'todo-text';
  textSpan.textContent = todo.text;

  // 버튼 그룹
  const btnGroup = document.createElement('div');
  btnGroup.className = 'btn-group';

  // 완료 버튼
  const completeBtn = document.createElement('button');
  completeBtn.className = 'btn btn-complete';
  completeBtn.textContent = todo.completed ? '취소' : '완료';
  completeBtn.addEventListener('click', () => toggleComplete(todo.id));

  // 수정 버튼 (완료 상태에서는 비활성화)
  const editBtn = document.createElement('button');
  editBtn.className = 'btn btn-edit';
  editBtn.textContent = '수정';
  editBtn.disabled = todo.completed;
  editBtn.style.opacity = todo.completed ? '0.4' : '1';
  editBtn.addEventListener('click', () => startEdit(todo.id));

  // 삭제 버튼
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn-delete';
  deleteBtn.textContent = '삭제';
  deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

  btnGroup.append(completeBtn, editBtn, deleteBtn);
  li.append(textSpan, btnGroup);

  return li;
}

// ===== 유틸: ID로 Todo 찾기 =====
function findTodoById(id) {
  return todos.find((todo) => todo.id === id) || null;
}

// ===== 유틸: 에러 메시지 표시/숨김 =====
function showError(visible) {
  errorMsg.classList.toggle('hidden', !visible);
}

// ===== 초기 렌더링 =====
renderTodoList();
