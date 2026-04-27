import { useEffect, useState } from 'react'

// 자바 스크립트 안에 HTML을 넣은 JSX 파일.
// function App(): 컴포넌트. App이라는 이름의 화면 조각을 만들겠다.
function App() {
  // useState와 useEffect는 리액트 핵심 엔진
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    // 8081 포트의 우리 자바 서버로 데이터 요청!
    // > 8081 가서 데이터 가져와라(fetch)
    fetch('http://localhost:8081/api/todos')
    // .then: 가져오는 데 시간 좀 걸리니 다 가져오면 그 다음에 일을 해라는 약속. 비동기 처리
      .then(response => response.json())
      .then(data => {
        console.log("받아온 데이터:", data);
        setTodos(data);
      })
      .catch(err => console.error("데이터 로딩 실패:", err));
  }, []);

// 등록  
  const handleAddTodo = () => {
    if (!newTitle.trim()) {
      return;
    }
    // 서버로 보낼 fetch(POST) 코드 자리
    // console.log("서버로 보낼 내용: ", newTitle);

    const todoData = {
      title: newTitle, 
      dueDate: new Date().toISOString().split('T')[0],
      finished: false
    };

    fetch('http://localhost:8081/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(todoData)
    })
    .then(response => {
      if(response.ok) {
        alert("등록 성공!");
        setNewTitle('');
        window.location.reload();
      }
    })
    .catch(err => console.error("등록 실패: ", err));
    
  }
// 삭제
  const hadnleDelete = (tno) => {
    if(!confirm("정말 삭제하시겠습니까?")) return;

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
  const handleToggleTodo = (todo) => {
    fetch(`http://localhost:8081/api/todos?mode=update&tno=${todo.tno}&finished=${!todo.finished}`, {

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
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>실시간 할 일 관리 (Oracle DB)</h1>

      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="새로운 할 일을 입력하세요"
          value={newTitle} // 바구니와 연결
          onChange={(e) => setNewTitle(e.target.value)} // 글자 칠 때마다 바구니 업데이트
          style={{ padding: '8px', width: '250px' }}
        />
        <button 
          onClick={handleAddTodo} // 버튼 클릭 시 함수 실행
          style={{ padding: '8px 15px', marginLeft: '5px', cursor: 'pointer' }}
        >
          등록
        </button>
      </div>

      <hr />
      
      {todos.length === 0 ? (
        <p>데이터를 불러오는 중이거나 데이터가 없습니다.</p>
      ) : (
        <ul style={{ lineHeight: '2' }}>
          {todos.map(todo => (
            <li key={todo.tno} style={{marginBottom: '10px' }}>
              <span 
                onClick={() => handleToggleTodo(todo)}
                style={{
                  cursor: 'pointer',
                  textDecoration: todo.finished ? 'line-through' : 'none', //완료 시 가로줄
                  color: todo.finished ? '#ccc' : '#000'
                }}
              >
                <strong>{todo.title}</strong> 
                <span style={{ color: '#666', marginLeft: '10px' }}>
                  ({todo.dueDate[0]}-{todo.dueDate[1]}-{todo.dueDate[2]})
                </span>
                {todo.finished ? ' ✅' : ' ⏳'}
              </span>

  {/* onClick에 () => handelDelete에서 () => 이거 안 쓰면 화면 그려지자마자 함수가 실행돼서
      모든 데이터가 지워져 버린다. 그러니 클릭했을 때만 행해라 라는 뜻으로 
      화살표 함수라는 보자기에 싸서 전달하는 것. */}
                <button 
                  onClick={() => handleDelete(todo.tno)} 
                  style={{marginLeft: '10px', color: 'red', cursor: 'pointer' }}>
                삭제
                </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App