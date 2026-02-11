"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '../actions';
import { UserPlus, ArrowLeft, Loader2, Target } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (result.success) {
      alert("登録が完了しました！ログイン画面に移動します。");
      router.push('/'); 
    } else {
      setError(result.error || "エラーが発生しました");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl w-full max-w-md border border-slate-100">
        <Link href="/" className="text-slate-400 hover:text-indigo-600 flex items-center gap-1 text-sm mb-6 font-bold transition-colors">
          <ArrowLeft size={16} /> ログインに戻る
        </Link>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Target size={20} />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Create Account</h1>
        </div>
        <p className="text-slate-500 mb-8 text-sm font-medium">あなたの人生の目的をここから始めましょう。</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">User ID</label>
            <input name="userId" type="text" required className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold" placeholder="半角英数字で入力" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Password</label>
            <input name="password" type="password" required className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold" placeholder="••••••••" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nickname</label>
            <input name="nickname" type="text" required className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold" placeholder="お名前（表示用）" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email</label>
            <input name="email" type="email" required className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold" placeholder="example@mail.com" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Purpose of Life</label>
            <textarea name="purpose" rows={3} required className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="あなたの人生の目的は何ですか？" />
          </div>

          {error && <p className="text-red-500 text-xs font-bold ml-1">{error}</p>}

          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2 mt-2">
            {loading ? <Loader2 className="animate-spin" /> : <><UserPlus size={20} /> 登録を完了する</>}
          </button>
        </form>
      </div>
    </main>
  );
}