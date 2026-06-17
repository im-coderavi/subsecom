import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { LucideIcon } from './LucideIcon';
import { BrandLogo } from './BrandLogo';
import { AnimatePresence, motion } from 'motion/react';

const CATEGORIES = [
  { name: 'AI Chat',      id: 'chat',         icon: 'MessageSquare' },
  { name: 'AI Code',      id: 'code',         icon: 'Code2' },
  { name: 'AI Image',     id: 'image',        icon: 'Image' },
  { name: 'AI Video',     id: 'video',        icon: 'Video' },
  { name: 'AI Voice',     id: 'voice',        icon: 'Mic' },
  { name: 'Productivity', id: 'productivity', icon: 'CheckSquare' },
  { name: 'Design',       id: 'design',       icon: 'Palette' },
  { name: 'AI Writing',   id: 'writing',      icon: 'FileText' },
];

const ANNOUNCEMENTS = [
  'ChatGPT Plus 12-month available',
  'Claude Pro lite — instant delivery',
  'Midjourney Pro 6-month account',
  'Gemini Advanced now in stock',
  'Perplexity Pro — limited deal',
  'Cursor Pro for developers',
];

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: '' },
  { to: '/products', label: 'Products', icon: '' },
  { to: '/products?tag=bundles', label: 'Royal', icon: 'Crown' },
  { to: '/cart', label: 'Wallet', icon: 'Wallet' },
  { to: '/products', label: 'Contact', icon: '' },
];

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuthStore();
  const cartCount = useCartStore((s: any) => (s.items?.length ?? 0));

  const [catOpen, setCatOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); setCatOpen(false); }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/products?search=${encodeURIComponent(search.trim())}`); setSearch(''); }
  };

  const isActive = (to: string) => (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to.split('?')[0]) && to !== '/');

  return (
    <>
      {/* ── Top announcement bar ── */}
      <div className="bg-[#161e28] border-b border-line/70 overflow-hidden">
        <div className="max-w-[1400px] mx-auto flex items-center h-9">
          <div className="flex items-center gap-1.5 px-4 flex-shrink-0 border-r border-line/70 h-full">
            <LucideIcon name="Megaphone" size={13} className="text-brand-400" />
            <span className="text-[10px] font-black text-brand-400 uppercase tracking-widest">Latest</span>
          </div>
          <div className="mask-fade-edges overflow-hidden flex-1">
            <div className="marquee-wrapper flex">
              {[0, 1].map((copy) => (
                <div key={copy} className="marquee-fast flex items-center gap-8 flex-shrink-0 pr-8">
                  {ANNOUNCEMENTS.map((a, i) => (
                    <span key={`${copy}-${i}`} className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 whitespace-nowrap">
                      <LucideIcon name="Droplet" size={11} className="text-brand-500 fill-brand-500/30" />
                      {a}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main nav ── */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#1d2732]/90 backdrop-blur-xl border-b border-line shadow-lg shadow-black/30' : 'bg-transparent'}`}>
        <nav className="max-w-[1400px] mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 h-[68px]">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <BrandLogo size="md" />
          </Link>

          {/* Desktop links — centered */}
          <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${isActive(l.to) || (l.to === '/' && location.pathname === '/') ? 'text-brand-400' : 'text-slate-300 hover:text-white'}`}
              >
                {l.icon && <LucideIcon name={l.icon} size={14} className={l.label === 'Royal' ? 'text-gold' : 'text-brand-400'} />}
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
              <input
                type="text" placeholder="Search..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-surface text-sm px-3 py-2 pl-8 rounded-xl border border-line focus:border-brand-500 focus:outline-none w-32 focus:w-44 transition-all placeholder-slate-500 text-white font-medium"
              />
              <LucideIcon name="Search" size={13} className="text-slate-500 absolute left-2.5" />
            </form>

            <Link to="/cart" className="relative p-2.5 rounded-xl hover:bg-surface text-slate-300 hover:text-white transition-colors">
              <LucideIcon name="ShoppingCart" size={19} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-brand-600 text-white text-[9px] font-black flex items-center justify-center">{cartCount}</span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                {user?.role === 'admin'
                  ? <Link to="/admin" className="px-4 py-2 rounded-xl text-sm font-bold text-brand-400 hover:bg-surface transition-all">Admin</Link>
                  : <span className="text-sm text-slate-400 font-medium hidden md:block">Hi, <strong className="text-white">{user?.name?.split(' ')[0]}</strong></span>}
                <button onClick={logout} className="px-4 py-2 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:inline-flex px-5 py-2 rounded-xl text-sm font-bold bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-500/25 transition-all">
                Sign In
              </Link>
            )}

            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2.5 rounded-xl hover:bg-surface text-slate-300 transition-colors">
              <LucideIcon name="Menu" size={20} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black z-50 lg:hidden" />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-[82%] max-w-[320px] bg-[#161e28] border-l border-line z-50 shadow-2xl flex flex-col lg:hidden"
            >
              <div className="p-4 border-b border-line flex items-center justify-between">
                <BrandLogo size="sm" showTagline={false} />
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-xl bg-surface text-slate-400"><LucideIcon name="X" size={16} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                <form onSubmit={handleSearch} className="relative">
                  <input type="text" placeholder="Search tools..." value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-surface text-sm px-3 py-2.5 pl-9 rounded-xl border border-line focus:outline-none focus:border-brand-500 text-white font-medium" />
                  <LucideIcon name="Search" size={14} className="text-slate-500 absolute left-3 top-3" />
                </form>

                <div className="space-y-1">
                  <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">Menu</p>
                  {NAV_LINKS.map((l) => (
                    <Link key={l.label} to={l.to} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-surface hover:text-brand-400 transition-colors">
                      <LucideIcon name={l.icon || 'ChevronRight'} size={16} className="text-slate-500" />
                      {l.label}
                    </Link>
                  ))}
                </div>

                <div>
                  <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">Categories</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <Link key={cat.id} to={`/products?category=${cat.id}`} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface text-xs font-bold text-slate-300 hover:text-brand-400 transition-colors">
                        <LucideIcon name={cat.icon} size={12} className="text-slate-500" />
                        {cat.name.replace('AI ', '')}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-line">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-1">
                      <div className="w-9 h-9 rounded-full bg-brand-500/15 text-brand-400 font-extrabold text-sm flex items-center justify-center">{user?.name?.charAt(0).toUpperCase()}</div>
                      <div>
                        <p className="text-xs font-extrabold text-white">{user?.name}</p>
                        <p className="text-[10px] text-slate-500">{user?.email}</p>
                      </div>
                    </div>
                    {user?.role === 'admin' && <Link to="/admin" className="block w-full text-center py-2.5 rounded-xl bg-brand-500/15 text-brand-400 font-bold text-xs">Admin Panel</Link>}
                    <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full py-2.5 rounded-xl bg-surface hover:bg-surface-3 text-slate-300 font-bold text-xs transition-colors">Sign Out</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" className="flex-1 text-center py-2.5 rounded-xl bg-surface text-white font-bold text-xs">Sign In</Link>
                    <Link to="/register" className="flex-1 text-center py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-sm">Sign Up</Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
