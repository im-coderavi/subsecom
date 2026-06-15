import { Product } from '../types';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { LucideIcon } from './LucideIcon';

interface ProductCardProps {
  product: Product;
  whatsappNumber?: string;
}

const SLUG_COLORS: Record<string, { from: string; to: string }> = {
  'claude-3-5':    { from: '#e07040', to: '#c05a30' },
  'chatgpt-plus':  { from: '#10a37f', to: '#059669' },
  'gemini-pro':    { from: '#4285f4', to: '#1a73e8' },
  'midjourney':    { from: '#1a1a2e', to: '#0f0f1a' },
  'cursor-pro':    { from: '#1e293b', to: '#0f172a' },
  'perplexity-pro':{ from: '#20b2aa', to: '#0891b2' },
  'notion-ai':     { from: '#191919', to: '#000000' },
  'copilot-pro':   { from: '#0078d4', to: '#005a9e' },
  'runway-gen3':   { from: '#0d0d0d', to: '#1a0a2e' },
  'elevenlabs-pro':{ from: '#f5a623', to: '#e08020' },
  'dall-e-3':      { from: '#10a37f', to: '#059669' },
  'suno-pro':      { from: '#6d28d9', to: '#5b21b6' },
};

const CATEGORY_COLORS: Record<string, { from: string; to: string }> = {
  chat:         { from: '#1e3a8a', to: '#0c1b3f' },
  code:         { from: '#1f2937', to: '#030712' },
  image:        { from: '#7f1d1d', to: '#3b0a1e' },
  video:        { from: '#7c2d12', to: '#3b0a0a' },
  voice:        { from: '#78350f', to: '#3b1a05' },
  productivity: { from: '#064e3b', to: '#042f2e' },
  design:       { from: '#581c87', to: '#2e1065' },
  writing:      { from: '#0c4a6e', to: '#082f49' },
};

const CATEGORY_LABEL: Record<string, string> = {
  chat: 'AI', code: 'Developer', image: 'Creative', video: 'Creative',
  voice: 'AI', productivity: 'Productivity', design: 'Design', writing: 'AI',
};

// Payment-method row matching the reference (2 white pills + 3 colored circles)
function PaymentRow() {
  return (
    <div className="flex items-center justify-center flex-wrap gap-2 pt-3 mt-3 border-t border-line/70">
      <span className="h-6 px-2 rounded-md bg-white flex items-center justify-center text-[9px] font-black italic text-[#1a1f71] shadow-sm">VISA</span>
      <span className="h-6 px-2.5 rounded-md bg-white flex items-center justify-center shadow-sm">
        <span className="w-3 h-3 rounded-full bg-[#eb001b] -mr-1.5" /><span className="w-3 h-3 rounded-full bg-[#f79e1b]/90" />
      </span>
      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#e2136e] to-[#b30d56] flex items-center justify-center shadow-sm">
        <LucideIcon name="Send" size={11} className="text-white" />
      </span>
      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2e90fa] to-[#1e78e6] flex items-center justify-center shadow-sm">
        <LucideIcon name="CreditCard" size={11} className="text-white" />
      </span>
      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#f0b90b] to-[#d9a400] flex items-center justify-center shadow-sm text-[#1a1f71] text-[11px] font-black">₿</span>
    </div>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);

  const colors = SLUG_COLORS[product.slug] ?? CATEGORY_COLORS[product.category] ?? { from: '#1e3a8a', to: '#0c1b3f' };
  const discount = product.originalPrice > product.monthlyPrice
    ? Math.min(99, Math.round(((product.originalPrice - product.monthlyPrice) / product.originalPrice) * 100))
    : 0;

  const initials = product.name.split(' ').slice(0, 2).map((w) => w[0]).join('');
  const showImage = product.image && !imgError;

  return (
    <div className="group flex flex-col rounded-2xl bg-surface border border-line/80 hover:border-brand-500/40 hover:shadow-2xl hover:shadow-brand-900/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden">

      {/* Image — FULL-BLEED, attached to card top edges, solid deep-blue background */}
      <div className="relative" style={{ aspectRatio: '16 / 9', background: '#0d2350' }}>
        {/* very subtle spotlight behind the thumbnail */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(75% 85% at 50% 24%, ${colors.from}26, transparent 72%)` }} />
        {/* faint top highlight */}
        <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)' }} />

        {showImage ? (
          <img src={product.image} alt={product.name} onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
        ) : (
          /* Rich branded placeholder (icon tile + name) when no image */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 px-4">
            <div
              className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-105 transition-transform"
              style={{ boxShadow: `0 8px 28px -6px ${colors.from}` }}
            >
              <LucideIcon name={product.logo || 'Sparkles'} size={26} className="text-white" strokeWidth={2} />
            </div>
            <span className="text-white font-extrabold text-sm tracking-tight text-center line-clamp-1 drop-shadow">{product.name}</span>
          </div>
        )}

        {/* Featured (top-left) */}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-[9px] font-extrabold text-slate-100 px-2 py-0.5 rounded-md bg-black/55 backdrop-blur-sm">
          <LucideIcon name="Star" size={9} className="fill-gold text-gold" /> Featured
        </span>
        {/* OFF (top-right) */}
        {discount > 0 && (
          <span className="absolute top-3 right-3 text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-brand-600/90 text-white backdrop-blur-sm shadow-sm">-{discount}% OFF</span>
        )}
      </div>

      {/* Content — padded section below the attached image */}
      <div className="flex flex-col flex-1 p-3.5">
        {/* Category */}
        <span className="self-start text-[9px] font-bold text-slate-300 px-2 py-0.5 rounded-md bg-surface-3 border border-line mb-2">
          {CATEGORY_LABEL[product.category] ?? product.category}
        </span>

        {/* Name + desc */}
        <h3 className="font-extrabold text-[15px] text-white leading-tight mb-1 group-hover:text-brand-400 transition-colors line-clamp-1">{product.name}</h3>
        <p className="text-xs text-slate-400 line-clamp-2 leading-snug mb-2.5 min-h-[2rem]">{product.shortDescription}</p>

        {/* Price */}
        <div className="flex items-end justify-between mb-2.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[22px] font-black text-white tracking-tight leading-none">₹{product.monthlyPrice.toLocaleString('en-IN')}</span>
            {product.originalPrice > product.monthlyPrice && (
              <span className="text-[12px] text-slate-500 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 font-semibold whitespace-nowrap">/ month</span>
        </div>

        {/* In stock */}
        <div className="mb-3">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> In Stock
          </span>
        </div>

        {/* Buttons: Details + Buy Now */}
        <div className="flex items-center gap-2 mt-auto">
          <Link to={`/products/${product.slug}`} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-transparent hover:bg-surface-3 border border-line text-slate-200 font-bold text-xs transition-colors">
            <LucideIcon name="Info" size={13} /> Details
          </Link>
          <Link to={`/products/${product.slug}`} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-extrabold text-xs shadow-lg shadow-brand-500/25 transition-all">
            <LucideIcon name="Zap" size={13} className="fill-current" /> Buy Now
          </Link>
        </div>

        <PaymentRow />
      </div>
    </div>
  );
}
