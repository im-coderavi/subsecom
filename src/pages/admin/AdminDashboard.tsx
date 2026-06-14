import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { LucideIcon } from '../../components/LucideIcon';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';

interface RecentOrder {
  _id: string;
  userEmail: string;
  userName: string;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items: { name: string }[];
}

interface ActivityItem {
  type: string;
  label: string;
  sub: string;
  time: string;
}

interface TopProduct {
  name: string;
  count: number;
  revenue: number;
}

interface Stats {
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  totalRevenue: number;
  revenueChart: { date: string; revenue: number }[];
  userGrowthChart: { date: string; users: number }[];
  statusCounts: { completed: number; pending: number; failed: number };
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
  recentActivity: ActivityItem[];
}

const STATUS_COLORS = {
  completed: '#10b981',
  pending:   '#f59e0b',
  failed:    '#ef4444',
};

const statusBadge: Record<string, string> = {
  completed: 'bg-emerald-900/40 text-emerald-400',
  pending:   'bg-amber-900/40 text-amber-400',
  failed:    'bg-red-900/40 text-red-400',
};

const CHART_TOOLTIP_STYLE = {
  backgroundColor: '#1a1a2e',
  border: '1px solid #2a2a3e',
  borderRadius: 10,
  fontSize: 11,
  fontWeight: 700,
  color: '#e2e8f0',
};

