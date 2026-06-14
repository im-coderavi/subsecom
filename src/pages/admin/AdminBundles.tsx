import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { LucideIcon } from '../../components/LucideIcon';

interface AdminBundle {
  _id: string;
  name: string;
  price: number;
  originalPrice: number;
  savingPercent: number;
  products: string[];
  toolsCount: number;
  colorTheme: 'creator' | 'pro' | 'ultimate';
  features: string[];
  isActive: boolean;
}

interface AdminProduct { _id: string; name: string; isActive: boolean; }

type ColorTheme = 'creator' | 'pro' | 'ultimate';

interface FormState {
  name: string;
  price: string;
  originalPrice: string;
  savingPercent: string;
  colorTheme: ColorTheme;
  products: string[];
  features: string;
}

const THEMES: ColorTheme[] = ['creator', 'pro', 'ultimate'];
const THEME_COLORS: Record<ColorTheme, string> = {
  creator:  'bg-violet-500/20 text-violet-300 border-violet-500/30',
  pro:      'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  ultimate: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
};

const emptyForm: FormState = {
  name: '', price: '', originalPrice: '', savingPercent: '',
  colorTheme: 'creator',
  products: [],
  features: '',
};

export function AdminBundles() {
  const token = useAuthStore((s) => s.token);
  const [bundles, setBundles] = useState<AdminBundle[]>([]);
  const [allProducts, setAllProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBundle, setEditBundle] = useState<AdminBundle | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const authHeader = { Authorization: `Bearer ${token}` };
  const jsonHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/admin/bundles', { headers: authHeader }).then(r => r.json()),
      fetch('/api/admin/products', { headers: authHeader }).then(r => r.json()),
    ]).then(([bd, pd]) => {
      setBundles((bd.bundles ?? []).map((b: any) => ({ ...b, _id: b._id ?? b.id })));
      setAllProducts((pd.products ?? []).filter((p: AdminProduct) => p.isActive));
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditBundle(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (b: AdminBundle) => {
    setEditBundle(b);
    setForm({
      name: b.name,
      price: String(b.price),
      originalPrice: String(b.originalPrice),
      savingPercent: String(b.savingPercent),
      colorTheme: b.colorTheme,
      products: b.products,
      features: b.features.join('\n'),
    });
    setError('');
    setShowModal(true);
  };

  const toggleProduct = (name: string) => {
    setForm(f => ({
      ...f,
      products: f.products.includes(name)
        ? f.products.filter(p => p !== name)
        : [...f.products, name],
    }));
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.originalPrice || form.products.length === 0) {
      setError('Name, price, original price, and at least one product are required.');
      return;
    }
    setSaving(true);
    setError('');
    const payload = {
      name: form.name,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice),
      savingPercent: Number(form.savingPercent) || 0,
      colorTheme: form.colorTheme,
      products: form.products,
      toolsCount: form.products.length,
      features: form.features.split('\n').map(f => f.trim()).filter(Boolean),
    };
    try {
      const url = editBundle ? `/api/admin/bundles/${editBundle._id}` : '/api/admin/bundles';
      const method = editBundle ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: jsonHeaders, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setShowModal(false);
      if (editBundle) {
        setBundles(prev => prev.map(b => b._id === editBundle._id ? { ...b, ...payload } : b));
      } else {
        setBundles(prev => [data.bundle, ...prev]);
      }
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm('Deactivate this bundle?')) return;
    await fetch(`/api/admin/bundles/${id}`, { method: 'DELETE', headers: authHeader });
    setBundles(prev => prev.map(b => b._id === id ? { ...b, isActive: false } : b));
  };

  const handleRestore = async (id: string) => {
    await fetch(`/api/admin/bundles/${id}/restore`, { method: 'PATCH', headers: authHeader });
    setBundles(prev => prev.map(b => b._id === id ? { ...b, isActive: true } : b));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">Bundles</h1>
          <p className="text-neutral-500 text-sm font-semibold">Manage multi-tool bundle packs</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl transition-all"
        >
          <LucideIcon name="Plus" size={14} />
          Add Bundle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-neutral-900 border border-neutral-800 h-56 animate-pulse" />
          ))
        ) : bundles.map((b) => (
          <div key={b._id} className={`rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col transition-all ${!b.isActive ? 'opacity-50' : ''}`}>
            <div className={`h-1 w-full bg-gradient-to-r ${b.colorTheme === 'creator' ? 'from-violet-500 to-indigo-600' : b.colorTheme === 'pro' ? 'from-emerald-500 to-teal-500' : 'from-amber-400 via-rose-500 to-violet-600'}`} />
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">{b.toolsCount} tools</p>
                  <h3 className="font-black text-base text-white mt-0.5">{b.name}</h3>
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${THEME_COLORS[b.colorTheme]}`}>
                  SAVE {b.savingPercent}%
                </span>
              </div>
              <p className="text-xs text-neutral-500 mb-3 leading-relaxed">
                {b.products.join(' · ')}
              </p>
              <div className="flex items-baseline gap-1.5 mb-4">
                <span className="text-xl font-black text-white">₹{b.price.toLocaleString('en-IN')}</span>
                <span className="text-xs text-neutral-600 line-through">₹{b.originalPrice.toLocaleString('en-IN')}</span>
                <span className="text-xs text-neutral-500">/mo</span>
              </div>
              <div className="flex items-center gap-2 mt-auto">
                <button onClick={() => openEdit(b)} className="flex-1 py-2 rounded-xl bg-neutral-800 hover:bg-violet-600 text-neutral-400 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                  <LucideIcon name="Pencil" size={12} /> Edit
                </button>
                {b.isActive ? (
                  <button onClick={() => handleDeactivate(b._id)} className="flex-1 py-2 rounded-xl bg-neutral-800 hover:bg-red-600/30 text-neutral-400 hover:text-red-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                    <LucideIcon name="EyeOff" size={12} /> Deactivate
                  </button>
                ) : (
                  <button onClick={() => handleRestore(b._id)} className="flex-1 py-2 rounded-xl bg-neutral-800 hover:bg-emerald-600/30 text-neutral-400 hover:text-emerald-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                    <LucideIcon name="RotateCcw" size={12} /> Restore
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
              <h2 className="font-black text-white text-sm">{editBundle ? 'Edit Bundle' : 'New Bundle'}</h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-500 hover:text-white">
                <LucideIcon name="X" size={16} />
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* Name + Theme */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider mb-1">Bundle Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Creator Bundle"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider mb-1">Price (₹)</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="2399"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider mb-1">Original Price (₹)</label>
                  <input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} placeholder="3399"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider mb-1">Saving %</label>
                  <input type="number" value={form.savingPercent} onChange={e => setForm(f => ({ ...f, savingPercent: e.target.value }))} placeholder="30"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider mb-1">Color Theme</label>
                  <select value={form.colorTheme} onChange={e => setForm(f => ({ ...f, colorTheme: e.target.value as ColorTheme }))}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-violet-500">
                    {THEMES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              {/* Product picker */}
              <div>
                <label className="block text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider mb-2">
                  Products in Bundle <span className="text-violet-400">({form.products.length} selected)</span>
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {allProducts.map(p => {
                    const selected = form.products.includes(p.name);
                    return (
                      <button
                        key={p._id}
                        type="button"
                        onClick={() => toggleProduct(p.name)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left ${
                          selected
                            ? 'bg-violet-600/20 border-violet-500/50 text-violet-300'
                            : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-600'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${selected ? 'bg-violet-600 border-violet-500' : 'border-neutral-600'}`}>
                          {selected && <LucideIcon name="Check" size={10} className="text-white" />}
                        </div>
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider mb-1">
                  Features <span className="text-neutral-600 font-medium normal-case">(one per line)</span>
                </label>
                <textarea
                  rows={4}
                  value={form.features}
                  onChange={e => setForm(f => ({ ...f, features: e.target.value }))}
                  placeholder={"Perfect for designers and content creators\nHigh-fidelity video & image generation\n..."}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>
            </div>

            {error && (
              <p className="mx-6 mb-4 text-xs font-bold text-red-400 bg-red-900/20 border border-red-800/50 rounded-xl px-3 py-2">{error}</p>
            )}

            <div className="flex justify-end gap-3 px-6 pb-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-all">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold text-xs transition-all flex items-center gap-2">
                {saving && <LucideIcon name="Loader" size={12} className="animate-spin" />}
                {editBundle ? 'Save Changes' : 'Create Bundle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
