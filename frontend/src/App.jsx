// 作者名：四百三十四点七五
import { useState, useEffect } from 'react';
import './App.css';

import { Input, Button, Listy, Checkbox, message, Popconfirm, Typography, Space, Flex, Avatar, List, Layout, Menu } from 'antd';
// 引入图标
import { PlusOutlined, DeleteOutlined, SunOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout

function App() {
  // useState 类似于 Vue 中的 ref()。
  // 第一个变量是当前的值，第二个是修改这个值的专用函数。
  // 在 React 里，绝对不能直接写 todos = [...]，必须用 setTodos([...])。
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // 加载动画
  const [loading, setLoading] = useState(false)



  const API_URL = 'http://localhost:8080/todos';

  // useEffect 这里的用法等同于 Vue 的 onMounted() 生命周期钩子。
  // 第二个参数传空数组 []，表示这个函数只在页面刚加载时执行一次。
  useEffect(() => {
    fetchTodos();
  }, []);

  // 获取新数据
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

  //删除
  const delTodo = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    // 刷新数据
    fetchTodos();
  }

  return (
    <div style={{ padding: '0 10%', backgroundColor: '#f0f2f5', minHeight: '100vh', boxSizing: 'border-box' }}>
      <Layout style={{ 
        height: '100vh',  
        boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
      }}>
        
        {/* ================= 左侧导航 ================= */}
        <Sider theme='light' width={260} style={{ borderRight: '1px solid #f0f0f0' }}>
          <div style={{ padding: '24px 20px', fontSize: '18px', fontWeight: 'bold', textAlign: 'left' }}>
            Go_React_ToDo
          </div>
          {/* 左侧菜单 */}
        </Sider>

        {/* ================= 右侧主界面 ================= */}
        <Layout>
          <Content style={{ padding: 0, background: '#fff', display: 'flex' }}>
            
            <div style={{ width: '100%', background: '#fff', display: 'flex', flexDirection: 'column', height: '100%' }}>
              
              {/* 上半部分：列表展示区 */}
              <div style={{ padding: '20px 40px 0', flex: 1, overflowY: 'auto' }}>
                <List
                  dataSource={todos}
                  rowKey="id"
                  renderItem={(todo) => (
                    <List.Item
                      style={{
                        backgroundColor: '#fff',
                        marginBottom: '10px',
                        borderRadius: '8px',
                        padding: '12px 20px',
                        border: '1px solid #f0f0f0',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Checkbox
                          checked={todo.completed}
                          onChange={() => toggleTodo(todo.id)}
                          style={{ marginRight: '15px', transform: 'scale(1.2)' }}
                        />
                        <div style={{ textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#999' : '#333' }}>
                          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{todo.title}</div>
                          {todo.description && <div style={{ fontSize: '14px', marginTop: '4px' }}>{todo.description}</div>}
                        </div>
                      </div>

                      <Button danger type="text" icon={<DeleteOutlined />} onClick={() => delTodo(todo.id)} />
                    </List.Item>
                  )}
                />
              </div>

              {/* 下半部分：底部输入区 */}
              <div style={{ padding: '20px 40px', borderTop: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
                <form onSubmit={addTodo} style={{ display: 'flex', gap: '10px', margin: 0 }}>
                  <Input
                    size='large'
                    placeholder='待办标题.....'
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ flex: 1 }}
                    value={title}
                  />
                  <Input
                    size='large'
                    placeholder='备注详情'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <Button size='large' type='primary' htmlType='submit' icon={<PlusOutlined />} style={{ flex: 0.5 }}>
                    添加
                  </Button>
                </form>
              </div>

            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;