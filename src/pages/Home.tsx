import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FeatureCarousel } from '../components/FeatureCarousel';
import { ProductCard } from '../components/ProductCard';
import { LucideIcon } from '../components/LucideIcon';
import { motion } from 'motion/react';
import { useSettingsStore } from '../store/useSettingsStore';
import { Product } from '../types';

const STATS = [
  { value: '99.9%', label: 'Success' },
  { value: '5 Min', label: 'Delivery' },
  { value: '24/7',  label: 'Support' },
];

const CATEGORY_TILES = [
  { id: 'chat',         label: 'AI Chat',      sub: 'ChatGPT, Claude',   icon: 'MessageSquare' },
  { id: 'code',         label: 'AI Code',      sub: 'Cursor, Copilot',   icon: 'Code2' },
  { id: 'image',        label: 'AI Image',     sub: 'Midjourney, DALL·E',icon: 'Image' },
  { id: 'video',        label: 'AI Video',     sub: 'Runway, Sora',      icon: 'Video' },
  { id: 'voice',        label: 'AI Voice',     sub: 'ElevenLabs, Suno',  icon: 'Mic' },
  { id: 'productivity', label: 'Productivity', sub: 'Notion, Office',    icon: 'CheckSquare' },
];

const VALUE_PROPS = [
  { title: 'Instant Delivery', desc: 'Credentials in your dashboard within minutes of payment.', icon: 'Zap' },
  { title: 'Full Warranty',    desc: 'Replacement guaranteed for the entire duration of your plan.', icon: 'ShieldCheck' },
  { title: '24/7 Support',     desc: 'Real humans on WhatsApp, ready when you need help.', icon: 'Headphones' },
  { title: 'Verified Accounts',desc: 'Every account tested and verified before delivery.', icon: 'BadgeCheck' },
];

const SECURITY_POINTS = [
  '256-bit SSL encryption on every checkout',
  'PCI-DSS compliant payment gateways',
  'Zero card data stored on our servers',
];

const FAQS = [
  { q: 'How do I receive my product after payment?', a: 'Once your payment is confirmed, your account credentials are delivered straight to your dashboard within 2–5 minutes — fully automated and instant.' },
  { q: 'Is the payment process secure?', a: 'Yes. Every transaction is protected with 256-bit SSL encryption through PCI-DSS compliant gateways. We never store your card details.' },
  { q: 'What if my account stops working?', a: 'Every purchase comes with a full warranty for your entire plan duration. If anything stops working, we replace it free of charge.' },
  { q: 'Do you offer refunds?', a: 'Absolutely — we offer a 7-day, no-questions-asked refund if you are not satisfied with your subscription.' },
  { q: 'Are these accounts genuine and safe to use?', a: '100%. Every subscription is a genuine, official account with full premium features, tested and verified before it reaches you.' },
];

const PAY_METHODS = [
  { kind: 'visa' }, { kind: 'mc' }, { kind: 'upi' },
  { kind: 'rupay' }, { kind: 'crypto' }, { kind: 'ssl' },
];

