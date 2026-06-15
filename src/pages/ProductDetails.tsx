import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { LucideIcon } from '../components/LucideIcon';
import { FAQS } from '../data';

interface PricingPlan { months: number; price: number; label?: string; }

interface ApiProduct {
  _id: string; name: string; slug: string; logo: string; image?: string; badge?: string;
  category: string; shortDescription: string; description: string;
  monthlyPrice: number; originalPrice: number; plans?: PricingPlan[];
  deliveryTime: string; deliveryMethod: string; features: string[];
  rating: number; ratingCount: number;
}

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const whatsappNumber = useSettingsStore((s) => s.whatsapp_number);

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [selectedPlanIdx, setSelectedPlanIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const key = 'ainest_sale_end';
    let endTime = Number(sessionStorage.getItem(key));
    if (!endTime || endTime < Date.now()) {
      endTime = Date.now() + (11 * 3600 + 47 * 60 + 33) * 1000;
      sessionStorage.setItem(key, String(endTime));
    }
    const tick = () => {
      const diff = Math.max(0, endTime - Date.now());
      setTimeLeft({ h: Math.floor(diff / 3_600_000), m: Math.floor((diff % 3_600_000) / 60_000), s: Math.floor((diff % 60_000) / 1_000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((r) => { if (r.status === 404) { setNotFound(true); return null; } return r.json(); })
      .then((data) => { if (data) setProduct(data.product); })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <LucideIcon name="Loader" size={28} className="text-brand-500 animate-spin" />
          <p className="text-xs font-bold text-slate-400">Loading product...</p>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center pt-12 pb-16 px-4">
        <div className="text-center max-w-sm flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-rose-500/15 text-rose-400"><LucideIcon name="AlertOctagon" size={32} /></div>
          <h1 className="text-2xl font-black text-white tracking-tight">Product Not Found</h1>
          <Link to="/products" className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-brand-500/25">Browse Products</Link>
        </div>
      </div>
    );
  }

  const activePlans: PricingPlan[] = (product.plans && product.plans.length > 0) ? product.plans : [{ months: 1, price: product.monthlyPrice }];
  const selectedPlan = activePlans[Math.min(selectedPlanIdx, activePlans.length - 1)];
  const baseMonthlyRate = activePlans[0].price / activePlans[0].months;
  const total = selectedPlan.price;
  const originalTotal = product.originalPrice * selectedPlan.months;
  const discount = product.originalPrice > 0 ? Math.min(90, Math.round(((product.originalPrice - activePlans[0].price / activePlans[0].months) / product.originalPrice) * 100)) : 0;
  const savings = originalTotal - total;

  const handleBuyNow = () => {
    const planLabel = selectedPlan.label ?? (selectedPlan.months === 1 ? '1 Month' : `${selectedPlan.months} Months`);
    addItem({
      id: product._id, slug: product.slug,
      name: selectedPlan.months > 1 ? `${product.name} (${planLabel})` : product.name,
      logo: product.logo, image: product.image, badge: product.badge,
      category: product.category, shortDescription: product.shortDescription,
      description: product.description, monthlyPrice: selectedPlan.price,
      originalPrice: product.originalPrice, deliveryTime: product.deliveryTime,
      deliveryMethod: product.deliveryMethod, features: product.features,
      rating: product.rating, ratingCount: product.ratingCount,
    } as any);
    navigate('/checkout');
  };

  const waNumber = whatsappNumber || '919999999999';
  const planLabel = selectedPlan.label ?? (selectedPlan.months === 1 ? '1 Month' : `${selectedPlan.months} Months`);
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi! I want to buy *${product.name}* — ${planLabel} plan at ₹${total}. Please share payment details.`)}`;

  const reviews = [
    { name: 'Rahul S.', role: 'Full Stack Dev', date: '2 days ago', body: `Works perfectly! Got my ${product.name} credentials in under 2 minutes. Highly recommend.`, score: 5 },
    { name: 'Priya M.', role: 'Content Creator', date: '1 week ago', body: 'Amazing value for money. Saved so much compared to official pricing. Fast delivery and great support.', score: 5 },
    { name: 'Alex K.', role: 'Designer', date: '2 weeks ago', body: 'Reliable service. Been using for 3 months now with zero issues. Will renew again.', score: 4 },
  ];

  const FEATURE_ICONS = ['Zap', 'Star', 'Shield', 'Globe', 'Code2', 'Layers', 'Cpu', 'BarChart2'];

  return (
    <div className="w-full min-h-screen pt-8 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-6">
          <Link to="/" className="hover:text-brand-400 transition-colors">Home</Link>
          <LucideIcon name="ChevronRight" size={10} />
          <Link to="/products" className="hover:text-brand-400 transition-colors">Products</Link>
          <LucideIcon name="ChevronRight" size={10} />
          <span className="text-slate-300 truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-7">

          {/* LEFT */}
          <div className="lg:col-span-3 space-y-5">

            {/* HERO CARD */}
            <div className="rounded-3xl overflow-hidden border border-line">
              <div className="relative bg-gradient-to-br from-[#1d2634] via-[#0e1521] to-[#111927] px-8 pt-10 pb-0 flex flex-col items-center overflow-hidden">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-brand-600/25 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-8 right-1/4 w-48 h-48 bg-brand-500/15 rounded-full blur-2xl pointer-events-none" />

                <div className="relative w-full flex items-center justify-between mb-6 flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.badge && <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-600 text-white shadow-lg shadow-brand-600/30">{product.badge}</span>}
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/10 text-white/80 border border-white/10 capitalize">{product.category}</span>
                  </div>
                  {discount > 0 && <span className="px-3 py-1 rounded-full text-[10px] font-black bg-brand-500 text-white shadow-lg shadow-brand-500/30">{discount}% OFF</span>}
                </div>

                <div className="relative z-10">
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-12 bg-brand-500/20 blur-2xl rounded-full" />
                  {product.image && !imgError ? (
                    <img src={product.image} alt={product.name} className="relative w-44 h-44 object-contain drop-shadow-2xl" onError={() => setImgError(true)} />
                  ) : (
                    <div className="relative w-36 h-36 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                      <LucideIcon name={product.logo} size={60} strokeWidth={1.2} className="text-white/80" />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-surface px-8 pt-8 pb-7">
                <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">{product.name}</h1>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> {product.deliveryTime}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} viewBox="0 0 20 20" className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-slate-700'} fill-current`}><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
                  </div>
                  <span className="text-sm font-black text-white">{product.rating}</span>
                  <span className="text-xs text-slate-500 font-semibold">({product.ratingCount.toLocaleString()} reviews)</span>
                  <span className="h-3 w-px bg-line mx-1" />
                  <span className="text-xs text-brand-400 font-bold capitalize">{product.category} Tool</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{product.description}</p>
              </div>
            </div>

            {/* FEATURES */}
            <div className="rounded-3xl bg-surface border border-line p-7">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center"><LucideIcon name="Zap" size={13} className="text-white" /></div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider">What's Included</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((feat, i) => (
                  <div key={feat} className="group flex items-start gap-3 p-3.5 rounded-2xl bg-surface-2 hover:bg-surface-3 border border-line transition-all duration-200">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 bg-brand-500/15">
                      <LucideIcon name={FEATURE_ICONS[i % FEATURE_ICONS.length]} size={13} className="text-brand-400" />
                    </div>
                    <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DELIVERY */}
            <div className="rounded-3xl overflow-hidden border border-line">
              <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-7 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0"><LucideIcon name="Truck" size={16} className="text-white" /></div>
                <p className="text-[10px] font-black text-white uppercase tracking-widest">How You'll Receive Access</p>
              </div>
              <div className="bg-surface px-7 py-5 space-y-3">
                {product.deliveryMethod.split(/\/|·|;/).map((s) => s.trim()).filter(Boolean).map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-500/15 border border-brand-500/25 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-[10px] font-black text-brand-300">{i + 1}</span></div>
                    <p className="text-xs font-semibold text-slate-300 leading-snug">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-3xl bg-surface border border-line p-7">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center"><LucideIcon name="HelpCircle" size={13} className="text-white" /></div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider">Frequently Asked</h2>
              </div>
              <div className="space-y-2">
                {FAQS.slice(0, 4).map((faq) => {
                  const isOpen = openFaq === faq.id;
                  return (
                    <div key={faq.id} className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen ? 'border-brand-500/40 bg-brand-500/5' : 'border-line bg-surface-2'}`}>
                      <button onClick={() => setOpenFaq(isOpen ? null : faq.id)} className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left cursor-pointer">
                        <span className={`text-xs font-bold leading-snug ${isOpen ? 'text-brand-300' : 'text-slate-200'}`}>{faq.question}</span>
                        <LucideIcon name={isOpen ? 'ChevronUp' : 'ChevronDown'} size={14} className={isOpen ? 'text-brand-400 flex-shrink-0' : 'text-slate-500 flex-shrink-0'} />
                      </button>
                      {isOpen && <div className="px-4 pb-4"><p className="text-xs text-slate-400 leading-relaxed">{faq.answer}</p></div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* REVIEWS */}
            <div className="rounded-3xl bg-gradient-to-br from-[#1d2634] to-[#111927] border border-line p-7">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-sm font-black text-white uppercase tracking-wider mb-1">Customer Reviews</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} viewBox="0 0 20 20" className="w-3.5 h-3.5 text-amber-400 fill-current"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      ))}
                    </div>
                    <span className="text-xs font-black text-white">{product.rating}</span>
                    <span className="text-[10px] text-white/40 font-semibold">· {product.ratingCount} verified</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reviews.map((r, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3 hover:bg-white/10 transition-all">
                    <div className="flex gap-0.5">
                      {[...Array(r.score)].map((_, j) => (
                        <svg key={j} viewBox="0 0 20 20" className="w-3 h-3 text-amber-400 fill-current"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      ))}
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed flex-1">"{r.body}"</p>
                    <div className="flex items-center gap-2.5 pt-3 border-t border-white/10">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white text-xs font-black flex-shrink-0">{r.name[0]}</div>
                      <div>
                        <p className="text-xs font-bold text-white leading-none">{r.name}</p>
                        <p className="text-[10px] text-white/40 font-medium mt-0.5">{r.role} · {r.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — STICKY BUY BOX */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 space-y-4">
              <div className="rounded-3xl bg-surface border border-line overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600" />
                <div className="p-6">
                  {/* Flash sale */}
                  <div className="mb-5 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 px-4 py-3">
                    <p className="text-[9px] font-black text-white/80 uppercase tracking-widest mb-2 flex items-center gap-1.5"><LucideIcon name="Flame" size={10} className="text-white" /> Flash Sale Ends In</p>
                    <div className="flex items-center gap-2">
                      {[{ val: timeLeft.h, label: 'HRS' }, { val: timeLeft.m, label: 'MIN' }, { val: timeLeft.s, label: 'SEC' }].map((t, i) => (
                        <div key={t.label} className="flex items-center gap-2">
                          <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-white tabular-nums leading-none">{String(t.val).padStart(2, '0')}</span>
                            <span className="text-[8px] font-bold text-white/60 mt-0.5">{t.label}</span>
                          </div>
                          {i < 2 && <span className="text-xl font-black text-white/60 -mt-2">:</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Plans */}
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Select Plan</p>
                  <div className={`grid gap-2.5 mb-5 ${activePlans.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {activePlans.map((plan, i) => {
                      const label = plan.label ?? (plan.months === 1 ? '1 Month' : `${plan.months} Months`);
                      const savingsPct = i === 0 ? 0 : Math.round((1 - plan.price / (baseMonthlyRate * plan.months)) * 100);
                      const isSelected = selectedPlanIdx === i;
                      return (
                        <button key={i} onClick={() => setSelectedPlanIdx(i)}
                          className={`relative p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${isSelected ? 'border-brand-500 bg-brand-500/10' : 'border-line hover:border-slate-600'}`}>
                          {savingsPct > 0 && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full whitespace-nowrap shadow">SAVE {savingsPct}%</span>}
                          {isSelected && <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center"><LucideIcon name="Check" size={9} className="text-white" /></div>}
                          <p className="text-[10px] font-extrabold text-slate-400 mb-1.5">{label}</p>
                          <p className="text-xl font-black text-white">₹{(plan.price / plan.months).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                          {plan.months > 1 ? <p className="text-[9px] text-emerald-400 font-bold mt-0.5">Total ₹{plan.price.toLocaleString('en-IN')}</p> : <p className="text-[9px] text-slate-500 font-semibold mt-0.5">/month</p>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Price summary */}
                  <div className="rounded-2xl bg-brand-500/10 border border-brand-500/20 px-5 py-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 mb-1">You pay today</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-white">₹{total.toLocaleString('en-IN')}</span>
                          <span className="text-sm text-slate-500 line-through">₹{originalTotal.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      {savings > 0 && (
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">You save</p>
                          <p className="text-lg font-black text-emerald-400">₹{savings.toLocaleString('en-IN')}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button onClick={handleBuyNow} className="w-full py-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 mb-3 cursor-pointer active:scale-[0.98]">
                    <LucideIcon name="Zap" size={16} className="fill-current" /> Buy Now — ₹{total.toLocaleString('en-IN')}
                  </button>
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="w-full py-3.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                    {WA_ICON} Buy on WhatsApp
                  </a>
                  <div className="flex items-center justify-center gap-1.5 mt-3">
                    <LucideIcon name="Lock" size={11} className="text-slate-500" />
                    <p className="text-[10px] text-slate-500 font-bold">Secure payment · Instant delivery · 24/7 support</p>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: 'ShieldCheck', label: 'Verified', sub: '100% Safe' },
                  { icon: 'Zap',         label: 'Instant',  sub: '2-5 min' },
                  { icon: 'Headphones',  label: '24/7',     sub: 'Support' },
                ].map((b) => (
                  <div key={b.label} className="rounded-2xl bg-surface border border-line p-3.5 flex flex-col items-center gap-1.5 text-center">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-brand-500/15 text-brand-400"><LucideIcon name={b.icon} size={15} /></div>
                    <p className="text-[10px] font-black text-slate-200 leading-none">{b.label}</p>
                    <p className="text-[9px] text-slate-500 font-semibold">{b.sub}</p>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="rounded-2xl bg-surface border border-line p-4 grid grid-cols-3 divide-x divide-line">
                {[{ val: '15K+', label: 'Happy Users' }, { val: '99%', label: 'Uptime' }, { val: '< 5m', label: 'Delivery' }].map((s) => (
                  <div key={s.label} className="flex flex-col items-center px-2">
                    <span className="text-base font-black text-brand-400">{s.val}</span>
                    <span className="text-[9px] text-slate-500 font-bold text-center mt-0.5">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
