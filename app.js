// ===== 상수 =====
const STORAGE_KEY = 'todo-app-data';

// ===== 상태 =====
// 모든 Todo 항목을 담는 배열. 각 항목: { id, text, completed, date }
let todos = [];

// 자동 증가 ID (삭제 후 중복 방지)
let nextId = 1;

// 현재 활성 필터: 'all' | 'active' | 'completed'
let currentFilter = 'all';

// 현재 선택된 날짜 (YYYY-MM-DD)
let selectedDate = getTodayString();

// 주간 뷰 오프셋: 0 = 이번 주, -1 = 지난 주, +1 = 다음 주
let weekOffset = 0;

// ===== DOM 참조 =====
const todoInput      = document.getElementById('todoInput');
const addBtn         = document.getElementById('addBtn');
const todoList       = document.getElementById('todoList');
const errorMsg       = document.getElementById('errorMsg');
const emptyMsg       = document.getElementById('emptyMsg');
const weekRangeLabel = document.getElementById('weekRangeLabel');
const weekDayRow     = document.getElementById('weekDayRow');
const prevWeekBtn    = document.getElementById('prevWeekBtn');
const nextWeekBtn    = document.getElementById('nextWeekBtn');
const filterTabs     = document.querySelectorAll('.filter-tab');
const todayBtn       = document.getElementById('todayBtn');

// ===== 이벤트 등록 =====

addBtn.addEventListener('click', handleAddTodo);

todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleAddTodo();
});

prevWeekBtn.addEventListener('click', () => navigateWeek(-1));
nextWeekBtn.addEventListener('click', () => navigateWeek(1));
todayBtn.addEventListener('click', goToToday);

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

// weekOffset 기준으로 해당 주의 월요일 Date 객체 반환
function getMondayOfWeek() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = today.getDay(); // 0=일, 1=월 ... 6=토
  // 일요일(0)이면 -6, 그 외엔 1-day 만큼 빼서 월요일로 이동
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday + weekOffset * 7);
  return monday;
}

// 현재 weekOffset 기준 주의 월~일 Date 배열(7개) 반환
function getWeekDates() {
  const monday = getMondayOfWeek();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

// ===== 주간 네비게이션 =====

// 주 이동: direction = -1(이전) or +1(다음)
function navigateWeek(direction) {
  weekOffset += direction;
  // 새 주로 이동하면 해당 주 월요일을 선택
  selectedDate = formatDateKey(getWeekDates()[0]);
  renderAll();
}

// 오늘 날짜가 속한 주로 이동하고 오늘을 선택
function goToToday() {
  weekOffset = 0;
  selectedDate = getTodayString();
  renderAll();
}

// ===== 주간 뷰 렌더링 =====
function renderWeekNav() {
  const dates    = getWeekDates();
  const first    = dates[0];
  const last     = dates[6];
  const todayStr = getTodayString();
  const DAY_NAMES = ['월', '화', '수', '목', '금', '토', '일'];

  // 주 범위 레이블: 월이 바뀌면 '6월' 포함, 연도가 바뀌면 '2027년' 포함
  const firstY = first.getFullYear();
  const firstM = first.getMonth() + 1;
  const lastM  = last.getMonth()  + 1;
  const lastY  = last.getFullYear();

  let rangeText = `${firstY}년 ${firstM}월 ${first.getDate()}일 ~ `;
  if (lastY !== firstY) rangeText += `${lastY}년 `;
  if (lastM !== firstM) rangeText += `${lastM}월 `;
  rangeText += `${last.getDate()}일`;
  weekRangeLabel.textContent = rangeText;

  // 날짜 셀 렌더링
  weekDayRow.innerHTML = '';

  dates.forEach((date, i) => {
    const dateStr    = formatDateKey(date);
    const isToday    = dateStr === todayStr;
    const isSelected = dateStr === selectedDate;
    // 해당 날짜에 속한 todo 개수
    const count = todos.filter((t) => t.date === dateStr).length;

    const cell = document.createElement('div');
    cell.className = 'week-day-cell';
    if (isToday)    cell.classList.add('today');
    if (isSelected) cell.classList.add('selected');

    const dayNameEl = document.createElement('span');
    dayNameEl.className = 'day-name';
    dayNameEl.textContent = DAY_NAMES[i];

    const dayNumberEl = document.createElement('span');
    dayNumberEl.className = 'day-number';
    dayNumberEl.textContent = date.getDate();

    const countEl = document.createElement('span');
    countEl.className = `todo-count${count === 0 ? ' hidden' : ''}`;
    countEl.textContent = count;

    cell.append(dayNameEl, dayNumberEl, countEl);

    // 날짜 클릭 시 해당 날짜 선택
    cell.addEventListener('click', () => {
      selectedDate = dateStr;
      renderAll();
    });

    weekDayRow.appendChild(cell);
  });
}

// ===== 로컬스토리지 =====

// todos 배열과 nextId를 로컬스토리지에 저장
function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ todos, nextId }));
  } catch (e) {
    alert('저장 공간이 부족해 데이터를 저장하지 못했어요.');
  }
}

// 로컬스토리지에서 데이터를 불러와 todos, nextId를 복원
function loadTodos() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const data = JSON.parse(raw);
    todos  = Array.isArray(data.todos)          ? data.todos  : [];
    nextId = typeof data.nextId === 'number'    ? data.nextId : 1;
  } catch {
    // JSON 파싱 실패 시 손상된 데이터 제거 후 초기 상태 유지
    localStorage.removeItem(STORAGE_KEY);
  }
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
  todos.push({ id: nextId++, text, completed: false, date: selectedDate });
  saveTodos();

  todoInput.value = '';
  todoInput.focus();

  renderAll();
}

// ===== Todo 완료 토글 =====
function toggleComplete(id) {
  const todo = findTodoById(id);
  if (todo) todo.completed = !todo.completed;
  saveTodos();
  renderAll();
}

// ===== Todo 삭제 =====
function deleteTodo(id) {
  if (!confirm('정말 삭제할까요?')) return;

  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderAll();
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
  saveTodos();

  renderAll();
}

// 선택된 날짜 기준 Todo 개수를 각 필터 탭에 표시
function updateFilterCounts() {
  const byDate = todos.filter((t) => t.date === selectedDate);
  const counts = {
    all:       byDate.length,
    active:    byDate.filter((t) => !t.completed).length,
    completed: byDate.filter((t) =>  t.completed).length,
  };
  const labels = { all: '전체', active: '진행 중', completed: '완료' };

  filterTabs.forEach((tab) => {
    const filter = tab.dataset.filter;
    tab.textContent = counts[filter] > 0
      ? `${labels[filter]} (${counts[filter]})`
      : labels[filter];
  });
}

// ===== renderAll: 주간 뷰 + Todo 목록 동시 갱신 =====
// Todo 개수가 주간 뷰에도 반영되므로 항상 함께 호출
function renderAll() {
  renderWeekNav();
  renderTodoList();
  updateFilterCounts();
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
    todoList.appendChild(createTodoElement(todo));
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

// ===== 초기화: 로컬스토리지 복원 후 렌더링 =====
loadTodos();
renderAll();
