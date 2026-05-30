// ===== 상태 =====
// 모든 Todo 항목을 담는 배열. 각 항목: { id, text, completed, date }
let todos = [];

// 자동 증가 ID (삭제 후 중복 방지)
let nextId = 1;

// 현재 활성 필터: 'all' | 'active' | 'completed'
let currentFilter = 'all';

// 현재 선택된 날짜 (YYYY-MM-DD 형식 문자열)
let selectedDate = getTodayString();

// ===== DOM 참조 =====
const todoInput    = document.getElementById('todoInput');
const addBtn       = document.getElementById('addBtn');
const todoList     = document.getElementById('todoList');
const errorMsg     = document.getElementById('errorMsg');
const emptyMsg     = document.getElementById('emptyMsg');
const dateDisplay  = document.getElementById('dateDisplay');
const todayBadge   = document.getElementById('todayBadge');
const prevDayBtn   = document.getElementById('prevDayBtn');
const nextDayBtn   = document.getElementById('nextDayBtn');
const filterTabs   = document.querySelectorAll('.filter-tab');

// ===== 이벤트 등록 =====

addBtn.addEventListener('click', handleAddTodo);

todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleAddTodo();
});

prevDayBtn.addEventListener('click', () => moveDate(-1));
nextDayBtn.addEventListener('click', () => moveDate(1));

// 필터 탭 클릭 — 이벤트 위임으로 한 번에 처리
document.querySelector('.filter-tabs').addEventListener('click', (e) => {
  const tab = e.target.closest('.filter-tab');
  if (!tab) return;
  setFilter(tab.dataset.filter);
});

// ===== 날짜 유틸 =====

// Date 객체를 'YYYY-MM-DD' 형식 문자열로 변환
function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 오늘 날짜를 'YYYY-MM-DD' 형식 문자열로 반환
function getTodayString() {
  return formatDateKey(new Date());
}

// 'YYYY-MM-DD' 문자열을 한국어 표시 문자열로 변환 (예: 2026년 5월 30일 토)
function formatDateLabel(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  return `${y}년 ${m}월 ${d}일 (${dayNames[date.getDay()]})`;
}

// selectedDate를 기준으로 days만큼 날짜 이동
function moveDate(days) {
  const [y, m, d] = selectedDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  selectedDate = formatDateKey(date);
  renderDateNav();
  renderTodoList();
}

// ===== 날짜 네비게이션 렌더링 =====
function renderDateNav() {
  dateDisplay.textContent = formatDateLabel(selectedDate);

  // 오늘 날짜일 때만 TODAY 뱃지 표시
  const isToday = selectedDate === getTodayString();
  todayBadge.classList.toggle('hidden', !isToday);
}

// ===== 필터 변경 =====
function setFilter(filter) {
  currentFilter = filter;

  filterTabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.filter === filter);
  });

  renderTodoList();
}

// ===== 현재 날짜 + 필터에 맞는 Todo 배열 반환 =====
function getFilteredTodos() {
  // 1단계: 선택된 날짜로 필터
  const byDate = todos.filter((t) => t.date === selectedDate);

  // 2단계: 상태 필터 적용
  if (currentFilter === 'active')    return byDate.filter((t) => !t.completed);
  if (currentFilter === 'completed') return byDate.filter((t) =>  t.completed);
  return byDate; // 'all'
}

// ===== Todo 추가 =====
function handleAddTodo() {
  const text = todoInput.value.trim();

  if (!text) {
    showError(true);
    todoInput.focus();
    return;
  }

  showError(false);

  // 현재 선택된 날짜를 todo에 함께 저장
  const newTodo = { id: nextId++, text, completed: false, date: selectedDate };
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

  const textEl = item.querySelector('.todo-text');
  textEl.classList.add('hidden');

  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'edit-input';
  editInput.value = todo.text;
  editInput.maxLength = 200;

  const editBtn = item.querySelector('.btn-edit');
  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn btn-save';
  saveBtn.textContent = '저장';
  saveBtn.addEventListener('click', () => saveEdit(id, editInput));

  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveEdit(id, editInput);
  });

  item.insertBefore(editInput, textEl);
  editBtn.replaceWith(saveBtn);
  editInput.focus();
  editInput.select();
}

// ===== Todo 수정 저장 =====
function saveEdit(id, editInput) {
  const newText = editInput.value.trim();

  if (!newText) {
    editInput.focus();
    return;
  }

  const todo = findTodoById(id);
  if (todo) todo.text = newText;

  renderTodoList();
}

// ===== 목록 렌더링 =====
function renderTodoList() {
  todoList.innerHTML = '';

  const filtered = getFilteredTodos();

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

// ===== 날짜·필터별 빈 상태 안내 문구 =====
function getEmptyMessage() {
  if (currentFilter === 'active')    return '진행 중인 할 일이 없어요.';
  if (currentFilter === 'completed') return '완료된 할 일이 없어요.';
  return '이 날의 할 일이 없어요. 추가해보세요!';
}

// ===== 단일 Todo 항목 DOM 생성 =====
function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = `todo-item${todo.completed ? ' completed' : ''}`;
  li.dataset.id = todo.id;

  const textSpan = document.createElement('span');
  textSpan.className = 'todo-text';
  textSpan.textContent = todo.text;

  const btnGroup = document.createElement('div');
  btnGroup.className = 'btn-group';

  const completeBtn = document.createElement('button');
  completeBtn.className = 'btn btn-complete';
  completeBtn.textContent = todo.completed ? '취소' : '완료';
  completeBtn.addEventListener('click', () => toggleComplete(todo.id));

  const editBtn = document.createElement('button');
  editBtn.className = 'btn btn-edit';
  editBtn.textContent = '수정';
  editBtn.disabled = todo.completed;
  editBtn.style.opacity = todo.completed ? '0.4' : '1';
  editBtn.addEventListener('click', () => startEdit(todo.id));

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
renderDateNav();
renderTodoList();
