import { Bundle } from '../types';
import { useCartStore } from '../store/useCartStore';
import { LucideIcon } from './LucideIcon';

interface BundleCardProps {
  bundle: Bundle;
  key?: any;
}

const THEMES = {
  creator: {
    topBar: 'from-violet-500 to-indigo-600',
    glow: '0 0 40px rgba(124,58,237,0.18)',
    saveBg: 'bg-violet-500/15 text-violet-300 border border-violet-500/25',
    check: 'text-violet-400',
    btn: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-900/40',
    cardBorder: 'border-violet-800/30 hover:border-violet-600/40',
    popular: false,
  },
  pro: {
    topBar: 'from-emerald-500 to-teal-500',
    glow: '0 0 40px rgba(16,185,129,0.18)',
    saveBg: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
    check: 'text-emerald-400',
    btn: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-900/40',
    cardBorder: 'border-emerald-800/30 hover:border-emerald-600/40',
    popular: true,
  },
  ultimate: {
    topBar: 'from-amber-400 via-rose-500 to-violet-600',
    glow: '0 0 40px rgba(245,158,11,0.15)',
    saveBg: 'bg-amber-500/15 text-amber-300 border border-amber-500/25',
    check: 'text-amber-400',
    btn: 'bg-gradient-to-r from-amber-500 via-rose-500 to-violet-600 hover:opacity-90 shadow-amber-900/40',
    cardBorder: 'border-amber-800/30 hover:border-amber-600/40',
    popular: false,
  },
} as const;

const TOOL_ICONS: Record<string, { icon: string; bg: string; color: string }> = {
  'ChatGPT Plus':    { icon: 'MessageSquareCode', bg: 'bg-emerald-500/15', color: 'text-emerald-400' },
  'Claude 3.5 Sonoma': { icon: 'Sparkles',        bg: 'bg-orange-500/15',  color: 'text-orange-400'  },
  'Gemini Advanced': { icon: 'Sparkle',            bg: 'bg-blue-500/15',   color: 'text-blue-400'    },
  'Midjourney Pro':  { icon: 'Image',              bg: 'bg-indigo-500/15', color: 'text-indigo-400'  },
  'Cursor Pro':      { icon: 'Code2',              bg: 'bg-neutral-500/15',color: 'text-neutral-300' },
  'Runway Gen-3 Pro':{ icon: 'Film',               bg: 'bg-slate-500/15',  color: 'text-slate-300'   },
  'Notion AI Pro':   { icon: 'Layers',             bg: 'bg-neutral-400/15',color: 'text-neutral-300' },
  'ElevenLabs Pro':  { icon: 'Speaker',            bg: 'bg-amber-500/15',  color: 'text-amber-400'   },
  'Suno AI Pro':     { icon: 'Music',              bg: 'bg-rose-500/15',   color: 'text-rose-400'    },
};

export function BundleCard({ bundle }: BundleCardProps) {
  const addBundleItem = useCartStore((state) => state.addBundleItem);
  const theme = THEMES[bundle.colorTheme] ?? THEMES.creator;

  return (
    <div
      className={`relative flex flex-col rounded-2xl bg-neutral-800/70 border ${theme.cardBorder} overflow-hidden transition-all duration-300 hover:scale-[1.025] backdrop-blur-sm`}
      style={{ boxShadow: theme.glow }}
    >
      {/* Gradient top stripe */}
      <div className={`h-[3px] w-full bg-gradient-to-r ${theme.topBar} flex-shrink-0`} />

      {/* Most Popular badge */}
      {theme.popular && (
        <div className="absolute top-4 right-4 z-10">
          <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-500 text-white px-2.5 py-1 rounded-full shadow-lg">
            Most Popular
          </span>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">

        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">
              {bundle.toolsCount} Premium Tools
            </p>
            <h3 className="font-black text-lg text-white tracking-tight leading-none">
              {bundle.name}
            </h3>
          </div>
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 mt-0.5 ${theme.saveBg}`}>
            SAVE {bundle.savingPercent}%
          </span>
        </div>

        {/* Tool icons */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {bundle.products.map((tool) => {
            const t = TOOL_ICONS[tool] ?? { icon: 'Zap', bg: 'bg-neutral-700', color: 'text-neutral-400' };
            return (
              <div
                key={tool}
                title={tool}
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${t.bg} border border-white/5`}
              >
                <LucideIcon name={t.icon} size={16} className={t.color} />
              </div>
            );
          })}
        </div>

        {/* Features */}
        <ul className="space-y-2 mb-5 flex-1">
          {bundle.features.map((feat, i) => (
            <li key={i} className="flex items-start gap-2 text-[11px] text-neutral-400 leading-snug font-medium">
              <LucideIcon name="CheckCircle2" size={13} className={`${theme.check} mt-0.5 flex-shrink-0`} />
              {feat}
            </li>
          ))}
        </ul>

        {/* Price + CTA */}
        <div className="border-t border-white/5 pt-4 mt-auto">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">₹{bundle.price.toLocaleString('en-IN')}</span>
                <span className="text-xs text-neutral-500 font-bold">/mo</span>
              </div>
              <span className="text-xs text-neutral-600 line-through">
                ₹{bundle.originalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <button
              onClick={() => addBundleItem(bundle)}
              className={`flex items-center gap-1.5 py-2.5 px-4 text-white font-black text-xs rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer ${theme.btn}`}
            >
              <LucideIcon name="Sparkles" size={12} />
              Claim Bundle
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
