"use client";

import React, { useState, useEffect } from 'react';
import { Trash2, Plus, CheckCircle2, Circle, Calendar, Target, Trophy, Loader2, LogOut } from 'lucide-react';
import { getTodos, addTodo, toggleTodo, deleteTodo, loginUser } from './actions';
import Link from 'next/link';

interface Todo {
  id: number;
  text: string;
  deadline: string;
  completed: boolean;
}

interface UserSession {
  userId: string;
  nickname: string;
  purpose: string;
}

export default function PortfolioTodoApp() {
  const [isMounted, setIsMounted] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [userIdInput, setUserIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [user, setUser] = useState<UserSession | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [deadlineValue, setDeadlineValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const refreshTasks = async () => {
    if (!user) return;
    setLoading(true);
    const data = await getTodos(user.userId);
    setTodos(data as Todo[]);
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    const result = await loginUser(userIdInput, passwordInput);
    
    if (result.success && result.user) {
      setUser(result.user as UserSession);
    } else {
      setLoginError(result.error || "ログインに失敗しました");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) refreshTasks();
  }, [user]);

  if (!isMounted) return null;

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !deadlineValue || !user) return;
    setLoading(true);
    await addTodo(user.userId, inputValue, deadlineValue);
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

  // --- ログイン画面 ---
  if (!user) {
    return (
      <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md text-center">
          <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Target className="text-indigo-600" size={32} />
          </div>
          <h1 className="text-3xl font-black mb-2 text-slate-900">Task Coach</h1>
          <p className="text-slate-500 mb-8 font-medium">人生の目的を見失わないために。</p>
          
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1 block">User ID</label>
              <input
                type="text"
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
                placeholder="ユーザーIDを入力"
                className="w-full px-5 py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold placeholder:text-slate-300"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1 block">Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="パスワードを入力"
                className="w-full px-5 py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold placeholder:text-slate-300"
                required
              />
            </div>
            {loginError && <p className="text-red-500 text-xs font-bold text-center">{loginError}</p>}
            
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-indigo-100">
              {loading ? <Loader2 className="animate-spin" /> : "ログイン"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-400 font-bold mb-4">アカウントをお持ちでないですか？</p>
            <Link href="/register" className="text-indigo-600 font-black hover:underline underline-offset-4">
              新規登録はこちら
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // --- メインダッシュボード ---
  const activeTasks = todos.filter(t => !t.completed);
  const completedTasks = todos.filter(t => t.completed);

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex-1">
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <Target size={18} />
              <span className="font-black text-xs uppercase tracking-widest">Purpose of Life</span>
            </div>
            <p className="text-xl font-bold text-slate-800 italic">“ {user.purpose} ”</p>
          </div>
          <div className="flex items-center gap-6 self-end md:self-center">
            <div className="text-right">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Welcome</p>
              <p className="text-lg font-black text-slate-900">{user.nickname}</p>
            </div>
            <button onClick={() => setUser(null)} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-red-500 transition-colors shadow-sm">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold mb-6">今日のタスクを追加</h3>
              <form onSubmit={handleAddTodo} className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 block mb-1">Task Content</label>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                    placeholder="何をしますか？"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 block mb-1">Deadline</label>
                  <input
                    type="date"
                    value={deadlineValue}
                    onChange={(e) => setDeadlineValue(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  />
                </div>
                <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> 追加</>}
                </button>
              </form>
            </div>
            
            <div className="bg-indigo-600 p-8 rounded-[2rem] text-white shadow-xl shadow-indigo-100">
              <Trophy size={40} className="mb-4 text-indigo-200" />
              <p className="text-indigo-100 font-medium">達成したタスク</p>
              <h4 className="text-5xl font-black mt-2">{completedTasks.length}</h4>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-10">
            <section>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                実行中のタスク <span className="text-indigo-500">{activeTasks.length}</span>
              </h3>
              <div className="space-y-4">
                {activeTasks.map(todo => (
                  <div key={todo.id} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between group shadow-sm hover:border-indigo-300 transition-all">
                    <div className="flex items-center gap-5 flex-1 cursor-pointer" onClick={() => handleToggle(todo.id, todo.completed)}>
                      <Circle size={28} className="text-slate-200 group-hover:text-indigo-500 transition-colors" />
                      <div>
                        <p className="font-bold text-slate-800 text-lg">{todo.text}</p>
                        <p className="text-sm text-slate-400 flex items-center gap-1 mt-1 font-bold"><Calendar size={14} /> {todo.deadline}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(todo.id)} className="text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                  </div>
                ))}
                {activeTasks.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-100 text-slate-300 font-bold">
                    現在、未完了のタスクはありません。
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}