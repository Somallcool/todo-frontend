import { useEffect, useState } from 'react';
import './App.css';

function App() {
  // --- [1. 상태 관리 (State)] ---

  // 전체 할 일 목록 데이터를 저장하는 배열.
  const [todos, setTodos] = useState([]);
  
  // 사용자가 입력한 검색어를 저장하는 문자열.
  const [searchTerm, setSearchTerm] = useState("");
  
  // 정렬 기준을 저장(tno: 최신순, dueDate: 마감순, priority: 우선순위순).
  const [sortType, setSortType] = useState("tno");
  
  // 신규 할 일 입력을 위한 객체 형태의 상태. 제목, 내용, 기한, 우선순위, 카테고리 포함.
  const [todoInput, setTodoInput] = useState({
    title: '', 
    content: '', 
    dueDate: new Date().toISOString().split('T')[0], 
    priority: 2, 
    category: '일반'
  });

  // 수정 모달창의 표시 여부를 결정하는 불리언 값.
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 현재 수정 중인 특정 할 일 데이터를 임시 저장하는 객체.
  const [editingTodo, setEditingTodo] = useState(null);


  // --- [2. API 통신 및 데이터 처리] ---
  
  // 정렬 기준이나 검색어가 변경될 때마다 서버에서 데이터를 다시 가져옴.
  useEffect(() => {
    fetchTodos();
  }, [sortType, searchTerm]);

  // 백엔드 API로부터 조건에 맞는 할 일 목록을 요청.
  const fetchTodos = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/todos?sort=${sortType}&keyword=${searchTerm}`);
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      console.error("데이터 로딩 실패:", err);
    }
  };

  // 신규 할 일을 서버에 POST 방식으로 등록 요청.
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
        // 등록 성공 후 입력 필드 초기화.
        setTodoInput({
          title: '', content: '', 
          dueDate: new Date().toISOString().split('T')[0], 
          priority: 2, category: '일반'
        });
        fetchTodos();
      }
    });
  };

  // 특정 할 일을 번호(tno) 기준으로 삭제 요청.
  const handleDelete = (tno) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    fetch(`http://localhost:8081/api/todos?mode=delete&tno=${tno}`, { method: 'POST' })
      .then(response => {
        if (response.ok) fetchTodos();
      });
  };

  // 완료(checked) 상태인 항목들만 필터링하여 일괄 삭제 요청.
  const handleDeleteFinished = () => {
    const finishedIds = todos
      .filter(todo => todo.finished)
      .map(todo => todo.tno);

    if (finishedIds.length === 0) {
      alert("완료된 항목이 없습니다.");
      return;
    }

    if (!confirm(`완료된 ${finishedIds.length}개의 항목을 삭제하시겠습니까?`)) return;
  
    fetch(`http://localhost:8081/api/todos?mode=deleteSelected&nos=${finishedIds.join(',')}`, {
      method: 'POST'
    }).then(response => {
      if (response.ok) {
        alert("완료된 항목들이 삭제되었습니다.");
        fetchTodos();
      }
    });
  };

  // 데이터베이스의 모든 할 일 데이터를 삭제하는 초기화 기능.
  const handleDeleteAll = () => {
    if (!confirm("정말 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return;

    fetch(`http://localhost:8081/api/todos?mode=deleteAll`, {
      method: 'POST'
    }).then(response => {
      if (response.ok) {
        alert("모든 데이터가 삭제되었습니다.");
        fetchTodos();
      }
    });
  };

  // 할 일의 완료 여부(finished)를 반전시켜 업데이트 요청.
  const handleToggleTodo = (todo) => {
    fetch(`http://localhost:8081/api/todos?mode=updateFinished&tno=${todo.tno}&finished=${!todo.finished}`, {
      method: 'POST'
    }).then(response => {
      if (response.ok) fetchTodos();
    });
  };


  // --- [3. 모달 및 수정 핸들러] ---
  
  // 수정 버튼 클릭 시 모달을 열고 해당 항목의 데이터를 셋팅. 날짜 형식 변환 포함.
  const openModal = (todo) => {
    let formattedDate = todo.dueDate;
    if (Array.isArray(todo.dueDate)) {
      const [year, month, day] = todo.dueDate;
      formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    setEditingTodo({ ...todo, dueDate: formattedDate });
    setIsModalOpen(true);
  };

  // 모달에서 수정한 내용을 서버에 최종 반영 요청.
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

  // 등록 폼의 input 값이 변할 때마다 todoInput 상태를 실시간 업데이트.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTodoInput({ ...todoInput, [name]: value });
  };

  // 모달 폼의 input 값이 변할 때마다 editingTodo 상태를 실시간 업데이트.
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTodo({ ...editingTodo, [name]: value });
  };


  // --- [5. 화면 렌더링] ---
  return (
    <div className="app-container">
      <h1>실시간 할 일 관리</h1>

      {/* 할 일 등록 섹션: 제목, 기한, 카테고리, 상세내용 입력 가능. */}
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
          <textarea name='content' placeholder='상세 내용을 입력하세요...' value={todoInput.content} onChange={handleInputChange} />
          <div className="priority-group">
            <label>우선순위 </label>
            <select name='priority' value={todoInput.priority} onChange={handleInputChange}>
              <option value='1'>낮음</option>
              <option value='2'>보통</option>
              <option value='3'>높음</option>
            </select>
          </div>
          <button onClick={handleAddTodo} className="add-btn">등록하기</button>
        </div>
      </div>

      <hr className="section-divider" />

      {/* 검색 및 정렬 섹션: 실시간 검색어 입력 및 정렬 옵션 선택. */}
      <div className="search-sort-container">
        <div className="search-box">
          <span className="icon">🔍</span>
          <input type="text" placeholder="어떤 할 일을 찾으시나요?" value={searchTerm} 
                 onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
        </div>
        <div className="sort-box">
          <label>정렬 기준: </label>
          <select value={sortType} onChange={(e) => setSortType(e.target.value)} className="sort-select">
            <option value="tno">최신등록순</option>
            <option value="dueDate">마감임박순</option>
            <option value="priority">우선순위순</option>
          </select>
        </div>
      </div>

      <hr className="section-divider" />

      {/* 일괄 작업 섹션: 완료 항목 삭제 및 전체 초기화 버튼. */}
      <div className="batch-actions-container">
        <div className="action-buttons">
          <button onClick={handleDeleteFinished} className="delete-finished-btn">선택 완료 항목 삭제</button>
          <button onClick={handleDeleteAll} className="delete-all-btn">전체 데이터 초기화</button>
        </div>
      </div>

      <hr className="list-top-divider" />

      {/* 목록 섹션: 데이터 유무에 따라 비어있는 상태 또는 할 일 리스트 출력. */}
      {todos.length === 0 ? (
        <div className="empty-state">
          <p>등록된 할 일이 없습니다. 새로운 계획을 추가해보세요!</p>
        </div>
      ) : (
        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.tno} className={`todo-item ${todo.finished ? 'completed' : ''}`}>
              {/* 완료 체크박스: 클릭 시 즉시 서버 상태와 동기화. */}
              <div className="todo-checkbox-wrapper"> 
                <input type="checkbox" checked={todo.finished} onChange={() => handleToggleTodo(todo)} />
              </div>             
              {/* 할 일 상세 내용: 클릭 시 수정 모달 오픈. */}
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

      {/* 수정 모달창: 수정 중인 상태(editingTodo)가 존재할 때만 렌더링. */}
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