import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LucideIcon } from '../components/LucideIcon';

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setIsLoading(true);
    setError('');
    try {
      await login(email.trim(), password);
      const user = useAuthStore.getState().user;
      navigate(user?.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center pt-12 pb-16 px-4 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.04] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-brand-600/15 blur-[110px] pointer-events-none" />

      <div className="w-full max-w-md p-6 sm:p-10 rounded-3xl bg-surface border border-line shadow-2xl shadow-black/40 relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <span className="text-white font-black text-sm tracking-tighter italic">AI</span>
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight">AI Nest</span>
          </Link>
          <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1 font-semibold">Track subscriptions, purchase bundles, and retrieve credentials.</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Email Address</label>
            <div className="relative">
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-surface-2 px-3.5 py-2.5 pl-10 rounded-xl border border-line focus:outline-none focus:border-brand-500 text-xs font-bold text-white placeholder-slate-500"
              />
              <LucideIcon name="Mail" size={13} className="text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Password</label>
            <div className="relative">
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-2 px-3.5 py-2.5 pl-10 rounded-xl border border-line focus:outline-none focus:border-brand-500 text-xs font-mono font-bold text-white placeholder-slate-500"
              />
              <LucideIcon name="Lock" size={13} className="text-slate-500 absolute left-3.5 top-3.5" />
            </div>
            <div className="text-right mt-1">
              <a href="#" className="text-[10px] text-brand-400 font-extrabold hover:underline">Forgot password?</a>
            </div>
          </div>

          {error && <p className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3.5 py-2.5">{error}</p>}

          <button
            type="submit" disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-brand-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading
              ? <><LucideIcon name="RefreshCcw" size={13} className="animate-spin" /> Signing in...</>
              : <><LucideIcon name="LogIn" size={14} /> Access My Dashboard</>}
          </button>
        </form>

        <p className="text-center mt-6 text-xs text-slate-400 font-bold">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 hover:underline font-black">Register now</Link>
        </p>
      </div>
    </div>
  );
}
