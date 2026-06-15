import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from './LucideIcon';
import { Product } from '../types';

const GRADIENTS: Record<string, string> = {
  chat: 'from-indigo-600 via-brand-600 to-blue-700',
  code: 'from-slate-800 via-slate-900 to-black',
  image: 'from-rose-600 via-pink-600 to-fuchsia-700',
  video: 'from-orange-600 via-red-600 to-rose-700',
  voice: 'from-amber-500 via-orange-600 to-red-600',
  productivity: 'from-emerald-600 via-teal-600 to-cyan-700',
  design: 'from-violet-600 via-purple-600 to-fuchsia-700',
  writing: 'from-sky-600 via-cyan-600 to-blue-700',
};

interface Props {
  products: Product[];
  whatsappNumber?: string;
}

export function FeatureCarousel({ products, whatsappNumber }: Props) {
  const items = products.slice(0, 8);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % items.length), [items.length]);
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [paused, next, items.length]);

  if (!items.length) {
    return (
      <div className="w-full h-[340px] rounded-3xl bg-white border border-slate-200/70 shadow-sm animate-pulse" />
    );
  }

  const p = items[index];
  const grad = GRADIENTS[p.category] ?? 'from-brand-600 via-brand-700 to-indigo-800';
  const waNumber = whatsappNumber || '919999999999';
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi! I want *${p.name}*. Please share details.`)}`;
  const discount =
    p.originalPrice > p.monthlyPrice
      ? Math.min(90, Math.round(((p.originalPrice - p.monthlyPrice) / p.originalPrice) * 100))
      : 0;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${grad} shadow-2xl shadow-slate-300/50`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* glow orbs */}
      <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-black/20 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.15] pointer-events-none" />

      <div className="relative p-7 sm:p-10 flex flex-col min-h-[360px]">
        {/* top row: tag + counter */}
        <div className="flex items-center justify-between mb-6">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/15 text-white backdrop-blur-sm border border-white/15">
            <LucideIcon name="Sparkles" size={11} />
            Featured Subscription
          </span>
          <span className="text-xs font-black text-white/70 tabular-nums">
            {String(index + 1).padStart(2, '0')} <span className="text-white/40">/ {String(items.length).padStart(2, '0')}</span>
          </span>
        </div>

        {/* body */}
        <div className="flex-1 flex flex-col justify-center max-w-xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 mb-2">
            {p.category}{p.badge ? ` · ${p.badge}` : ''}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.05] mb-3">
            {p.name}
          </h2>
          <p className="text-sm sm:text-base text-white/80 font-medium leading-relaxed mb-5 line-clamp-2">
            {p.shortDescription}
          </p>

          <div className="flex items-center gap-4 mb-7">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-white">₹{p.monthlyPrice.toFixed(0)}</span>
              <span className="text-xs font-semibold text-white/60">/mo</span>
            </div>
            {discount > 0 && (
              <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-white text-slate-900">
                Save {discount}%
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              {p.deliveryTime || '5-min Delivery'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              to={`/products/${p.slug}`}
              className="px-6 py-3 bg-white text-slate-900 font-extrabold text-sm rounded-xl shadow-lg hover:scale-[1.03] active:scale-95 transition-transform text-center flex items-center justify-center gap-2"
            >
              Get {p.name.split(' ')[0]}
              <LucideIcon name="ArrowRight" size={15} strokeWidth={2.5} />
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-extrabold text-sm rounded-xl transition-colors text-center"
            >
              Quick Buy
            </a>
          </div>
        </div>

        {/* controls + dots */}
        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === index ? 'w-7 bg-white' : 'w-1.5 bg-white/35 hover:bg-white/60'}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prev} aria-label="Previous" className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center transition-colors">
              <LucideIcon name="ChevronLeft" size={16} />
            </button>
            <button onClick={next} aria-label="Next" className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center transition-colors">
              <LucideIcon name="ChevronRight" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
