import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { LucideIcon } from './LucideIcon';

interface ProductCardProps {
  product: Product;
  whatsappNumber?: string;
}

const SLUG_COLORS: Record<string, { from: string; to: string }> = {
  'claude-3-5': { from: '#e07040', to: '#c05a30' },
  'chatgpt-plus': { from: '#10a37f', to: '#059669' },
  'gemini-pro': { from: '#4285f4', to: '#1a73e8' },
  'midjourney': { from: '#1a1a2e', to: '#0f0f1a' },
  'cursor-pro': { from: '#1e293b', to: '#0f172a' },
  'perplexity-pro': { from: '#20b2aa', to: '#0891b2' },
  'notion-ai': { from: '#191919', to: '#000000' },
  'copilot-pro': { from: '#0078d4', to: '#005a9e' },
  'runway-gen3': { from: '#0d0d0d', to: '#1a0a2e' },
  'elevenlabs-pro': { from: '#f5a623', to: '#e08020' },
  'dall-e-3': { from: '#10a37f', to: '#059669' },
  'suno-pro': { from: '#6d28d9', to: '#5b21b6' },
};

const CATEGORY_COLORS: Record<string, { from: string; to: string }> = {
  chat: { from: '#1f4ed8', to: '#0f1d35' },
  code: { from: '#24303f', to: '#0d1320' },
  image: { from: '#2c2c9c', to: '#121638' },
  video: { from: '#0f3d56', to: '#071822' },
  voice: { from: '#2b4f8a', to: '#101c2e' },
  productivity: { from: '#184a5c', to: '#0b1a29' },
  design: { from: '#2055b9', to: '#0f1830' },
  writing: { from: '#124b7a', to: '#081626' },
};

const CATEGORY_LABEL: Record<string, string> = {
  chat: 'AI',
  code: 'Creative',
  image: 'Design',
  video: 'Creative',
  voice: 'AI',
  productivity: 'Productivity',
  design: 'Design',
  writing: 'AI',
};

