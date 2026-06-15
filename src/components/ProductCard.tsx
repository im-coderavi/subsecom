import { Product } from '../types';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { LucideIcon } from './LucideIcon';

interface ProductCardProps {
  product: Product;
  whatsappNumber?: string;
}

// Vibrant brand-tile colors per product slug (fallback when image fails)
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
  chat:         { from: '#4f46e5', to: '#4338ca' },
  code:         { from: '#1e293b', to: '#0f172a' },
  image:        { from: '#e11d48', to: '#be123c' },
  video:        { from: '#dc2626', to: '#ea580c' },
  voice:        { from: '#d97706', to: '#b45309' },
  productivity: { from: '#059669', to: '#0284c7' },
  design:       { from: '#7c3aed', to: '#c026d3' },
  writing:      { from: '#0284c7', to: '#0891b2' },
};

const CATEGORY_LABEL: Record<string, string> = {
  chat: 'AI · Chat', code: 'AI · Code', image: 'AI · Image', video: 'AI · Video',
  voice: 'AI · Voice', productivity: 'Productivity', design: 'Design', writing: 'AI · Writing',
};

export function ProductCard({ product, whatsappNumber }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);

  const waNumber = whatsappNumber || '919999999999';
  const waMsg = encodeURIComponent(
    `Hi! I'm interested in *${product.name}* at ₹${product.monthlyPrice}/mo. Please share payment details.`
  );
  const waUrl = `https://wa.me/${waNumber}?text=${waMsg}`;

  const colors =
    SLUG_COLORS[product.slug] ??
    CATEGORY_COLORS[product.category] ??
    { from: '#4f46e5', to: '#4338ca' };

  const discount =
    product.originalPrice > product.monthlyPrice
      ? Math.min(90, Math.round(((product.originalPrice - product.monthlyPrice) / product.originalPrice) * 100))
      : 0;

  const initials = product.name.split(' ').slice(0, 2).map((w) => w[0]).join('');
  const showImage = product.image && !imgError;

  return (
    <div className="group flex flex-col rounded-2xl bg-white border border-slate-200/70 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:border-brand-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden">

      {/* Image section — full bleed */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ height: 170, background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, transparent 55%)' }} />

        {showImage ? (
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-black select-none drop-shadow-lg" style={{ fontSize: 56, letterSpacing: '-2px' }}>
              {initials}
            </span>
          </div>
        )}

        {/* Category tag */}
        <span className="absolute top-3 left-3 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/90 text-slate-700 backdrop-blur-sm shadow-sm">
          {CATEGORY_LABEL[product.category] ?? product.category}
        </span>
        {discount > 0 && (
          <span className="absolute top-3 right-3 text-[9px] font-extrabold px-2 py-1 rounded-full bg-rose-500 text-white shadow-sm">
            -{discount}%
          </span>
        )}

        {/* Delivery badge — bottom */}
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-[9px] font-bold text-white px-2 py-1 rounded-full bg-black/35 backdrop-blur-sm">
          <LucideIcon name="Zap" size={9} className="fill-current" />
          {product.deliveryTime || 'Instant'}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-extrabold text-[15px] text-slate-900 group-hover:text-brand-600 transition-colors leading-tight mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3 flex-1">
          {product.shortDescription}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-3">
          <span className="text-xl font-black text-slate-900">₹{product.monthlyPrice.toFixed(0)}</span>
          <span className="text-[10px] text-slate-400 font-semibold">/month</span>
          {product.originalPrice > product.monthlyPrice && (
            <span className="text-xs text-slate-400 line-through ml-auto">₹{product.originalPrice.toFixed(0)}</span>
          )}
        </div>

        {/* Buttons */}
        <Link
          to={`/products/${product.slug}`}
          className="w-full py-2.5 text-center font-bold text-xs rounded-xl bg-brand-600 hover:bg-brand-700 text-white transition-all shadow-sm shadow-brand-500/20 mb-2 flex items-center justify-center gap-1.5"
        >
          Get {product.name.split(' ')[0]}
          <LucideIcon name="ArrowRight" size={13} strokeWidth={2.5} />
        </Link>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 text-center font-bold text-xs rounded-xl border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-all flex items-center justify-center gap-1.5"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Buy on WhatsApp
        </a>
      </div>
    </div>
  );
}