export function AdminDashboard() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, [token]);

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${(stats?.totalRevenue ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      icon: 'IndianRupee',
      gradient: 'from-emerald-500/20 to-emerald-600/5',
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/15',
      border: 'border-emerald-500/20',
    },
    {
      label: 'Total Orders',
      value: (stats?.totalOrders ?? 0).toLocaleString(),
      icon: 'ShoppingBag',
      gradient: 'from-blue-500/20 to-blue-600/5',
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/15',
      border: 'border-blue-500/20',
    },
    {
      label: 'Registered Users',
      value: (stats?.totalUsers ?? 0).toLocaleString(),
      icon: 'Users',
      gradient: 'from-violet-500/20 to-violet-600/5',
      iconColor: 'text-violet-400',
      iconBg: 'bg-violet-500/15',
      border: 'border-violet-500/20',
    },
    {
      label: 'Active Products',
      value: (stats?.totalProducts ?? 0).toLocaleString(),
      icon: 'Package',
      gradient: 'from-amber-500/20 to-amber-600/5',
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/15',
      border: 'border-amber-500/20',
    },
  ];

  const pieData = stats
    ? [
        { name: 'Completed', value: stats.statusCounts.completed, color: STATUS_COLORS.completed },
        { name: 'Pending',   value: stats.statusCounts.pending,   color: STATUS_COLORS.pending },
        { name: 'Failed',    value: stats.statusCounts.failed,    color: STATUS_COLORS.failed },
      ].filter((d) => d.value > 0)
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <LucideIcon name="Loader" size={28} className="text-violet-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] ?? 'Admin'}! 👋
          </h1>
          <p className="text-neutral-500 text-sm font-semibold mt-0.5">
            Here's what's happening with your store today.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 font-bold bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-xl">
          <LucideIcon name="Calendar" size={12} className="text-violet-400" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c) => (
          <div
            key={c.label}
            className={`p-5 rounded-2xl bg-gradient-to-br ${c.gradient} border ${c.border} backdrop-blur-sm relative overflow-hidden`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${c.iconBg}`}>
              <LucideIcon name={c.icon} size={18} className={c.iconColor} />
            </div>
            <p className="text-2xl font-black text-white tracking-tight">{c.value}</p>
            <p className="text-xs text-neutral-400 font-bold mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row 1: Revenue + Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Line Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-extrabold text-white">Revenue Overview</h2>
              <p className="text-xs text-neutral-500 font-semibold mt-0.5">Last 7 days (completed orders)</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-extrabold bg-emerald-900/30 px-3 py-1.5 rounded-xl">
              <LucideIcon name="TrendingUp" size={12} />
              Revenue
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats?.revenueChart ?? []} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="date" tick={{ fill: '#737373', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#737373', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                formatter={(v) => [`₹${Number(v).toFixed(0)}`, 'Revenue']}
                labelStyle={{ color: '#a3a3a3' }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#7c3aed"
                strokeWidth={2.5}
                dot={{ fill: '#7c3aed', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#8b5cf6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Donut */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="mb-5">
            <h2 className="text-sm font-extrabold text-white">Order Status</h2>
            <p className="text-xs text-neutral-500 font-semibold mt-0.5">Last 30 days breakdown</p>
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={7}
                  formatter={(v) => <span style={{ color: '#a3a3a3', fontSize: 10, fontWeight: 700 }}>{v}</span>}
                />
                <Tooltip
                  contentStyle={CHART_TOOLTIP_STYLE}
                  formatter={(v) => [Number(v), 'Orders']}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-neutral-600 text-xs font-bold">
              No order data yet
            </div>
          )}
        </div>
      </div>

      {/* Charts row 2: User Growth + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* User Growth Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-extrabold text-white">User Growth</h2>
              <p className="text-xs text-neutral-500 font-semibold mt-0.5">New registrations — last 14 days</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-violet-400 font-extrabold bg-violet-900/30 px-3 py-1.5 rounded-xl">
              <LucideIcon name="Users" size={12} />
              Signups
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stats?.userGrowthChart ?? []} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="date" tick={{ fill: '#737373', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} interval={1} />
              <YAxis tick={{ fill: '#737373', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                formatter={(v) => [Number(v), 'New Users']}
                labelStyle={{ color: '#a3a3a3' }}
              />
              <Bar dataKey="users" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="mb-5">
            <h2 className="text-sm font-extrabold text-white">Top Products</h2>
            <p className="text-xs text-neutral-500 font-semibold mt-0.5">By revenue (last 30 days)</p>
          </div>
          <div className="space-y-3">
            {(stats?.topProducts ?? []).length === 0 ? (
              <p className="text-neutral-600 text-xs font-bold text-center py-8">No sales yet</p>
            ) : (
              (stats?.topProducts ?? []).map((p, i) => {
                const maxRevenue = Math.max(...(stats?.topProducts ?? []).map((x) => x.revenue), 1);
                const pct = Math.round((p.revenue / maxRevenue) * 100);
                return (
                  <div key={p.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-neutral-600 w-4">#{i + 1}</span>
                        <span className="text-xs font-bold text-white truncate max-w-[120px]">{p.name}</span>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-400">₹{p.revenue.toFixed(0)}</span>
                    </div>
                    <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom row: Recent Orders + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="lg:col-span-2 rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-white">Recent Orders</h2>
            <a href="#/admin/orders" className="text-[10px] font-extrabold text-violet-400 hover:text-violet-300">View all →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-neutral-800">
                  {['Customer', 'Product', 'Total', 'Status'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {(stats?.recentOrders ?? []).map((order) => (
                  <tr key={order._id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-bold text-white">{order.userName}</p>
                      <p className="text-neutral-500 text-[10px]">{order.userEmail}</p>
                    </td>
                    <td className="px-5 py-3 text-neutral-400 max-w-[140px] truncate">
                      {order.items.map((i) => i.name).join(', ')}
                    </td>
                    <td className="px-5 py-3 font-black text-emerald-400">₹{order.total.toFixed(0)}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${statusBadge[order.status] ?? 'bg-neutral-800 text-neutral-400'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {!stats?.recentOrders?.length && (
                  <tr><td colSpan={4} className="text-center text-neutral-600 py-10 text-sm font-semibold">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-800">
            <h2 className="text-sm font-extrabold text-white">Recent Activity</h2>
          </div>
          <div className="divide-y divide-neutral-800/50">
            {(stats?.recentActivity ?? []).length === 0 ? (
              <p className="text-center text-neutral-600 py-10 text-sm font-semibold">No activity yet</p>
            ) : (
              (stats?.recentActivity ?? []).map((a, i) => (
                <div key={i} className="px-5 py-3.5 flex items-start gap-3 hover:bg-neutral-800/30 transition-colors">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    a.type === 'order' ? 'bg-blue-900/40' : 'bg-violet-900/40'
                  }`}>
                    <LucideIcon
                      name={a.type === 'order' ? 'ShoppingBag' : 'UserPlus'}
                      size={13}
                      className={a.type === 'order' ? 'text-blue-400' : 'text-violet-400'}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{a.label}</p>
                    <p className="text-[10px] text-neutral-500 font-semibold truncate">{a.sub}</p>
                    <p className="text-[10px] text-neutral-600 font-semibold mt-0.5">
                      {new Date(a.time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
