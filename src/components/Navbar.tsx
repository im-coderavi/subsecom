import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
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

  const [catOpen, setCatOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const catRef = useRef<HTMLDivElement>(null);

  // Close category dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setCatOpen(false); }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop pill navbar */}
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto w-full max-w-5xl flex items-center justify-between gap-4 px-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-2xl border border-white/60 shadow-xl shadow-black/5">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/30">
              <span className="text-white font-black text-xs tracking-tighter italic">AI</span>
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-extrabold text-sm text-neutral-900 tracking-tight">AI Nest</span>
              <span className="text-[8px] font-bold text-violet-500 uppercase tracking-widest">Powerhouse</span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${isActive('/') ? 'bg-violet-600 text-white' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'}`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${isActive('/products') ? 'bg-violet-600 text-white' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'}`}
            >
              All Products
              <span className="px-1.5 py-0.5 rounded bg-blue-500 text-white text-[8px] font-black uppercase leading-none">NEW</span>
            </Link>

            {/* Categories dropdown — click only */}
            <div ref={catRef} className="relative">
              <button
                onClick={() => setCatOpen((v) => !v)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${catOpen ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'}`}
              >
                Categories
                <LucideIcon name="ChevronDown" size={12} className={`transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-white/90 backdrop-blur-xl border border-neutral-100 shadow-2xl shadow-black/10 py-2 overflow-hidden z-50"
                  >
                    <p className="px-4 py-1.5 text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest">Browse</p>
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/products?category=${cat.id}`}
                        onClick={() => setCatOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                      >
                        <div className="w-6 h-6 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                          <LucideIcon name={cat.icon} size={12} className="text-neutral-500" />
                        </div>
                        {cat.name}
                      </Link>
                    ))}
                    <div className="mx-3 mt-2 pt-2 border-t border-neutral-100">
                      <Link
                        to="/products"
                        onClick={() => setCatOpen(false)}
                        className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-violet-50 text-violet-600 font-bold text-xs hover:bg-violet-100 transition-colors"
                      >
                        View All <LucideIcon name="ArrowRight" size={11} />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/products"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all"
            >
              Pricing
            </Link>
            <Link
              to="/products"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all"
            >
              Affiliate
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
              <input
                type="text"
                placeholder="Search AI tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-neutral-100 text-xs px-3 py-1.5 pl-7 rounded-xl border border-transparent focus:border-violet-300 focus:bg-white focus:outline-none w-36 focus:w-48 transition-all placeholder-neutral-400 font-medium"
              />
              <LucideIcon name="Search" size={12} className="text-neutral-400 absolute left-2.5" />
            </form>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                {user?.role === 'admin' ? (
                  <Link
                    to="/admin"
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-violet-600 hover:bg-violet-50 transition-all"
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <span className="text-xs text-neutral-500 font-medium hidden md:block">
                    Hi, <strong className="text-neutral-800">{user?.name?.split(' ')[0]}</strong>
                  </span>
                )}
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-all"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-violet-600 text-white hover:bg-violet-700 shadow-sm shadow-violet-500/20 transition-all"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-neutral-100 text-neutral-700 transition-colors"
            >
              <LucideIcon name="Menu" size={18} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-[82%] max-w-[320px] bg-white z-50 shadow-2xl flex flex-col lg:hidden"
            >
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center">
                    <span className="text-white font-black text-xs italic">AI</span>
                  </div>
                  <span className="font-extrabold text-sm text-neutral-900">AI Nest</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-xl bg-neutral-100 text-neutral-500">
                  <LucideIcon name="X" size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                {/* Search */}
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search AI tools..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-neutral-100 text-xs px-3 py-2 pl-8 rounded-xl border border-neutral-100 focus:outline-none focus:border-violet-400 font-medium"
                  />
                  <LucideIcon name="Search" size={13} className="text-neutral-400 absolute left-2.5 top-2.5" />
                </form>

                {/* Main links */}
                <div className="space-y-1">
                  <p className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest mb-2">Menu</p>
                  {[
                    { to: '/', label: 'Home', icon: 'Home' },
                    { to: '/products', label: 'All Products', icon: 'ShoppingBag' },
                    { to: '/products', label: 'Pricing', icon: 'Tag' },
                    { to: '/products', label: 'Affiliate', icon: 'Share2' },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-neutral-700 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                    >
                      <LucideIcon name={item.icon} size={15} className="text-neutral-400" />
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* Categories */}
                <div>
                  <p className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest mb-2">Categories</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/products?category=${cat.id}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-50 text-xs font-bold text-neutral-700 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                      >
                        <LucideIcon name={cat.icon} size={12} className="text-neutral-400" />
                        {cat.name.replace('AI ', '')}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Auth */}
              <div className="p-4 border-t border-neutral-100">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-3">
                      <div className="w-9 h-9 rounded-full bg-violet-100 text-violet-600 font-extrabold text-sm flex items-center justify-center">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-neutral-800">{user?.name}</p>
                        <p className="text-[10px] text-neutral-400">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { logout(); setMobileOpen(false); }}
                      className="w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" className="flex-1 text-center py-2.5 rounded-xl bg-neutral-100 text-neutral-800 font-bold text-xs">
                      Log in
                    </Link>
                    <Link to="/register" className="flex-1 text-center py-2.5 rounded-xl bg-violet-600 text-white font-bold text-xs shadow-sm">
                      Sign up
                    </Link>
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
