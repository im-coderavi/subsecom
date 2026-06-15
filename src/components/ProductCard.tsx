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
  chat:         { from: '#2e90fa', to: '#1e78e6' },
  code:         { from: '#334155', to: '#1e293b' },
  image:        { from: '#e11d48', to: '#be123c' },
  video:        { from: '#dc2626', to: '#ea580c' },
  voice:        { from: '#d97706', to: '#b45309' },
  productivity: { from: '#059669', to: '#0284c7' },
  design:       { from: '#7c3aed', to: '#c026d3' },
  writing:      { from: '#0284c7', to: '#0891b2' },
};

const CATEGORY_LABEL: Record<string, string> = {
  chat: 'AI', code: 'Developer', image: 'Creative', video: 'Creative',
  voice: 'AI', productivity: 'Productivity', design: 'Design', writing: 'AI',
};

// Compact payment-method chips row (matches the small icon row on cards)
function PaymentRow() {
  const chip = 'h-6 w-9 rounded-md bg-white flex items-center justify-center text-[8px] font-black shadow-sm';
  return (
    <div className="flex items-center gap-1.5 pt-3 mt-3 border-t border-line/70">
      <span className={`${chip} text-[#1a1f71] italic`}>VISA</span>
      <span className="h-6 w-9 rounded-md bg-white flex items-center justify-center shadow-sm">
        <span className="w-2.5 h-2.5 rounded-full bg-[#eb001b] -mr-1" /><span className="w-2.5 h-2.5 rounded-full bg-[#f79e1b]/90" />
      </span>
      <span className={`${chip} text-[#2e90fa]`}>UPI</span>
      <span className={`${chip} text-[#f0b90b]`}>₿</span>
      <span className="h-6 w-9 rounded-md bg-brand-500/15 border border-brand-500/25 flex items-center justify-center text-[8px] font-black text-brand-300">SSL</span>
    </div>
  );
}

export function ProductCard({ product, whatsappNumber }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);

  const waNumber = whatsappNumber || '919999999999';
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi! I'm interested in *${product.name}* at ₹${product.monthlyPrice}/mo. Please share payment details.`)}`;

  const colors = SLUG_COLORS[product.slug] ?? CATEGORY_COLORS[product.category] ?? { from: '#2e90fa', to: '#1e78e6' };
  const discount = product.originalPrice > product.monthlyPrice
    ? Math.min(99, Math.round(((product.originalPrice - product.monthlyPrice) / product.originalPrice) * 100))
    : 0;

  const initials = product.name.split(' ').slice(0, 2).map((w) => w[0]).join('');
  const showImage = product.image && !imgError;

  return (
    <div className="group flex flex-col rounded-2xl bg-surface border border-line/80 hover:border-brand-500/40 hover:shadow-2xl hover:shadow-brand-900/30 hover:-translate-y-1 transition-all duration-300 p-3.5">

      {/* Top: Featured + OFF */}
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-slate-200 px-2.5 py-1 rounded-md bg-surface-3 border border-line">
          <LucideIcon name="Star" size={10} className="fill-gold text-gold" /> Featured
        </span>
        {discount > 0 && (
          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-brand-500/15 text-brand-300 border border-brand-500/25">-{discount}% OFF</span>
        )}
      </div>

      {/* Image tile */}
      <div className="relative rounded-xl overflow-hidden mb-3" style={{ aspectRatio: '4 / 3', background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 55%)' }} />
        {showImage ? (
          <img src={product.image} alt={product.name} onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-contain p-5 group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-black select-none drop-shadow-lg" style={{ fontSize: 48, letterSpacing: '-2px' }}>{initials}</span>
          </div>
        )}
      </div>

      {/* Category */}
      <span className="self-start text-[10px] font-bold text-slate-400 px-2.5 py-0.5 rounded-md bg-surface-2 border border-line mb-2.5">
        {CATEGORY_LABEL[product.category] ?? product.category}
      </span>

      {/* Name + desc */}
      <h3 className="font-extrabold text-[15px] text-white leading-tight mb-1 group-hover:text-brand-400 transition-colors line-clamp-1">{product.name}</h3>
      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3 min-h-[2rem]">{product.shortDescription}</p>

      {/* Price */}
      <div className="flex items-end justify-between mb-2.5">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-white tracking-tight">₹{product.monthlyPrice.toLocaleString('en-IN')}</span>
          {product.originalPrice > product.monthlyPrice && (
            <span className="text-xs text-slate-500 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          )}
        </div>
        <span className="text-[11px] text-slate-500 font-semibold">/ month</span>
      </div>

      {/* In stock */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> In Stock
        </span>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2">
        <Link to={`/products/${product.slug}`} className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-surface-3 hover:bg-surface-2 border border-line text-slate-200 font-bold text-xs transition-colors">
          <LucideIcon name="Info" size={13} /> Details
        </Link>
        <Link to={`/products/${product.slug}`} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-extrabold text-xs shadow-lg shadow-brand-500/25 transition-all">
          <LucideIcon name="Zap" size={13} className="fill-current" /> Buy Now
        </Link>
      </div>

      {/* WhatsApp quick buy */}
      <a href={waUrl} target="_blank" rel="noopener noreferrer"
        className="mt-2 w-full py-2 text-center font-bold text-[11px] rounded-xl border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-1.5">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Buy on WhatsApp
      </a>

      <PaymentRow />
    </div>
  );
}
