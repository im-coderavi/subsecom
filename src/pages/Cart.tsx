import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { LucideIcon } from '../components/LucideIcon';
import { PRODUCTS } from '../data';

export function Cart() {
  const navigate = useNavigate();
  const {
    items,
    removeItem,
    updateQuantity,
    promoCode,
    promoDiscount,
    applyPromo,
    removePromo,
    getTotals,
  } = useCartStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);

  const { subtotal, discount, total } = getTotals();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    setPromoSuccess(null);

    if (!promoInput.trim()) return;

    const valid = applyPromo(promoInput.trim());
    if (valid) {
      const code = promoInput.toUpperCase();
      const discPercent = code.endsWith('20') ? 20 : 10;
      setPromoSuccess(`Promo code applied successfully! Saved ${discPercent}% on aggregate value.`);
      setPromoInput('');
    } else {
      setPromoError('Invalid promo code. Try AINEST10 or LAUNCH20!');
    }
  };

  const handleAddCrossSell = (productSlug: string) => {
    const prod = PRODUCTS.find((p) => p.slug === productSlug);
    if (prod) {
      useCartStore.getState().addItem(prod);
    }
  };

  // Cross sell items that aren't already in the cart
  const crossSellItems = PRODUCTS.filter(
    (product) => !items.some((item) => item.id === product.id)
  ).slice(0, 3);

  return (
    <div className="w-full min-h-screen bg-[#F8F9FD] pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mb-8">
          Your Premium AI Cart
        </h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* List of Cart Items Left Panel (8 Columns) */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Name and general logo details */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-neutral-100/50 flex-shrink-0 font-bold">
                      <LucideIcon name={item.logo || 'Sparkles'} size={20} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      {item.isBundle && (
                        <span className="inline-block px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 text-[8px] font-black uppercase tracking-wider w-max mb-1">
                          SaaS Bundle Package
                        </span>
                      )}
                      <h4 className="text-sm sm:text-base font-extrabold text-neutral-950 truncate leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-neutral-400 font-bold mt-0.5">
                        {item.isBundle ? 'Multiple Seats allocated' : 'Continuous Direct Seat License'}
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Price controllers */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-neutral-50/80 pt-3 sm:pt-0 sm:border-0">
                    
                    {/* Quantity selectors */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 mr-2">Seats:</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-extrabold flex items-center justify-center transition-colors cursor-pointer select-none"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs sm:text-sm font-black font-mono text-neutral-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-extrabold flex items-center justify-center transition-colors cursor-pointer select-none"
                      >
                        +
                      </button>
                    </div>

                    {/* Costing */}
                    <div className="text-right min-w-[75px]">
                      <div className="text-sm sm:text-base font-black text-rose-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      {item.originalPrice > item.price && (
                        <div className="text-[10px] text-neutral-400 line-through font-bold mt-0.5">
                          ${(item.originalPrice * item.quantity).toFixed(2)}
                        </div>
                      )}
                    </div>

                    {/* Delete column */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove from Cart"
                    >
                      <LucideIcon name="Trash2" size={16} />
                    </button>

                  </div>
                </div>
              ))}

              {/* Cross selling prompts */}
              <div className="p-6 rounded-3xl bg-neutral-100/50 border border-neutral-200/40 mt-8">
                <h3 className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <LucideIcon name="Heart" size={13} className="text-rose-500 fill-rose-50" />
                  Recommended Additions for Your Workflow
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {crossSellItems.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-4 rounded-2xl bg-white border border-neutral-100 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1 rounded-lg bg-violet-50 text-violet-500">
                            <LucideIcon name={prod.logo} size={14} />
                          </div>
                          <span className="text-xs font-extrabold text-neutral-800 leading-none truncate">
                            {prod.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400 font-semibold line-clamp-2 leading-snug">
                          {prod.shortDescription}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-neutral-50/80 pt-3 mt-4">
                        <span className="text-xs font-black text-rose-500">${prod.monthlyPrice}</span>
                        <button
                          onClick={() => handleAddCrossSell(prod.slug)}
                          className="px-2.5 py-1.5 bg-violet-600 hover:bg-violet-700 hover:shadow-sm text-white font-black text-[9px] uppercase tracking-wide rounded-lg cursor-pointer transition-all"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Receipt Summary panel (4 Columns) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Checkout cost calculation card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-100 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />
                
                <h3 className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest mb-6 border-b border-neutral-50/80 pb-3">
                  Summary Cost Breakdown
                </h3>

                <div className="space-y-3.5 mb-6 text-xs sm:text-sm font-semibold text-neutral-500">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-neutral-900 font-bold">${subtotal.toFixed(2)}</span>
                  </div>

                  {promoCode && (
                    <div className="flex justify-between text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100/50">
                      <span className="flex items-center gap-1">
                        <LucideIcon name="Ticket" size={13} />
                        Promo ({promoCode})
                      </span>
                      <span className="font-bold">-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between border-t border-neutral-100 pt-3 text-sm sm:text-base text-neutral-700 font-black">
                    <span className="text-neutral-900">Total Due</span>
                    <span className="text-rose-600 font-black">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:scale-[1.01] hover:shadow-lg shadow-violet-500/15 text-white font-extrabold text-sm sm:text-base rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <LucideIcon name="ShieldCheck" size={16} strokeWidth={2.5} />
                  Proceed Securely Checkout
                </button>
              </div>

              {/* Promo Coupon Card */}
              <div className="p-6 rounded-3xl bg-white border border-neutral-100 shadow-sm space-y-4">
                <h4 className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider flex items-center gap-2">
                  <LucideIcon name="Tag" size={13} className="text-violet-500" />
                  Have a Promo Coupon?
                </h4>

                {promoCode ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-100/50 text-emerald-800 text-xs font-bold leading-tight">
                    <div className="flex items-center gap-2">
                      <LucideIcon name="Check" size={14} className="text-emerald-500" />
                      <span>Code <strong>{promoCode}</strong> Active ({promoDiscount}% Off)</span>
                    </div>
                    <button
                      onClick={removePromo}
                      className="text-emerald-600 hover:text-red-500 font-bold ml-2 underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. LAUNCH20"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="bg-neutral-50 text-xs px-3 py-2 rounded-xl border border-neutral-100 focus:bg-white focus:outline-none focus:border-violet-400 flex-1 font-bold tracking-wider uppercase text-neutral-800"
                    />
                    <button
                      type="submit"
                      className="bg-neutral-800 hover:bg-neutral-900 text-white font-bold rounded-xl px-4 text-xs transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {/* Validation feedbacks */}
                {promoError && (
                  <p className="text-[10px] text-red-500 font-bold">{promoError}</p>
                )}
                {promoSuccess && (
                  <p className="text-[10px] text-emerald-600 font-bold">{promoSuccess}</p>
                )}

                <div className="text-[10px] text-neutral-400 font-semibold leading-normal">
                  💡 Hint: Enter <strong>LAUNCH20</strong> or <strong>AINEST10</strong> to test dynamic coupon application!
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="p-16 rounded-3xl bg-white border border-neutral-100 text-center flex flex-col items-center justify-center gap-5">
            <div className="w-16 h-16 rounded-full bg-violet-50 text-violet-500 flex items-center justify-center animate-bounce">
              <LucideIcon name="ShoppingCart" size={28} />
            </div>
            
            <div>
              <h3 className="font-extrabold text-lg text-neutral-800 tracking-tight">Your Cart is Currently Empty</h3>
              <p className="text-xs text-neutral-400 font-semibold max-w-sm mx-auto mt-2 leading-relaxed">
                You haven't selected any premium AI subscription plans yet. Unlock access to ChatGPT, Claude, and more instantly.
              </p>
            </div>

            <Link
              to="/products"
              className="px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-violet-500/10 cursor-pointer active:scale-95 transition-all"
            >
              Browse AI Subscriptions
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