export function Home() {
  const whatsappNumber = useSettingsStore((s) => s.whatsapp_number);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => setAllProducts((d.products ?? []).map((p: any) => ({ ...p, id: p._id ?? p.id }))))
      .finally(() => setLoading(false));
  }, []);

  const featured = allProducts.slice(0, 8);
  const trending = allProducts.slice(0, 8);

  return (
    <div className="w-full relative overflow-x-hidden">

      {/* ───────── HERO ───────── */}
      <section className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-5 sm:pt-10 pb-4">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-brand-600/10 blur-[140px] pointer-events-none -z-10" />
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-line text-xs font-bold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Trusted by 15,000+ creators globally
          </span>
        </div>
        {loading
          ? <div className="w-full h-[420px] rounded-3xl bg-surface border border-line animate-pulse" />
          : <FeatureCarousel products={featured} whatsappNumber={whatsappNumber} />}
      </section>

      {/* ───────── STATS ───────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-3 divide-x divide-line">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">{s.value}</span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-2">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── FEATURED PRODUCTS ───────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
        <div className="flex flex-col items-center text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-line text-xs font-bold text-brand-400 mb-4">
            <LucideIcon name="Star" size={12} className="fill-brand-400" /> Hand-picked
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">Featured Products</h2>
          <p className="text-sm text-slate-400 font-medium mt-2 mb-6">Our most loved digital subscriptions</p>
          <Link to="/products" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-line text-white font-bold text-sm hover:border-brand-500/50 hover:bg-surface-3 transition-all">
            View all <LucideIcon name="ArrowRight" size={15} strokeWidth={2.5} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? [...Array(8)].map((_, i) => <div key={i} className="rounded-2xl bg-surface border border-line animate-pulse" style={{ height: 380 }} />)
            : featured.map((p) => <ProductCard key={p.id || p.slug} product={p} whatsappNumber={whatsappNumber} />)}
        </div>
      </section>

      {/* ───────── WHAT'S HOT (TRENDING) ───────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
        <div className="flex flex-col items-center text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-line text-xs font-bold text-orange-400 mb-4">
            <LucideIcon name="Flame" size={12} /> Trending now
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">What's Hot</h2>
          <p className="text-sm text-slate-400 font-medium mt-2 mb-6">Most ordered in the last 7 days</p>
          <Link to="/products" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-line text-white font-bold text-sm hover:border-brand-500/50 hover:bg-surface-3 transition-all">
            View all trending products <LucideIcon name="ArrowRight" size={15} strokeWidth={2.5} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? [...Array(4)].map((_, i) => <div key={i} className="rounded-2xl bg-surface border border-line animate-pulse" style={{ height: 380 }} />)
            : trending.slice(0, 4).map((p) => <ProductCard key={`t-${p.id || p.slug}`} product={p} whatsappNumber={whatsappNumber} />)}
        </div>
      </section>

      {/* ───────── SHOP BY CATEGORY ───────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">Shop by Category</h2>
          <p className="text-sm text-slate-400 font-medium mt-2">Find what you need, fast</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORY_TILES.map((cat) => (
            <Link key={cat.id} to={`/products?category=${cat.id}`}
              className="group flex flex-col items-center text-center p-6 rounded-2xl bg-surface border border-line hover:border-brand-500/40 hover:bg-surface-3 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 mb-4 group-hover:scale-110 transition-transform">
                <LucideIcon name={cat.icon} size={24} strokeWidth={2.2} />
              </div>
              <h3 className="font-extrabold text-sm text-white mb-1">{cat.label}</h3>
              <p className="text-[11px] font-medium text-slate-500">{cat.sub}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ───────── SECURE PAYMENT ───────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
        <div className="rounded-3xl bg-gradient-to-br from-surface to-surface-2 border border-line p-7 sm:p-10 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-xs font-extrabold text-brand-400 uppercase tracking-wider mb-5">
              <LucideIcon name="Lock" size={12} /> Bank-grade Security
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Secure payment,<br /><span className="text-brand-400">always</span>
            </h2>
            <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-md mb-7">
              All transactions are protected with 256-bit SSL encryption. We never store your payment details. Pay with the method you trust most.
            </p>
            <div className="space-y-3">
              {SECURITY_POINTS.map((pt) => (
                <div key={pt} className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                  <span className="w-7 h-7 rounded-lg bg-brand-500/15 text-brand-400 flex items-center justify-center flex-shrink-0">
                    <LucideIcon name="Check" size={14} strokeWidth={3} />
                  </span>
                  {pt}
                </div>
              ))}
            </div>
          </div>

          {/* payment cards grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {PAY_METHODS.map((m, i) => <PayCard key={i} kind={m.kind} />)}
          </div>
        </div>
      </section>

      {/* ───────── BUILT FOR QUALITY (VALUE PROPS) ───────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-line text-xs font-bold text-slate-300 mb-4">
            Why AI Nest
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Built for people who <span className="text-brand-400">demand quality</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {VALUE_PROPS.map((v) => (
            <div key={v.title} className="flex flex-col items-start gap-4 p-6 rounded-2xl bg-surface border border-line hover:border-brand-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
                <LucideIcon name={v.icon} size={22} strokeWidth={2.3} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white mb-1.5">{v.title}</h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-line text-xs font-bold text-brand-400 mb-4">
              <LucideIcon name="HelpCircle" size={12} /> Frequently Asked
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Questions,<br /><span className="text-brand-400">answered</span>
            </h2>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Everything you need to know about ordering, delivery, and our warranty. Still curious? Reach us on WhatsApp anytime.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-2xl bg-surface border border-line overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
                  <span className="font-extrabold text-sm sm:text-base text-white">{faq.q}</span>
                  <LucideIcon name="ChevronDown" size={18} className={`text-slate-500 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180 text-brand-400' : ''}`} />
                </button>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    className="px-5 pb-4 text-sm text-slate-400 font-medium leading-relaxed">
                    {faq.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

/* ── Payment method card (white tile) ── */
function PayCard({ kind }: { kind: string }) {
  const base = 'aspect-[4/3] rounded-2xl flex items-center justify-center shadow-lg';
  if (kind === 'ssl') {
    return (
      <div className={`${base} bg-gradient-to-br from-brand-500 to-brand-700 text-white flex-col gap-1`}>
        <LucideIcon name="Lock" size={20} />
        <span className="text-[9px] font-black uppercase tracking-wider">SSL Secured</span>
      </div>
    );
  }
  const label: Record<string, JSX.Element> = {
    visa:  <span className="text-[#1a1f71] font-black italic text-xl">VISA</span>,
    mc:    <span className="flex items-center"><span className="w-5 h-5 rounded-full bg-[#eb001b] -mr-2" /><span className="w-5 h-5 rounded-full bg-[#f79e1b]/90" /></span>,
    upi:   <span className="text-[#2e90fa] font-black text-lg">UPI</span>,
    rupay: <span className="font-black text-lg"><span className="text-[#097969]">Ru</span><span className="text-[#cf2e2e]">Pay</span></span>,
    crypto:<span className="text-[#f0b90b] font-black text-2xl">₿</span>,
  };
  return <div className={`${base} bg-white`}>{label[kind]}</div>;
}
