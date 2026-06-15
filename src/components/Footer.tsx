import { Link } from 'react-router-dom';
import { LucideIcon } from './LucideIcon';
import { useSettingsStore } from '../store/useSettingsStore';

export function Footer() {
  const supportEmail = useSettingsStore((s) => s.support_email) || 'support@ainest.com';
  const whatsapp = useSettingsStore((s) => s.whatsapp_number);

  const shop = [
    { name: 'Home', path: '/' },
    { name: 'All Products', path: '/products' },
    { name: 'Cart', path: '/cart' },
  ];
  const account = [
    { name: 'Sign In', path: '/login' },
    { name: 'My Orders', path: '/login' },
    { name: 'Support', path: '/products' },
  ];

  return (
    <footer id="footer" className="bg-[#161e28] border-t border-line pt-16 pb-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <span className="text-white font-black text-sm tracking-tighter italic">AI</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-extrabold text-lg text-white tracking-tight">AI Nest</span>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.3em]">Premium</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              Your trusted destination for premium AI subscriptions. Instant delivery, secure payment, full warranty.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400">
              <LucideIcon name="ShieldCheck" size={14} className="text-brand-400" />
              SSL Secured · Trusted by 15K+
            </div>
          </div>

          {/* Shop */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">Shop</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              {shop.map((l) => (
                <li key={l.name}><Link to={l.path} className="text-slate-300 hover:text-brand-400 transition-colors">{l.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">Account</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              {account.map((l) => (
                <li key={l.name}><Link to={l.path} className="text-slate-300 hover:text-brand-400 transition-colors">{l.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">Get In Touch</h4>
            <a href={`mailto:${supportEmail}`} className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-brand-400 transition-colors">
              <LucideIcon name="Mail" size={15} className="text-brand-400" /> {supportEmail}
            </a>
            {whatsapp && (
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-brand-400 transition-colors">
                <LucideIcon name="MessageCircle" size={15} className="text-brand-400" /> WhatsApp: {whatsapp}
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-line pt-8 text-center">
          <p className="text-xs text-slate-500 font-medium">&copy; {new Date().getFullYear()} AI Nest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
