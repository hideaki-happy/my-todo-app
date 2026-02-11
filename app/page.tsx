"use client";

import React, { useState, useEffect } from 'react';
import { Trash2, Plus, CheckCircle2, Circle } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. 【読み込み】アプリが起動した時に、保存されたデータを取得する
  useEffect(() => {
    const saved = localStorage.getItem('my-todo-data');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
    setIsInitialized(true); // 読み込み完了
  }, []);

  // 2. 【保存】タスク（todos）が更新されるたびに、データを保存する
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('my-todo-data', JSON.stringify(todos));
    }
  }, [todos, isInitialized]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const newTodo: Todo = { id: Date.now(), text: inputValue, completed: false };
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // 読み込みが終わるまで画面を真っ白にしないための処理
  if (!isInitialized) return null;

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">My Tasks (Saved)</h1>
        
        <form onSubmit={addTodo} className="flex gap-2 mb-8">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="何をする？"
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors">
            <Plus size={24} />
          </button>
        </form>

        <ul className="space-y-3">
          {todos.length === 0 && (
            <p className="text-center text-slate-400 py-4">タスクがありません</p>
          )}
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg group hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => toggleTodo(todo.id)}>
                {todo.completed ? <CheckCircle2 className="text-green-500" /> : <Circle className="text-slate-300" />}
                <span className={`text-slate-700 ${todo.completed ? 'line-through text-slate-400' : ''}`}>
                  {todo.text}
                </span>
              </div>
              <button onClick={() => deleteTodo(todo.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 size={20} />
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-8 pt-6 border-t border-slate-100 text-sm text-slate-500 flex justify-between">
          <span>全 {todos.length} 件</span>
          <span>完了 {todos.filter(t => t.completed).length} 件</span>
        </div>
      </div>
    </main>
  );
}