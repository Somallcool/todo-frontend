import { useEffect, useState } from 'react'
import './App.css'
// 자바 스크립트 안에 HTML을 넣은 JSX 파일.
// function App(): 컴포넌트. App이라는 이름의 화면 조각을 만들겠다.
function App() {
  // useState와 useEffect는 리액트 핵심 엔진
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState({
    title: '', 
    content: '', 
    dueDate: new Date().toISOString().split('T')[0], 
    priority: 2, 
    category: '일반'
  });
  const [sortType, setSortType] = useState("tno");

  // Prompt 대신 모달창으로 바꾸기 26/4/30
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, [sortType]);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/todos?sort=${sortType}`);
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      console.error("데이터 로딩 실패:", err);
    }
  };

  // 등록  
  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setTodoInput({
      ...todoInput, 
      [name]: value
    });
  };

  const handleAddTodo = () => {
    if (!todoInput.title.trim()) {
      alert("제목을 입력해주세요!");
      return;
    }

    fetch('http://localhost:8081/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...todoInput, 
        finished: false
      })
    })
      .then(response => {
        if (response.ok) {
          alert("등록 성공!");
          setTodoInput({
            title: '', 
            content: '', 
            dueDate: new Date().toISOString().split('T')[0], 
            priority: 2, 
            category: '일반'
          });
          window.location.reload();
        }
      })
      .catch(err => console.error("등록 실패: ", err));

  };
  // 삭제
  const handleDelete = (tno) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    fetch(`http://localhost:8081/api/todos?mode=delete&tno=${tno}`, {
      method: 'POST'
    })
      .then(response => {
        if (response.ok) {
          alert("삭제되었습니다.");
          window.location.reload();
        }
      })
      .catch(err => console.error("삭제 실패:", err));
  };

  // 수정
  // 1. 모달 열기 함수
  const openModal = (todo) => {
    let formattedDate = todo.dueDate;
    if (Array.isArray(todo.dueDate)) {
      const [year, month, day] = todo.dueDate;
      formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    setEditingTodo({
      ...todo, 
    dueDate: formattedDate
  });
    setIsModalOpen(true);
  };

  // 2, 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  // 3. 모달 내 입력값 변경 함수
  const handleEditChange = (e) => {
    const {name, value} = e.target;
    setEditingTodo({...editingTodo, [name]: value});
  };

  // 4. 모달 내 '수정 완료' 버튼 클릭 시
  const handleUpdate = () => {
    fetch(`http://localhost:8081/api/todos?mode=modify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingTodo)
    })
      .then(response => {
        if (response.ok) {
          alert("수정되었습니다.");
          window.location.reload();
        }
      });
  };

  // 상태 업데이트
  const handleToggleTodo = (todo) => {
    fetch(`http://localhost:8081/api/todos?mode=updateFinished&tno=${todo.tno}&finished=${!todo.finished}`, {

      method: 'POST'
    })
      .then(response => {
        if (response.ok) {
          window.location.reload();
        }
      })
      .catch(err => console.error("수정 실패:", err))
  };


  return (
    <div className="app-container">
      <h1>실시간 할 일 관리</h1>

      <div className="input-group-container">
        <div className='input-row'>
          {/* 제목 입력 */}
          <input
            name='title'
            type="text"
            placeholder="새로운 할 일을 요약하세요"
            value={todoInput.title} // 바구니와 연결
            onChange={handleInputChange} // 글자 칠 때마다 바구니 업데이트
          />
          {/* 날짜 선택기 */}
          <input
            name='dueDate'
            type='date'
            value={todoInput.dueDate}
            onChange={handleInputChange}
          />
          {/* 카테고리 선택 */}
          <select name='category' value={todoInput.category} onChange={handleInputChange}>
            <option value='일반'>일반</option>
            <option value='공부'>공부</option>
            <option value='업무'>업무</option>
            <option value='운동'>운동</option>
          </select>
        </div>

        <div className="input-row">
          {/* 상세 내용 입력 */}
          <textarea 
            name='content'
            placeholder='상세 내용을 입력하세요'
            value={todoInput.content}
            onChange={handleInputChange}
          />
        

          {/* 우선순위 선택 */}
          <div className="priority-group">
            <label>우선순위: </label>
            <select name='priority' value={todoInput.priority} onChange={handleInputChange}>
              <option value='1'>낮음</option>
              <option value='2'>보통</option>
              <option value='3'>높음</option>
            </select>
          </div>

          <button onClick={handleAddTodo} className="add-btn">
            등록
          </button>
        </div>
      </div>

      <hr />
      {/* 
        onClick에 () => handelDelete에서 () => 이거 안 쓰면 화면 그려지자마자 함수가 실행돼서
        모든 데이터가 지워져 버린다. 그러니 클릭했을 때만 행해라 라는 뜻으로 
        화살표 함수라는 보자기에 싸서 전달하는 것. 
      */}
      {todos.length === 0 ? (
        <p>데이터를 불러오는 중이거나 데이터가 없습니다.</p>
      ) : (
        <ul className="todo-list">
          <div className="todo-list-controls">
            <select 
              value={sortType} 
              onChange={(e) => setSortType(e.target.value)}
              className="sort-select"
            >
              <option value="tno">최신등록순</option>
              <option value="dueDate">마감임박순</option>
              <option value="priority">우선순위순</option>
            </select>
          </div>
          {todos.map(todo => (
            <li key={todo.tno} className={`todo-item ${todo.finished ? 'completed' : ''}`}>
              <div className="todo-checkbox"> 
                <input
                  type="checkbox"
                  checked={todo.finished}
                  onChange={() => handleToggleTodo(todo)} // 클릭 시 완료 상태 반전 함수 호출
                />
              </div>             
             {/* 클릭 시 prompt 대신 openModal 호출 */}
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
                <span className="due-date">📅 기한: {todo.dueDate.join('-')}</span>
             </div>

              {/* 삭제 버튼 */}
              <button onClick={() => handleDelete(todo.tno)} className="delete-btn">
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* 모달 UI */}
      {isModalOpen && editingTodo && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>할 일 수정</h2>
            <div className="modal-body">
              <label>제목</label>
              <input 
                name="title" 
                value={editingTodo.title} 
                onChange={handleEditChange} 
              />
              
              <label>상세 내용</label>
              <textarea 
                name="content" 
                value={editingTodo.content} 
                onChange={handleEditChange} 
              />
              
              <div className="modal-row">
                <div>
                  <label>기한</label>
                  <input 
                    name="dueDate" 
                    type="date" 
                    value={editingTodo.dueDate} 
                    onChange={handleEditChange} 
                  />
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
              <button onClick={closeModal} className="cancel-btn">취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App