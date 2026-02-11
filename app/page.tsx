"use client";

import React, { useState, useEffect } from 'react';
import { Trash2, Plus, CheckCircle2, Circle, Calendar, User, Trophy, Loader2 } from 'lucide-react';
import { getTodos, addTodo, toggleTodo, deleteTodo } from './actions';

interface Todo {
  id: number;
  user_name: string;
  text: string;
  deadline: string;
  completed: boolean;
}

export default function PortfolioTodoApp() {
  const [isMounted, setIsMounted] = useState(false); // 追加：マウント状態
  const [todos, setTodos] = useState<Todo[]>([]);
  const [userName, setUserName] = useState('');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [deadlineValue, setDeadlineValue] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. サーバーとクライアントの不一致を防ぐための処理
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const refreshTasks = async () => {
    if (!userName) return;
    setLoading(true);
    const data = await getTodos(userName);
    setTodos(data as Todo[]);
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      setIsUserLoggedIn(true);
    }
  };

  useEffect(() => {
    if (isUserLoggedIn) refreshTasks();
  }, [isUserLoggedIn]);

  // マウントされる（ブラウザの準備ができる）までは何も表示しない（エラー防止）
  if (!isMounted) return null;

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !deadlineValue) return;
    setLoading(true);
    await addTodo(userName, inputValue, deadlineValue);
    setInputValue('');
    setDeadlineValue('');
    await refreshTasks();
  };

  const handleToggle = async (id: number, currentStatus: boolean) => {
    await toggleTodo(id, !currentStatus);
    await refreshTasks();
  };

  const handleDelete = async (id: number) => {
    await deleteTodo(id);
    await refreshTasks();
  };

  // ログイン画面
  if (!isUserLoggedIn) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md text-center">
          <h1 className="text-4xl font-black mb-2 text-slate-800 tracking-tighter">My Portfolio</h1>
          <p className="text-slate-500 mb-8 font-medium">Task Management System</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="あなたの名前を入力"
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold text-lg"
              required
            />
            <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95">
              ログインして開始
            </button>
          </form>
        </div>
      </main>
    );
  }

  const activeTasks = todos.filter(t => !t.completed);
  const completedTasks = todos.filter(t => t.completed);

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <span className="text-indigo-600 font-bold tracking-widest text-xs uppercase">Portfolio App</span>
            <h2 className="text-4xl font-black text-slate-900 mt-1">{userName}'s Dashboard</h2>
          </div>
          <button onClick={() => setIsUserLoggedIn(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm underline decoration-2 underline-offset-4">Logout</button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">新規タスク追加</h3>
              <form onSubmit={handleAddTodo} className="space-y-5">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-tighter mb-2 block">Task Name</label>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="何を達成しますか？"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-tighter mb-2 block">Deadline</label>
                  <input
                    type="date"
                    value={deadlineValue}
                    onChange={(e) => setDeadlineValue(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> タスクを登録</>}
                </button>
              </form>
            </div>
            
            <div className="bg-indigo-600 p-8 rounded-[2rem] text-white shadow-2xl shadow-indigo-200">
              <Trophy size={40} className="mb-4 text-indigo-200" />
              <p className="text-indigo-100 font-medium">現在の達成実績</p>
              <h4 className="text-5xl font-black mt-2">{completedTasks.length} <span className="text-xl font-normal opacity-60">Tasks</span></h4>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-10">
            <section>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                Active Tasks <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px]">{activeTasks.length}</span>
              </h3>
              <div className="space-y-4">
                {activeTasks.map(todo => (
                  <div key={todo.id} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-indigo-300 transition-all shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-5 flex-1 cursor-pointer" onClick={() => handleToggle(todo.id, todo.completed)}>
                      <Circle size={28} className="text-slate-200 group-hover:text-indigo-500 transition-colors" />
                      <div>
                        <p className="font-bold text-slate-800 text-lg">{todo.text}</p>
                        <p className="text-sm text-slate-400 font-medium flex items-center gap-1 mt-1">
                          <Calendar size={14} /> 期限: {todo.deadline}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(todo.id)} className="text-slate-200 hover:text-red-500 p-2 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Completed Experience</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedTasks.map(todo => (
                  <div key={todo.id} className="bg-slate-100/50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                      <span className="text-slate-500 line-through font-medium truncate italic">{todo.text}</span>
                    </div>
                    <button onClick={() => handleDelete(todo.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}