function PaymentRow() {
  return (
    <div className="mt-2 pt-2 sm:mt-2.5 sm:pt-2.5 flex flex-nowrap items-center justify-center gap-1 sm:gap-2 border-t border-white/8 overflow-hidden">
      <span className="flex h-6 sm:h-7 min-w-[34px] sm:min-w-[60px] shrink-0 items-center justify-center rounded-full bg-white px-1.5 sm:px-3 text-[8px] sm:text-[9px] font-black italic text-[#1a1f71] shadow-sm">
        VISA
      </span>
      <span className="flex h-6 sm:h-7 min-w-[28px] sm:min-w-[46px] shrink-0 items-center justify-center rounded-full bg-white px-1.5 sm:px-3 shadow-sm">
        <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#eb001b] -mr-1 sm:-mr-1.5" />
        <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#f79e1b]" />
      </span>
      <span className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
        <span className="text-[10px] sm:text-[12px] font-black text-[#d23b96]">U</span>
      </span>
      <span className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
        <span className="text-[10px] sm:text-[11px] font-black text-[#e11d48]">N</span>
      </span>
      <span className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
        <span className="text-[10px] sm:text-[11px] font-black text-[#f0b90b]">B</span>
      </span>
    </div>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [showQuickDetails, setShowQuickDetails] = useState(false);

  const colors = SLUG_COLORS[product.slug] ?? CATEGORY_COLORS[product.category] ?? { from: '#1f4ed8', to: '#0f1d35' };
  const discount = product.originalPrice > product.monthlyPrice
    ? Math.min(99, Math.round(((product.originalPrice - product.monthlyPrice) / product.originalPrice) * 100))
    : 0;
  const showImage = Boolean(product.image) && !imgError;
  const categoryLabel = CATEGORY_LABEL[product.category] ?? product.category;

  useEffect(() => {
    if (!showQuickDetails) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowQuickDetails(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showQuickDetails]);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[20px] sm:rounded-[28px] border border-white/10 bg-[#28323f] shadow-[0_20px_50px_rgba(3,8,20,0.34)] transition-all duration-300 sm:min-h-[446px] hover:-translate-y-1 hover:border-[#4ab0ff]/45 hover:shadow-[0_30px_70px_rgba(22,72,160,0.28)]">
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-[#10172b]">
        {showImage ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 50% 22%, ${colors.from}33, transparent 58%)`,
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-[0_10px_28px_rgba(0,0,0,0.25)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-105"
                style={{ boxShadow: `0 12px 32px -10px ${colors.from}` }}
              >
                <LucideIcon name={product.logo || 'Sparkles'} size={28} strokeWidth={2} />
              </div>
              <span className="max-w-[180px] truncate text-center text-[11px] font-extrabold tracking-tight text-white">
                {product.name}
              </span>
            </div>
          </>
        )}

        {/* dark gradients so the Featured / discount badges stay readable on any image */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/35 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/30 to-transparent" />

        {discount > 0 && (
          <span className="absolute right-2 top-2 sm:right-3 sm:top-3 rounded-md sm:rounded-2xl bg-[#43a5ff] px-1.5 py-[1px] sm:px-3 sm:py-1 text-[8px] sm:text-[11px] leading-none font-black text-white shadow-[0_10px_22px_rgba(67,165,255,0.25)]">
            -{discount}%
          </span>
        )}

        <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 inline-flex items-center rounded-full border border-white/10 bg-black/25 px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-semibold text-white/90 backdrop-blur-sm">
          {categoryLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-2 sm:px-5 sm:pb-4 sm:pt-3.5">
        <h3 className="mb-1 sm:mb-1.5 line-clamp-1 text-[15px] sm:text-[21px] font-black leading-tight tracking-tight text-white transition-colors group-hover:text-[#9ed1ff]">
          {product.name}
        </h3>
        <p className="mb-2 sm:mb-2.5 line-clamp-2 text-[12px] sm:text-[13px] leading-[1.15rem] sm:leading-5 text-[#c7d0de] sm:min-h-[2.4rem]">
          {product.shortDescription}
        </p>

        <div className="mb-2.5 sm:mb-3">
          <div className="flex items-end gap-1.5 sm:gap-2 whitespace-nowrap">
            <span className="text-[22px] sm:text-[31px] font-black leading-none tracking-tight text-[#d8ecff]">
              Rs {product.monthlyPrice.toLocaleString('en-IN')}
            </span>
            <span className="pb-0.5 sm:pb-1 text-[9px] sm:text-[10px] font-semibold text-white/70">
              / mo
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-2">
            {product.originalPrice > product.monthlyPrice ? (
              <span className="text-[11px] sm:text-[12px] font-medium text-white/45 line-through whitespace-nowrap">
                Rs {product.originalPrice.toLocaleString('en-IN')}
              </span>
            ) : (
              <span />
            )}
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[11px] font-bold text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              In stock
            </span>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={() => setShowQuickDetails(true)}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl sm:rounded-2xl border border-white/8 bg-[#1f2734] px-2.5 py-2.5 sm:px-4 sm:py-2.25 text-[13px] font-extrabold text-white transition-colors hover:bg-[#273142]"
            aria-label="Quick details"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/70 text-[11px] leading-none">
              i
            </span>
            <span className="hidden sm:inline">Details</span>
          </button>
          <Link
            to={`/products/${product.slug}`}
            className="flex flex-1 items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-xl sm:rounded-2xl bg-[#4ab0ff] px-2 py-2.5 sm:px-4 sm:py-2.25 text-[13px] font-extrabold text-[#08111f] shadow-[0_12px_24px_rgba(74,176,255,0.22)] transition-colors hover:bg-[#65bcff] active:scale-[0.98]"
          >
            <LucideIcon name="Zap" size={14} className="shrink-0 fill-current" />
            Buy Now
          </Link>
        </div>

        <PaymentRow />
      </div>

      {showQuickDetails && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
          onClick={() => setShowQuickDetails(false)}
        >
          <div
            className="w-full max-w-[360px] rounded-3xl border border-white/10 bg-[#222b38] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#4ab0ff]">
                  Quick Details
                </p>
                <h4 className="mt-1 text-lg font-black leading-tight text-white">
                  {product.name}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowQuickDetails(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close quick details"
              >
                <LucideIcon name="X" size={14} />
              </button>
            </div>

            <p className="text-sm leading-6 text-[#c8d2df]">
              {product.shortDescription}
            </p>

            <div className="mt-5 flex items-center justify-between gap-3">
              <Link
                to={`/products/${product.slug}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#4ab0ff] px-4 py-3 text-sm font-extrabold text-[#08111f] transition-colors hover:bg-[#65bcff]"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#08111f]/30 text-[11px] leading-none">
                  →
                </span>
                View full page
              </Link>

              <span className="text-xs font-bold text-slate-400">
                Refund Policy
              </span>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
