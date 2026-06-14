import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LucideIcon } from '../components/LucideIcon';

export function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim() || !password) return;

    setIsLoading(true);
    setError('');

    try {
      await register(name.trim(), email.trim(), password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FD] flex items-center justify-center pt-24 pb-16 px-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-inner-violet/5 blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md p-6 sm:p-10 rounded-3xl bg-white border border-neutral-100 shadow-2xl relative z-10">
        
        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-md">
              <span className="text-white font-black text-sm tracking-tighter italic">AI</span>
            </div>
            <span className="font-extrabold text-xl text-neutral-900 tracking-tight">AI Nest</span>
          </Link>
          <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
            Register Your Premium Account
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-semibold">
            Join 15,000+ creators and scale your AI production pipelines!
          </p>
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">Full Legal Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full bg-neutral-50 px-3.5 py-2.5 pl-10 rounded-xl border border-neutral-100 focus:bg-white focus:outline-none focus:border-violet-400 text-xs font-bold text-neutral-800"
              />
              <LucideIcon name="User" size={13} className="text-neutral-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">E-mail Coordinates</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@domain.com"
                className="w-full bg-neutral-50 px-3.5 py-2.5 pl-10 rounded-xl border border-neutral-100 focus:bg-white focus:outline-none focus:border-violet-400 text-xs font-bold text-neutral-800"
              />
              <LucideIcon name="Mail" size={13} className="text-neutral-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">Setup Access Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-50 px-3.5 py-2.5 pl-10 rounded-xl border border-neutral-100 focus:bg-white focus:outline-none focus:border-violet-400 text-xs font-mono font-bold text-neutral-800"
              />
              <LucideIcon name="Lock" size={13} className="text-neutral-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {error && (
            <p className="text-xs font-bold text-red-500 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 hover:shadow-lg shadow-violet-500/10 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <LucideIcon name="RefreshCcw" size={13} className="animate-spin" />
                Provisioning Account Profiles...
              </>
            ) : (
              <>
                <LucideIcon name="UserPlus" size={14} />
                Register My Credentials
              </>
            )}
          </button>

        </form>

        <p className="text-center mt-6 text-xs text-neutral-400 font-bold">
          Already have an active profile?{' '}
          <Link to="/login" className="text-violet-600 hover:underline font-black">
            Log in now
          </Link>
        </p>

      </div>
    </div>
  );
}
