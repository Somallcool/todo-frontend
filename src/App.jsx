import { useEffect, useState } from 'react'

// function App(): 컴포넌트. App이라는 이름의 화면 조각을 만들겠다.
function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // 8080 포트의 우리 자바 서버로 데이터 요청!
    // > 8080 가서 데이터 가져와라(fetch)
    fetch('http://localhost:8081/api/todos')
    // .then: 가져오는 데 시간 좀 걸리니 다 가져오면 그 다음에 일을 해라는 약속. 비동기 처리
      .then(response => response.json())
      .then(data => {
        console.log("받아온 데이터:", data);
        setTodos(data);
      })
      .catch(err => console.error("데이터 로딩 실패:", err));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>실시간 할 일 관리 (Oracle DB)</h1>
      <hr />
      {todos.length === 0 ? (
        <p>데이터를 불러오는 중이거나 데이터가 없습니다.</p>
      ) : (
        <ul style={{ lineHeight: '2' }}>
          {todos.map(todo => (
            <li key={todo.tno}>
              <strong>{todo.title}</strong> 
              <span style={{ color: '#666', marginLeft: '10px' }}>
                ({todo.dueDate[0]}-{todo.dueDate[1]}-{todo.dueDate[2]})
              </span>
              {todo.finished ? ' ✅' : ' ⏳'}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App