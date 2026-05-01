import { useEffect, useState } from 'react'
import './App.css'

function App() {
  // --- [1. 상태 관리 (State)] ---
  const [todos, setTodos] = useState([]);
  // 검색
  const [searchTerm, setSearchTerm] = useState("");
  // 정렬
  const [sortType, setSortType] = useState("tno");
  
  // 입력 양식 상태
  const [todoInput, setTodoInput] = useState({
    title: '', 
    content: '', 
    dueDate: new Date().toISOString().split('T')[0], 
    priority: 2, 
    category: '일반'
  });

  // 수정 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  // --- [2. API 통신 및 데이터 처리] ---
  
  // 데이터 불러오기 (정렬/검색어 변경 시 자동 실행)
  useEffect(() => {
    fetchTodos();
  }, [sortType, searchTerm]);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/todos?sort=${sortType}&keyword=${searchTerm}`);
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      console.error("데이터 로딩 실패:", err);
    }
  };

  // 신규 등록
  const handleAddTodo = () => {
    if (!todoInput.title.trim()) {
      alert("제목을 입력해주세요!");
      return;
    }

    fetch('http://localhost:8081/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...todoInput, finished: false })
    })
    .then(response => {
      if (response.ok) {
        alert("등록 성공!");
        setTodoInput({
          title: '', content: '', 
          dueDate: new Date().toISOString().split('T')[0], 
          priority: 2, category: '일반'
        });
        fetchTodos(); // 새로고침 대신 목록 재요청
      }
    });
  };

  // 삭제 처리
  const handleDelete = (tno) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    fetch(`http://localhost:8081/api/todos?mode=delete&tno=${tno}`, { method: 'POST' })
      .then(response => {
        if (response.ok) fetchTodos();
      });
  };

  // 완료 상태 토글
  const handleToggleTodo = (todo) => {
    fetch(`http://localhost:8081/api/todos?mode=updateFinished&tno=${todo.tno}&finished=${!todo.finished}`, {
      method: 'POST'
    }).then(response => {
      if (response.ok) fetchTodos();
    });
  };

  // --- [3. 모달 및 수정 핸들러] ---
  
  const openModal = (todo) => {
    // 날짜 배열 형식을 문자열(YYYY-MM-DD)로 변환
    let formattedDate = todo.dueDate;
    if (Array.isArray(todo.dueDate)) {
      const [year, month, day] = todo.dueDate;
      formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    setEditingTodo({ ...todo, dueDate: formattedDate });
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    fetch(`http://localhost:8081/api/todos?mode=modify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingTodo)
    }).then(response => {
      if (response.ok) {
        setIsModalOpen(false);
        fetchTodos();
      }
    });
  };

  // --- [4. 이벤트 리스너] ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTodoInput({ ...todoInput, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTodo({ ...editingTodo, [name]: value });
  };

  // --- [5. 화면 렌더링] ---
  return (
    <div className="app-container">
      <h1>실시간 할 일 관리</h1>

      {/* 등록 섹션 */}
      <div className="input-group-container">
        <div className='input-row'>
          <input name='title' type="text" placeholder="할 일 제목" value={todoInput.title} onChange={handleInputChange} />
          <input name='dueDate' type='date' value={todoInput.dueDate} onChange={handleInputChange} />
          <select name='category' value={todoInput.category} onChange={handleInputChange}>
            <option value='일반'>일반</option>
            <option value='공부'>공부</option>
            <option value='업무'>업무</option>
            <option value='운동'>운동</option>
          </select>
        </div>
        <div className="input-row">
          <textarea name='content' placeholder='상세 내용' value={todoInput.content} onChange={handleInputChange} />
          <div className="priority-group">
            <label>우선순위: </label>
            <select name='priority' value={todoInput.priority} onChange={handleInputChange}>
              <option value='1'>낮음</option>
              <option value='2'>보통</option>
              <option value='3'>높음</option>
            </select>
          </div>
          <button onClick={handleAddTodo} className="add-btn">등록</button>
        </div>
        
        {/* 검색 및 정렬 제어 */}
        <div className="todo-list-controls">
          <input type="text" placeholder="검색어 입력..." value={searchTerm} 
                 onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
          <select value={sortType} onChange={(e) => setSortType(e.target.value)} className="sort-select">
            <option value="tno">최신등록순</option>
            <option value="dueDate">마감임박순</option>
            <option value="priority">우선순위순</option>
          </select>
        </div>
      </div>

      <hr />

      {/* 목록 섹션 */}
      {todos.length === 0 ? (
        <p>데이터가 없습니다.</p>
      ) : (
        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.tno} className={`todo-item ${todo.finished ? 'completed' : ''}`}>
              <div className="todo-checkbox"> 
                <input type="checkbox" checked={todo.finished} onChange={() => handleToggleTodo(todo)} />
              </div>             
              <div className="todo-content" onClick={() => openModal(todo)}>
                <div className="todo-header">
                  <span className="todo-tno">#{todo.tno}</span>
                  <span className={`priority-badge p${todo.priority}`}>
                    {todo.priority === 3 ? "🔥 높음" : todo.priority === 2 ? "✅ 보통" : "💤 낮음"}
                  </span>
                  <span className="category-badge">{todo.category}</span>
                </div>
                <strong className="todo-title">{todo.title}</strong>
                {todo.content && <p className="todo-desc">{todo.content}</p>}
                <span className="due-date">📅 기한: {Array.isArray(todo.dueDate) ? todo.dueDate.join('-') : todo.dueDate}</span>
              </div>
              <button onClick={() => handleDelete(todo.tno)} className="delete-btn">삭제</button>
            </li>
          ))}
        </ul>
      )}

      {/* 수정 모달 */}
      {isModalOpen && editingTodo && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>할 일 수정</h2>
            <div className="modal-body">
              <label>제목</label>
              <input name="title" value={editingTodo.title} onChange={handleEditChange} />
              <label>상세 내용</label>
              <textarea name="content" value={editingTodo.content} onChange={handleEditChange} />
              <div className="modal-row">
                <div>
                  <label>기한</label>
                  <input name="dueDate" type="date" value={editingTodo.dueDate} onChange={handleEditChange} />
                </div>
                <div>
                  <label>우선순위</label>
                  <select name="priority" value={editingTodo.priority} onChange={handleEditChange}>
                    <option value="1">낮음</option>
                    <option value="2">보통</option>
                    <option value="3">높음</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleUpdate} className="save-btn">저장</button>
              <button onClick={() => setIsModalOpen(false)} className="cancel-btn">취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;