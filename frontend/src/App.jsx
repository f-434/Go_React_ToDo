// 作者名：四百三十四点七五
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // useState 类似于 Vue 中的 ref()。
  // 第一个变量是当前的值，第二个是修改这个值的专用函数。
  // 在 React 里，绝对不能直接写 todos = [...]，必须用 setTodos([...])。
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const API_URL = 'http://localhost:8080/todos';

  // useEffect 这里的用法等同于 Vue 的 onMounted() 生命周期钩子。
  // 第二个参数传空数组 []，表示这个函数只在页面刚加载时执行一次。
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    // 拿到 Go 后端的数据后，更新状态
    setTodos(data || []);
  };

  const addTodo = async (e) => {
    e.preventDefault(); // 阻止表单默认的刷新页面的提交行为
    if (!title.trim()) return;

    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, completed: false }),
    });
    
    // 提交完清空输入框，并重新拉取列表
    setTitle('');
    setDescription('');
    fetchTodos();
  };

  const toggleTodo = async (id) => {
    // 触发我们 Go 后端的 ToggleTodo 函数
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
    });
    fetchTodos();
  };

  return (
    <div className="App" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'left' }}>
      <h1 style={{ textAlign: 'center' }}>Todo List (Go + React)</h1>
      
      {/* 提交表单 */}
      <form onSubmit={addTodo} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="待办标题..." 
          value={title} 
          // 当输入框内容改变时，手动同步给 title 变量（代替 Vue 的 v-model）
          onChange={(e) => setTitle(e.target.value)} 
          required 
          style={{ flex: 1, padding: '8px' }}
        />
        <input 
          type="text" 
          placeholder="备注详情..." 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          style={{ flex: 2, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>添加</button>
      </form>

      {/* 列表渲染 */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {/* map 相当于 Vue 的 v-for */}
        {todos.map(todo => (
          <li 
            key={todo.id} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '12px', 
              borderBottom: '1px solid #eee',
              backgroundColor: todo.completed ? '#f9f9f9' : 'white'
            }}
          >
            <input 
              type="checkbox" 
              checked={todo.completed} 
              onChange={() => toggleTodo(todo.id)} 
              style={{ marginRight: '15px', transform: 'scale(1.5)' }}
            />
            <div style={{ textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#999' : '#333' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{todo.title}</div>
              {todo.description && <div style={{ fontSize: '14px', marginTop: '4px' }}>{todo.description}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;