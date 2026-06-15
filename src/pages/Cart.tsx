import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { LucideIcon } from '../components/LucideIcon';
import { PRODUCTS } from '../data';

export function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, promoCode, promoDiscount, applyPromo, removePromo, getTotals } = useCartStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);

  const { subtotal, discount, total } = getTotals();
  const inr = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null); setPromoSuccess(null);
    if (!promoInput.trim()) return;
    const valid = applyPromo(promoInput.trim());
    if (valid) {
      const code = promoInput.toUpperCase();
      const discPercent = code.endsWith('20') ? 20 : 10;
      setPromoSuccess(`Promo applied! Saved ${discPercent}% on your order.`);
      setPromoInput('');
    } else {
      setPromoError('Invalid promo code. Try AINEST10 or LAUNCH20!');
    }
  };

  const handleAddCrossSell = (productSlug: string) => {
    const prod = PRODUCTS.find((p) => p.slug === productSlug);
    if (prod) useCartStore.getState().addItem(prod);
  };

  const crossSellItems = PRODUCTS.filter((product) => !items.some((item) => item.id === product.id)).slice(0, 3);

  return (
    <div className="w-full min-h-screen pt-10 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-8">Your Cart</h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Items */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="p-4 sm:p-5 rounded-2xl bg-surface border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-500/15 text-brand-400 flex items-center justify-center border border-line flex-shrink-0">
                      <LucideIcon name={item.logo || 'Sparkles'} size={20} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      {item.isBundle && (
                        <span className="inline-block px-1.5 py-0.5 rounded bg-brand-500/15 text-brand-300 text-[8px] font-black uppercase tracking-wider w-max mb-1">Bundle Package</span>
                      )}
                      <h4 className="text-sm sm:text-base font-extrabold text-white truncate leading-snug">{item.name}</h4>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">{item.isBundle ? 'Multiple seats allocated' : 'Premium subscription'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-line pt-3 sm:pt-0 sm:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-slate-500 mr-1">Qty:</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-lg bg-surface-3 hover:bg-surface-2 text-slate-300 font-extrabold flex items-center justify-center transition-colors cursor-pointer select-none">-</button>
                      <span className="w-8 text-center text-sm font-black font-mono text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-lg bg-surface-3 hover:bg-surface-2 text-slate-300 font-extrabold flex items-center justify-center transition-colors cursor-pointer select-none">+</button>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <div className="text-sm sm:text-base font-black text-white">{inr(item.price * item.quantity)}</div>
                      {item.originalPrice > item.price && <div className="text-[10px] text-slate-500 line-through font-bold mt-0.5">{inr(item.originalPrice * item.quantity)}</div>}
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer" title="Remove">
                      <LucideIcon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Cross-sell */}
              {crossSellItems.length > 0 && (
                <div className="p-6 rounded-3xl bg-surface-2 border border-line mt-8">
                  <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <LucideIcon name="Heart" size={13} className="text-rose-400 fill-rose-500/20" /> Recommended for You
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {crossSellItems.map((prod) => (
                      <div key={prod.id} className="p-4 rounded-2xl bg-surface border border-line flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-1 rounded-lg bg-brand-500/15 text-brand-400"><LucideIcon name={prod.logo} size={14} /></div>
                            <span className="text-xs font-extrabold text-white leading-none truncate">{prod.name}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-semibold line-clamp-2 leading-snug">{prod.shortDescription}</p>
                        </div>
                        <div className="flex items-center justify-between border-t border-line pt-3 mt-4">
                          <span className="text-xs font-black text-white">{inr(prod.monthlyPrice)}</span>
                          <button onClick={() => handleAddCrossSell(prod.slug)} className="px-2.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white font-black text-[9px] uppercase tracking-wide rounded-lg cursor-pointer transition-all">+ Add</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-line relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-6 border-b border-line pb-3">Order Summary</h3>
                <div className="space-y-3.5 mb-6 text-sm font-semibold text-slate-400">
                  <div className="flex justify-between"><span>Subtotal</span><span className="text-white font-bold">{inr(subtotal)}</span></div>
                  {promoCode && (
                    <div className="flex justify-between text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20">
                      <span className="flex items-center gap-1"><LucideIcon name="Ticket" size={13} /> Promo ({promoCode})</span>
                      <span className="font-bold">-{inr(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-line pt-3 text-base text-white font-black">
                    <span>Total Due</span><span className="text-brand-400">{inr(total)}</span>
                  </div>
                </div>
                <button onClick={() => navigate('/checkout')} className="w-full py-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 hover:scale-[1.01] shadow-lg shadow-brand-500/25 text-white font-extrabold text-sm rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2">
                  <LucideIcon name="ShieldCheck" size={16} strokeWidth={2.5} /> Proceed to Checkout
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-surface border border-line space-y-4">
                <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <LucideIcon name="Tag" size={13} className="text-brand-400" /> Have a Promo Code?
                </h4>
                {promoCode ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold leading-tight">
                    <div className="flex items-center gap-2"><LucideIcon name="Check" size={14} className="text-emerald-400" /><span>Code <strong>{promoCode}</strong> active ({promoDiscount}% off)</span></div>
                    <button onClick={removePromo} className="text-emerald-400 hover:text-rose-400 font-bold ml-2 underline cursor-pointer">Remove</button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input type="text" placeholder="e.g. LAUNCH20" value={promoInput} onChange={(e) => setPromoInput(e.target.value)}
                      className="bg-surface-2 text-xs px-3 py-2 rounded-xl border border-line focus:outline-none focus:border-brand-500 flex-1 font-bold tracking-wider uppercase text-white placeholder-slate-500" />
                    <button type="submit" className="bg-surface-3 hover:bg-surface-2 border border-line text-white font-bold rounded-xl px-4 text-xs transition-colors cursor-pointer">Apply</button>
                  </form>
                )}
                {promoError && <p className="text-[10px] text-rose-400 font-bold">{promoError}</p>}
                {promoSuccess && <p className="text-[10px] text-emerald-400 font-bold">{promoSuccess}</p>}
                <div className="text-[10px] text-slate-500 font-semibold leading-normal">💡 Try <strong className="text-slate-300">LAUNCH20</strong> or <strong className="text-slate-300">AINEST10</strong>.</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-16 rounded-3xl bg-surface border border-line text-center flex flex-col items-center justify-center gap-5">
            <div className="w-16 h-16 rounded-full bg-brand-500/15 text-brand-400 flex items-center justify-center animate-bounce"><LucideIcon name="ShoppingCart" size={28} /></div>
            <div>
              <h3 className="font-extrabold text-lg text-white tracking-tight">Your Cart is Empty</h3>
              <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto mt-2 leading-relaxed">You haven't added any premium AI subscriptions yet. Unlock ChatGPT, Claude, and more instantly.</p>
            </div>
            <Link to="/products" className="px-8 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-brand-500/25 cursor-pointer active:scale-95 transition-all">Browse Subscriptions</Link>
          </div>
        )}
      </div>
    </div>
  );
}
