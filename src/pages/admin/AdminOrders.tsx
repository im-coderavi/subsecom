import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { LucideIcon } from '../../components/LucideIcon';

interface AdminOrder {
  _id: string;
  userEmail: string;
  userName: string;
  total: number;
  subtotal: number;
  discount: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  promoCode?: string;
  utrNumber?: string;
  paymentProof?: string;
  createdAt: string;
  items: { name: string; price: number; quantity: number; isBundle: boolean }[];
  credentials: { service: string; email: string; password: string }[];
}

const statusColor: Record<string, string> = {
  completed: 'bg-emerald-900/40 text-emerald-400',
  pending:   'bg-amber-900/40 text-amber-400',
  failed:    'bg-red-900/40 text-red-400',
};

const paymentIcon: Record<string, string> = {
  card: 'CreditCard',
  crypto: 'Bitcoin',
  upi: 'QrCode',
};

export function AdminOrders() {
  const token = useAuthStore((s) => s.token);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const headers = { Authorization: `Bearer ${token}` };

  const load = (p = 1) => {
    setLoading(true);
    fetch(`/api/admin/orders?page=${p}&limit=15`, { headers })
      .then((r) => r.json())
      .then((d) => { setOrders(d.orders ?? []); setTotalPages(d.totalPages ?? 1); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(page); }, [page]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load(page);
    if (selected?._id === id) setSelected((o) => o ? { ...o, status: status as any } : null);
  };

  const [approving, setApproving] = useState<string | null>(null);
  const handleApprove = async (id: string) => {
    if (!confirm('Approve this UPI payment and send confirmation email to customer?')) return;
    setApproving(id);
    const res = await fetch(`/api/admin/orders/${id}/approve`, { method: 'POST', headers });
    const data = await res.json();
    setApproving(null);
    if (res.ok) {
      load(page);
      if (selected?._id === id) setSelected((o) => o ? { ...o, status: 'completed' } : null);
      alert('Order approved and confirmation email sent!');
    } else {
      alert(data.error || 'Approval failed');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-black text-white mb-1">Orders</h1>
      <p className="text-neutral-500 text-sm font-semibold mb-8">Track and manage all customer orders</p>

      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-neutral-800">
                {['Customer', 'Items', 'Total', 'Payment', 'Promo', 'Status', 'Date', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {loading ? (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-neutral-600">Loading...</td></tr>
              ) : orders.map((o) => (
                <tr key={o._id} className="hover:bg-neutral-800/30">
                  <td className="px-4 py-3">
                    <p className="font-bold text-white">{o.userName}</p>
                    <p className="text-neutral-500 truncate max-w-[140px]">{o.userEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-neutral-400 max-w-[160px]">
                    <p className="truncate">{o.items.map((i) => i.name).join(', ')}</p>
                  </td>
                  <td className="px-4 py-3 font-black text-emerald-400">${o.total.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-neutral-400 capitalize">
                      <LucideIcon name={paymentIcon[o.paymentMethod] || 'CreditCard'} size={11} />
                      {o.paymentMethod}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{o.promoCode || '—'}</td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border-0 cursor-pointer ${statusColor[o.status]}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {o.paymentMethod === 'upi' && o.status === 'pending' && (
                        <button
                          onClick={() => handleApprove(o._id)}
                          disabled={approving === o._id}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white text-[10px] font-black transition-all disabled:opacity-50"
                        >
                          {approving === o._id
                            ? <LucideIcon name="Loader" size={10} className="animate-spin" />
                            : <LucideIcon name="CheckCircle" size={10} />
                          }
                          Approve
                        </button>
                      )}
                      <button onClick={() => setSelected(o)} className="p-1.5 rounded-lg bg-neutral-800 hover:bg-violet-600 text-neutral-400 hover:text-white transition-all">
                        <LucideIcon name="Eye" size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !orders.length && (
            <p className="text-center text-neutral-600 py-10 text-sm font-semibold">No orders yet</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 py-4 border-t border-neutral-800">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 text-xs font-bold text-neutral-400 bg-neutral-800 hover:bg-neutral-700 rounded-lg disabled:opacity-40 transition-all">Prev</button>
            <span className="text-xs text-neutral-500 font-bold">{page} / {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1.5 text-xs font-bold text-neutral-400 bg-neutral-800 hover:bg-neutral-700 rounded-lg disabled:opacity-40 transition-all">Next</button>
          </div>
        )}
      </div>

      {/* Order detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
              <h2 className="font-black text-white text-sm">Order Detail</h2>
              <button onClick={() => setSelected(null)} className="text-neutral-500 hover:text-white transition-colors">
                <LucideIcon name="X" size={16} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  ['Customer', selected.userName], ['Email', selected.userEmail],
                  ['Payment', selected.paymentMethod], ['Status', selected.status],
                  ['Subtotal', `$${selected.subtotal?.toFixed(2)}`], ['Discount', `$${selected.discount?.toFixed(2)}`],
                  ['Total', `$${selected.total.toFixed(2)}`], ['Date', new Date(selected.createdAt).toLocaleString()],
                  ...(selected.promoCode ? [['Promo Code', selected.promoCode]] : []),
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[10px] text-neutral-500 uppercase font-extrabold tracking-wider mb-0.5">{k}</p>
                    <p className="text-white font-bold">{v}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-[10px] text-neutral-500 uppercase font-extrabold tracking-wider mb-2">Items</p>
                {selected.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs py-1.5 border-b border-neutral-800 last:border-0">
                    <span className="text-neutral-300 font-bold">{item.name}</span>
                    <span className="text-emerald-400 font-black">${item.price.toFixed(2)} ×{item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* UPI Proof Section */}
              {selected.paymentMethod === 'upi' && (
                <div className="space-y-3">
                  <p className="text-[10px] text-neutral-500 uppercase font-extrabold tracking-wider">UPI Payment Details</p>

                  {selected.utrNumber && (
                    <div className="bg-neutral-800 rounded-xl p-3 flex items-center justify-between">
                      <span className="text-[10px] text-neutral-400 font-extrabold uppercase">UTR / Reference</span>
                      <span className="text-white font-mono font-bold text-xs select-all">{selected.utrNumber}</span>
                    </div>
                  )}

                  {selected.paymentProof && (
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase font-extrabold tracking-wider mb-2">Payment Screenshot</p>
                      <a href={selected.paymentProof} target="_blank" rel="noopener noreferrer">
                        <img
                          src={selected.paymentProof}
                          alt="Payment proof"
                          className="w-full max-h-56 object-contain rounded-xl border border-neutral-700 bg-neutral-800 cursor-zoom-in hover:opacity-90 transition-opacity"
                        />
                        <p className="text-[10px] text-violet-400 font-bold mt-1 text-center">Click to open full size</p>
                      </a>
                    </div>
                  )}

                  {selected.status === 'pending' && (
                    <button
                      onClick={() => handleApprove(selected._id)}
                      disabled={approving === selected._id}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-xs transition-all flex items-center justify-center gap-2"
                    >
                      {approving === selected._id
                        ? <><LucideIcon name="Loader" size={13} className="animate-spin" /> Approving...</>
                        : <><LucideIcon name="CheckCircle" size={13} /> Approve Payment &amp; Send Confirmation Email</>
                      }
                    </button>
                  )}
                </div>
              )}

              {selected.credentials?.length > 0 && (
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-extrabold tracking-wider mb-2">Credentials Delivered</p>
                  {selected.credentials.map((c, i) => (
                    <div key={i} className="bg-neutral-800 rounded-xl p-3 text-xs mb-2">
                      <p className="text-violet-400 font-extrabold mb-1">{c.service}</p>
                      <p className="text-neutral-400">Email: <span className="text-white font-mono select-all">{c.email}</span></p>
                      <p className="text-neutral-400">Pass: <span className="text-white font-mono select-all">{c.password}</span></p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
