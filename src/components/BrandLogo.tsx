import { useSettingsStore } from '../store/useSettingsStore';

interface BrandLogoProps {
  /** 'md' = navbar header / footer, 'sm' = mobile drawer */
  size?: 'sm' | 'md';
  showTagline?: boolean;
}

export function BrandLogo({ size = 'md', showTagline = true }: BrandLogoProps) {
  const name = useSettingsStore((s) => s.brand_name) || 'AI Nest';
  const tagline = useSettingsStore((s) => s.brand_tagline) || 'Premium';
  const logo = useSettingsStore((s) => s.brand_logo);

  const initials = name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase() || 'AI';

  const badgeSize = size === 'sm' ? 'w-9 h-9' : 'w-10 h-10';
  const nameSize = size === 'sm' ? 'text-sm' : 'text-lg';

  return (
    <div className="flex items-center gap-2.5">
      {logo ? (
        <img
          src={logo}
          alt={name}
          className={`${badgeSize} rounded-full object-cover shadow-lg shadow-brand-500/30 flex-shrink-0`}
        />
      ) : (
        <div className={`${badgeSize} rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/30 flex-shrink-0`}>
          <span className="text-white font-black text-xs tracking-tighter italic">{initials}</span>
        </div>
      )}
      <div className="flex flex-col leading-none">
        <span className={`font-extrabold ${nameSize} text-white tracking-tight`}>{name}</span>
        {showTagline && tagline && (
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.3em]">{tagline}</span>
        )}
      </div>
    </div>
  );
}
