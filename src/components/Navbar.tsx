import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { LucideIcon } from './LucideIcon';
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
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/products?search=${encodeURIComponent(search.trim())}`); setSearch(''); }
  };

  const isActive = (path: string) => location.pathname === path;
  const linkCls = (active: boolean) =>
    `px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${active ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'}`;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm' : 'bg-white border-b border-slate-100'}`}>
        <nav className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center shadow-md shadow-brand-500/30">
              <span className="text-white font-black text-sm tracking-tighter italic">AI</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-base text-slate-900 tracking-tight">AI Nest</span>
              <span className="text-[8px] font-bold text-brand-500 uppercase tracking-[0.2em]">Premium Store</span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-0.5">
            <Link to="/" className={linkCls(isActive('/'))}>Home</Link>
            <Link to="/products" className={linkCls(isActive('/products'))}>All Products</Link>

            <div ref={catRef} className="relative">
              <button
                onClick={() => setCatOpen((v) => !v)}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1 ${catOpen ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'}`}
              >
                Categories
                <LucideIcon name="ChevronDown" size={13} className={`transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-60 rounded-2xl bg-white border border-slate-100 shadow-2xl shadow-slate-300/40 py-2 overflow-hidden z-50"
                  >
                    <p className="px-4 py-1.5 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Browse by Category</p>
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/products?category=${cat.id}`}
                        onClick={() => setCatOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <LucideIcon name={cat.icon} size={13} className="text-slate-500" />
                        </div>
                        {cat.name}
                      </Link>
                    ))}
                    <div className="mx-3 mt-2 pt-2 border-t border-slate-100">
                      <Link to="/products" onClick={() => setCatOpen(false)} className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-brand-50 text-brand-600 font-bold text-sm hover:bg-brand-100 transition-colors">
                        View All <LucideIcon name="ArrowRight" size={12} />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/products?tag=bundles" className={`${linkCls(false)} inline-flex items-center gap-1`}>
              <LucideIcon name="Crown" size={13} className="text-gold" />
              Bundles
            </Link>
            <Link to="/products" className={linkCls(false)}>Pricing</Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
              <input
                type="text"
                placeholder="Search tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-slate-100 text-sm px-3 py-2 pl-8 rounded-xl border border-transparent focus:border-brand-300 focus:bg-white focus:outline-none w-36 focus:w-52 transition-all placeholder-slate-400 font-medium"
              />
              <LucideIcon name="Search" size={13} className="text-slate-400 absolute left-2.5" />
            </form>

            {/* Cart */}
            <Link to="/cart" className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors">
              <LucideIcon name="ShoppingCart" size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-brand-600 text-white text-[9px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                {user?.role === 'admin' ? (
                  <Link to="/admin" className="px-3.5 py-2 rounded-xl text-sm font-bold text-brand-600 hover:bg-brand-50 transition-all">Admin</Link>
                ) : (
                  <span className="text-sm text-slate-500 font-medium hidden md:block">Hi, <strong className="text-slate-800">{user?.name?.split(' ')[0]}</strong></span>
                )}
                <button onClick={logout} className="px-3.5 py-2 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all cursor-pointer">Logout</button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <Link to="/login" className="px-3.5 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all">Sign in</Link>
                <Link to="/register" className="px-4 py-2 rounded-xl text-sm font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-500/25 transition-all">Sign up</Link>
              </div>
            )}

            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors">
              <LucideIcon name="Menu" size={20} />
            </button>
          </div>
        </nav>
      </header>

      {/* spacer so content sits below fixed nav */}
      <div className="h-16" />

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-[82%] max-w-[320px] bg-white z-50 shadow-2xl flex flex-col lg:hidden"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center">
                    <span className="text-white font-black text-xs italic">AI</span>
                  </div>
                  <span className="font-extrabold text-sm text-slate-900">AI Nest</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-xl bg-slate-100 text-slate-500">
                  <LucideIcon name="X" size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text" placeholder="Search tools..." value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-slate-100 text-sm px-3 py-2.5 pl-9 rounded-xl border border-slate-100 focus:outline-none focus:border-brand-400 font-medium"
                  />
                  <LucideIcon name="Search" size={14} className="text-slate-400 absolute left-3 top-3" />
                </form>

                <div className="space-y-1">
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Menu</p>
                  {[
                    { to: '/', label: 'Home', icon: 'Home' },
                    { to: '/products', label: 'All Products', icon: 'ShoppingBag' },
                    { to: '/products?tag=bundles', label: 'Bundles', icon: 'Crown' },
                    { to: '/products', label: 'Pricing', icon: 'Tag' },
                    { to: '/cart', label: 'Cart', icon: 'ShoppingCart' },
                  ].map((item) => (
                    <Link key={item.label} to={item.to} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                      <LucideIcon name={item.icon} size={16} className="text-slate-400" />
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div>
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Categories</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <Link key={cat.id} to={`/products?category=${cat.id}`} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 text-xs font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                        <LucideIcon name={cat.icon} size={12} className="text-slate-400" />
                        {cat.name.replace('AI ', '')}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-1">
                      <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-600 font-extrabold text-sm flex items-center justify-center">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-800">{user?.name}</p>
                        <p className="text-[10px] text-slate-400">{user?.email}</p>
                      </div>
                    </div>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="block w-full text-center py-2.5 rounded-xl bg-brand-50 text-brand-600 font-bold text-xs">Admin Panel</Link>
                    )}
                    <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors">Sign Out</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" className="flex-1 text-center py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs">Sign in</Link>
                    <Link to="/register" className="flex-1 text-center py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-sm">Sign up</Link>
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
