"use client";

import React, { useState, useEffect } from 'react';
import { Trash2, CheckSquare } from 'lucide-react';

type Category = '仕事' | 'プライベート' | 'その他' | 'すべて';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: Category;
  dueDate: string;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [category, setCategory] = useState<Category>('仕事');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState<Category>('すべて');

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue,
      completed: false,
      category: category,
      dueDate: dueDate || '期限なし',
    };

    setTodos([...todos, newTodo]);
    setInputValue('');
    setDueDate('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const filteredTodos = todos.filter(t => filter === 'すべて' || t.category === filter);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 font-sans text-gray-800">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-700">ToDo App</h1>

        <form onSubmit={addTodo} className="flex gap-2 mb-8">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="タスクを入力してください..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="仕事">仕事</option>
            <option value="プライベート">プライベート</option>
            <option value="その他">その他</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium">
            追加
          </button>
        </form>

        <div className="flex justify-center gap-2 mb-8">
          {(['すべて', '仕事', 'プライベート', 'その他'] as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                filter === cat
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredTodos.length === 0 ? (
            <p className="text-center text-gray-400 py-8">タスクがありません</p>
          ) : (
            filteredTodos.map(todo => (
              <div key={todo.id} className="flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <div className="flex-1">
                  <p className={`text-base ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {todo.text}
                  </p>
                  <div className="flex gap-2 mt-1 text-xs text-gray-400">
                    <span>{todo.category}</span>
                    <span>期限: {todo.dueDate}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="px-3 py-1 border border-red-200 text-red-500 text-xs rounded hover:bg-red-50 transition-colors"
                >
                  削除
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
