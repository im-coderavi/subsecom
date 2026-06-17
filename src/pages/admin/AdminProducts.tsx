import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { LucideIcon } from '../../components/LucideIcon';
import { imageToDataUrl } from '../../utils/imageToDataUrl';

interface PricingPlan { months: number; price: number; label?: string; }

interface AdminProduct {
  _id: string;
  name: string;
  slug: string;
  category: string;
  monthlyPrice: number;
  originalPrice: number;
  plans?: PricingPlan[];
  badge?: string;
  image?: string;
  logo: string;
  isActive: boolean;
  rating: number;
  ratingCount: number;
  shortDescription: string;
  description: string;
  deliveryTime: string;
  deliveryMethod: string;
  features: string[];
  frequentlyBoughtTogether?: string[];
}

const CATEGORIES = ['chat', 'code', 'image', 'video', 'voice', 'productivity', 'design', 'writing'];

const emptyForm = {
  name: '', slug: '', category: 'chat', badge: '', image: '', logo: 'Box',
  shortDescription: '', description: '', monthlyPrice: '', originalPrice: '',
  deliveryTime: 'Instant Delivery', deliveryMethod: '', features: '',
  frequentlyBoughtTogether: '',
  rating: '4.5', ratingCount: '0',
};

export function AdminProducts() {
  const token = useAuthStore((s) => s.token);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [plans, setPlans] = useState<{ months: string; price: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const authHeader = { Authorization: `Bearer ${token}` };

  const load = () => {
    setLoading(true);
    fetch('/api/admin/products', { headers: authHeader })
      .then((r) => r.json())
      .then((d) => setProducts(d.products ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setPlans([]);
    setError('');
    setShowModal(true);
  };

  const openEdit = (p: AdminProduct) => {
    setEditProduct(p);
    setPlans((p.plans ?? []).map((pl) => ({ months: String(pl.months), price: String(pl.price) })));
    setForm({
      name: p.name, slug: p.slug, category: p.category, badge: p.badge || '',
      image: p.image || '', logo: p.logo, shortDescription: p.shortDescription,
      description: p.description, monthlyPrice: String(p.monthlyPrice),
      originalPrice: String(p.originalPrice), deliveryTime: p.deliveryTime,
      deliveryMethod: p.deliveryMethod, features: p.features.join('\n'),
      frequentlyBoughtTogether: (p.frequentlyBoughtTogether ?? []).join('\n'),
      rating: String(p.rating), ratingCount: String(p.ratingCount),
    });
    setError('');
    setShowModal(true);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const dataUrl = await imageToDataUrl(file, 700, 0.85);
      setForm((f) => ({ ...f, image: dataUrl }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image processing failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      monthlyPrice: Number(form.monthlyPrice),
      originalPrice: Number(form.originalPrice),
      rating: Number(form.rating),
      ratingCount: Number(form.ratingCount),
      features: form.features.split('\n').map((f) => f.trim()).filter(Boolean),
      frequentlyBoughtTogether: form.frequentlyBoughtTogether.split('\n').map((f) => f.trim().toLowerCase()).filter(Boolean),
      plans: plans
        .filter((pl) => pl.months && pl.price)
        .map((pl) => ({ months: Number(pl.months), price: Number(pl.price) })),
    };

    try {
      const url = editProduct ? `/api/admin/products/${editProduct._id}` : '/api/admin/products';
      const method = editProduct ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setShowModal(false);
      // Optimistic update: immediately reflect changes in the list
      if (editProduct) {
        setProducts((prev) =>
          prev.map((p) => (p._id === editProduct._id ? { ...p, ...payload, features: payload.features } : p))
        );
      } else {
        setProducts((prev) => [data.product, ...prev]);
      }
      // Background sync to get server-generated fields
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this product? This cannot be undone.')) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE', headers: authHeader });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">Products</h1>
          <p className="text-neutral-500 text-sm font-semibold">Manage your AI tool listings</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl transition-all"
        >
          <LucideIcon name="Plus" size={14} />
          Add Product
        </button>
      </div>

      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-neutral-800">
                {['Product', 'Category', 'Price', 'Rating', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-neutral-600">Loading...</td></tr>
              ) : products.map((p) => (
                <tr key={p._id} className="hover:bg-neutral-800/30">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-neutral-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-contain p-0.5" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        ) : (
                          <LucideIcon name={p.logo || 'Box'} size={15} className="text-neutral-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-white">{p.name}</p>
                        <p className="text-neutral-500">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-neutral-400 capitalize">{p.category}</td>
                  <td className="px-5 py-3">
                    <span className="font-black text-emerald-400">₹{p.monthlyPrice.toFixed(0)}</span>
                    <span className="text-neutral-600 line-through ml-1.5">₹{p.originalPrice.toFixed(0)}</span>
                  </td>
                  <td className="px-5 py-3 text-neutral-300">⭐ {p.rating} ({p.ratingCount})</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${p.isActive ? 'bg-emerald-900/40 text-emerald-400' : 'bg-red-900/40 text-red-400'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg bg-neutral-800 hover:bg-violet-600 text-neutral-400 hover:text-white transition-all">
                        <LucideIcon name="Pencil" size={12} />
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-600 text-neutral-400 hover:text-white transition-all">
                        <LucideIcon name="Trash2" size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
              <h2 className="font-black text-white text-sm">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-500 hover:text-white">
                <LucideIcon name="X" size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">

              {/* Image upload section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">Product Image</label>
                  <span className="text-[9px] text-neutral-600 font-semibold">Recommended: 200×200px · PNG/JPG/WebP · Max 2MB</span>
                </div>
                <div className="flex items-start gap-3">
                  {/* Preview */}
                  <div className="w-16 h-16 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {form.image ? (
                      <img src={form.image} alt="preview" className="w-full h-full object-contain p-1" onError={() => setForm((f) => ({ ...f, image: '' }))} />
                    ) : (
                      <LucideIcon name="Image" size={20} className="text-neutral-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    {/* File upload */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                      className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-2 px-3 py-2 bg-violet-700 hover:bg-violet-600 border border-violet-600 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-50"
                    >
                      {uploading
                        ? <><LucideIcon name="Loader" size={12} className="animate-spin" /> Uploading...</>
                        : <><LucideIcon name="Upload" size={12} /> Upload from Device</>
                      }
                    </button>
                    <p className="text-[9px] text-neutral-600 font-medium">— or paste a direct image URL below —</p>
                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                      placeholder="https://example.com/logo.png"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              </div>

              {/* Text fields grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'name',             label: 'Product Name',      placeholder: 'e.g. Claude Pro',          full: true },
                  { key: 'slug',             label: 'URL Slug',          placeholder: 'e.g. claude-pro' },
                  { key: 'badge',            label: 'Badge (optional)',   placeholder: 'Best Seller, Popular…' },
                  { key: 'logo',             label: 'Lucide Icon Name',  placeholder: 'e.g. Sparkles' },
                  { key: 'shortDescription', label: 'Short Description',  placeholder: '50 chars…',               full: true },
                  { key: 'monthlyPrice',     label: 'Monthly Price (₹)',  placeholder: '999',  type: 'number' },
                  { key: 'originalPrice',    label: 'Original Price (₹)', placeholder: '1499',  type: 'number' },
                  { key: 'rating',           label: 'Rating (0-5)',       placeholder: '4.5',    type: 'number' },
                  { key: 'ratingCount',      label: 'Rating Count',       placeholder: '348',    type: 'number' },
                  { key: 'deliveryTime',     label: 'Delivery Time',      placeholder: 'Instant Delivery' },
                  { key: 'deliveryMethod',   label: 'Delivery Method',    placeholder: 'Credentials via dashboard', full: true },
                ].map(({ key, label, placeholder, full, type }) => (
                  <div key={key} className={full ? 'col-span-2' : ''}>
                    <label className="block text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider mb-1">{label}</label>
                    <input
                      type={type || 'text'}
                      value={(form as any)[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                ))}

                {/* Category */}
                <div>
                  <label className="block text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-violet-500"
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider mb-1">
                    Frequently Bought Together
                  </label>
                  {(() => {
                    const selected = form.frequentlyBoughtTogether.split('\n').map((s) => s.trim().toLowerCase()).filter(Boolean);
                    const selectable = products.filter((p) => p.slug && p.slug.toLowerCase() !== form.slug.trim().toLowerCase());
                    const toggle = (slug: string) => {
                      const set = new Set(selected);
                      if (set.has(slug)) set.delete(slug); else set.add(slug);
                      setForm((f) => ({ ...f, frequentlyBoughtTogether: Array.from(set).join('\n') }));
                    };
                    if (selectable.length === 0) {
                      return <p className="text-[11px] text-neutral-500 font-semibold py-2">Add more products first to bundle them here.</p>;
                    }
                    return (
                      <div className="max-h-44 overflow-y-auto rounded-xl border border-neutral-700 bg-neutral-800 divide-y divide-neutral-700/60">
                        {selectable.map((p) => {
                          const checked = selected.includes(p.slug.toLowerCase());
                          return (
                            <button
                              type="button"
                              key={p._id}
                              onClick={() => toggle(p.slug.toLowerCase())}
                              className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors ${checked ? 'bg-violet-600/15' : 'hover:bg-neutral-700/40'}`}
                            >
                              <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border ${checked ? 'border-violet-500 bg-violet-600 text-white' : 'border-neutral-600'}`}>
                                {checked && <LucideIcon name="Check" size={11} strokeWidth={3} />}
                              </span>
                              {p.image
                                ? <img src={p.image} alt="" className="h-7 w-7 flex-shrink-0 rounded object-cover" />
                                : <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded bg-neutral-700 text-neutral-400"><LucideIcon name={p.logo || 'Box'} size={14} /></span>}
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-xs font-bold text-white">{p.name}</span>
                                <span className="block truncate text-[10px] font-medium text-neutral-500">{p.slug}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}
                  <p className="mt-1 text-[9px] text-neutral-600 font-medium">
                    Select products to show in the Frequently Bought Together section. ({form.frequentlyBoughtTogether.split('\n').filter(Boolean).length} selected)
                  </p>
                </div>
              </div>

              {/* Pricing Plans */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">
                    Pricing Plans <span className="text-neutral-600 font-medium normal-case">(optional — overrides monthly price on product page)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setPlans((p) => [...p, { months: '', price: '' }])}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-700/30 hover:bg-violet-700/50 text-violet-300 text-[10px] font-black transition-all"
                  >
                    <LucideIcon name="Plus" size={10} /> Add Plan
                  </button>
                </div>
                {plans.length === 0 ? (
                  <p className="text-[10px] text-neutral-600 font-medium px-1">No plans — product page will show a single plan from the monthly price above.</p>
                ) : (
                  <div className="space-y-2">
                    {plans.map((pl, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="number"
                          value={pl.months}
                          onChange={(e) => setPlans((prev) => prev.map((p, j) => j === i ? { ...p, months: e.target.value } : p))}
                          placeholder="Months"
                          className="w-24 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500"
                        />
                        <span className="text-[10px] text-neutral-600 font-bold flex-shrink-0">mo →</span>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-neutral-500">₹</span>
                          <input
                            type="number"
                            value={pl.price}
                            onChange={(e) => setPlans((prev) => prev.map((p, j) => j === i ? { ...p, price: e.target.value } : p))}
                            placeholder="Total price"
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-6 pr-3 py-2 text-xs font-bold text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setPlans((prev) => prev.filter((_, j) => j !== i))}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-600/30 text-neutral-500 hover:text-red-400 transition-all flex-shrink-0"
                        >
                          <LucideIcon name="X" size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Features */}
              <div>
                <label className="block text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider mb-1">Features (one per line)</label>
                <textarea
                  rows={4}
                  value={form.features}
                  onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))}
                  placeholder={"200K Tokens Context Window\nAdvanced Coding Abilities\n..."}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>

              {/* Full description */}
              <div>
                <label className="block text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider mb-1">Full Description</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
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
              <button onClick={handleSave} disabled={saving || uploading} className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold text-xs transition-all flex items-center gap-2">
                {saving && <LucideIcon name="Loader" size={12} className="animate-spin" />}
                {editProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
