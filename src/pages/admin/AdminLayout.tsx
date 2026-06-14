import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LucideIcon } from '../../components/LucideIcon';
import { useEffect } from 'react';

const navItems = [
  { to: '/admin',          label: 'Dashboard',  icon: 'LayoutDashboard', exact: true },
  { to: '/admin/products', label: 'Products',   icon: 'Package' },
  { to: '/admin/bundles',  label: 'Bundles',    icon: 'Layers' },
  { to: '/admin/orders',   label: 'Orders',     icon: 'ShoppingBag' },
  { to: '/admin/settings', label: 'Settings',   icon: 'Settings' },
];

export function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if ((user as any)?.role !== 'admin') { navigate('/'); }
  }, [isAuthenticated, user, navigate]);

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname.startsWith(to);

  return (
    <div className="flex min-h-screen bg-neutral-950 font-sans">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col border-r border-neutral-800 bg-neutral-900">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-neutral-800">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-xs italic">AI</span>
          </div>
          <div>
            <p className="text-white font-extrabold text-sm leading-none">AI Nest</p>
            <p className="text-neutral-500 text-[10px] font-bold mt-0.5">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-3 flex-grow">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive(item.to, item.exact)
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <LucideIcon name={item.icon} size={15} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom user block */}
        <div className="p-3 border-t border-neutral-800">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all mb-1"
          >
            <LucideIcon name="Globe" size={13} />
            View Site
          </Link>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all w-full"
          >
            <LucideIcon name="LogOut" size={13} />
            Logout
          </button>
          <div className="mt-2 px-3 py-2 rounded-xl bg-neutral-800/50 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-white text-[9px] font-black flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-extrabold text-white leading-none truncate">{user?.name}</p>
              <p className="text-[9px] text-neutral-500 font-bold leading-none mt-0.5 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-grow overflow-auto bg-neutral-950">
        <Outlet />
      </main>
    </div>
  );
}
