import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from './LucideIcon';
import { Product } from '../types';

const GRADIENTS: Record<string, string> = {
  chat:         'from-[#1e3a8a] via-[#1e40af] to-[#0c1b3f]',
  code:         'from-[#1f2937] via-[#111827] to-[#030712]',
  image:        'from-[#7f1d1d] via-[#9f1239] to-[#3b0a1e]',
  video:        'from-[#7c2d12] via-[#b91c1c] to-[#3b0a0a]',
  voice:        'from-[#78350f] via-[#b45309] to-[#3b1a05]',
  productivity: 'from-[#064e3b] via-[#0f766e] to-[#042f2e]',
  design:       'from-[#581c87] via-[#7e22ce] to-[#2e1065]',
  writing:      'from-[#0c4a6e] via-[#0369a1] to-[#082f49]',
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

  if (!items.length) return <div className="w-full h-[420px] rounded-3xl bg-surface border border-line animate-pulse" />;

  const p = items[index];
  const grad = GRADIENTS[p.category] ?? 'from-[#1e3a8a] via-[#1e40af] to-[#0c1b3f]';
  const waNumber = whatsappNumber || '919999999999';
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi! I want *${p.name}*. Please share details.`)}`;

  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* side chevrons — hidden on mobile (use dots / swipe instead) */}
      <button onClick={prev} aria-label="Previous" className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#161e28]/80 hover:bg-[#161e28] border border-line text-white hidden sm:flex items-center justify-center backdrop-blur transition-colors">
        <LucideIcon name="ChevronLeft" size={18} />
      </button>
      <button onClick={next} aria-label="Next" className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#161e28]/80 hover:bg-[#161e28] border border-line text-white hidden sm:flex items-center justify-center backdrop-blur transition-colors">
        <LucideIcon name="ChevronRight" size={18} />
      </button>

      {/* card */}
      <div className={`running-border relative overflow-hidden rounded-3xl bg-gradient-to-br ${grad} border border-white/10 shadow-2xl shadow-black/40`}>
        <div className="absolute -top-16 -right-10 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-10 w-80 h-80 rounded-full bg-black/30 blur-3xl pointer-events-none" />

        {/* faux device mockup, right side */}
        <div className="absolute top-10 right-0 sm:right-6 w-1/2 hidden sm:block pointer-events-none opacity-70">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm rotate-3">
            <div className="flex gap-1.5 mb-3">
              <span className="w-2 h-2 rounded-full bg-white/40" /><span className="w-2 h-2 rounded-full bg-white/30" /><span className="w-2 h-2 rounded-full bg-white/20" />
            </div>
            <div className="space-y-2">
              <div className="h-2 rounded bg-white/20 w-3/4" />
              <div className="h-2 rounded bg-white/15 w-1/2" />
              <div className="h-2 rounded bg-white/10 w-2/3" />
            </div>
          </div>
        </div>

        <div className="relative p-6 sm:p-10 md:p-12 h-[320px] sm:h-[380px] md:h-[400px] lg:h-[420px] flex flex-col justify-center">
          {/* tags top */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/15 text-white backdrop-blur-sm">
              {p.category} Suite
            </span>
            {p.badge && (
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/10 text-white/90 backdrop-blur-sm">{p.badge}</span>
            )}
          </div>

          {/* name + tagline */}
          <div className="max-w-lg">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.05] mb-2.5">{p.name}</h2>
            <p className="text-sm sm:text-lg text-white/80 font-medium mb-5 sm:mb-7 line-clamp-2">{p.shortDescription}</p>

            {/* buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
              <Link to={`/products/${p.slug}`} className="px-6 py-3.5 bg-white text-slate-900 font-extrabold text-sm rounded-xl shadow-lg hover:scale-[1.03] active:scale-95 transition-transform text-center flex items-center justify-center gap-2">
                Unlock {p.name.split(' ')[0]} <LucideIcon name="ArrowRight" size={15} strokeWidth={2.5} />
              </Link>
              <Link to="/products?tag=bundles" className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-extrabold text-sm rounded-xl backdrop-blur-sm transition-colors text-center flex items-center justify-center gap-2">
                <LucideIcon name="Sparkles" size={15} className="text-gold" /> Get Royal Membership
              </Link>
            </div>

            {/* feature tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white/85 px-3 py-1.5 rounded-full bg-white/10 border border-white/15">
                <LucideIcon name="ShieldCheck" size={12} /> All Apps · Genuine
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white/85 px-3 py-1.5 rounded-full bg-white/10 border border-white/15">
                <LucideIcon name="Zap" size={12} className="fill-current" /> {p.deliveryTime || '5-min Delivery'}
              </span>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white/85 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 hover:bg-white/20 transition-colors">
                <LucideIcon name="MessageCircle" size={12} /> Quick Buy
              </a>
            </div>
          </div>

          {/* counter bottom-right */}
          <span className="absolute bottom-6 right-7 text-xs font-black text-white/60 tabular-nums">
            {String(index + 1).padStart(2, '0')} <span className="text-white/30">/ {String(items.length).padStart(2, '0')}</span>
          </span>
        </div>
      </div>

      {/* dots */}
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {items.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${i === index ? 'w-7 bg-brand-500' : 'w-1.5 bg-line hover:bg-slate-600'}`} />
        ))}
      </div>
    </div>
  );
}
