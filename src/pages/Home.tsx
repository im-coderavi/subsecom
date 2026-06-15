import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FeatureCarousel } from '../components/FeatureCarousel';
import { ProductCard } from '../components/ProductCard';
import { BundleCard } from '../components/BundleCard';
import { LucideIcon } from '../components/LucideIcon';
import { motion } from 'motion/react';
import { useSettingsStore } from '../store/useSettingsStore';
import { Product, Bundle } from '../types';

const CATEGORY_TILES = [
  { id: 'chat',         label: 'AI Chat',      icon: 'MessageSquare', grad: 'from-indigo-500 to-blue-600' },
  { id: 'code',         label: 'AI Code',      icon: 'Code2',         grad: 'from-slate-700 to-slate-900' },
  { id: 'image',        label: 'AI Image',     icon: 'Image',         grad: 'from-rose-500 to-pink-600' },
  { id: 'video',        label: 'AI Video',     icon: 'Video',         grad: 'from-orange-500 to-red-600' },
  { id: 'voice',        label: 'AI Voice',     icon: 'Mic',           grad: 'from-amber-500 to-orange-600' },
  { id: 'productivity', label: 'Productivity', icon: 'CheckSquare',   grad: 'from-emerald-500 to-teal-600' },
  { id: 'design',       label: 'Design',       icon: 'Palette',       grad: 'from-violet-500 to-fuchsia-600' },
  { id: 'writing',      label: 'AI Writing',   icon: 'FileText',      grad: 'from-sky-500 to-cyan-600' },
];

const VALUE_PROPS = [
  { title: 'Instant Delivery', desc: 'Credentials in 2–5 minutes', icon: 'Zap' },
  { title: 'Full Warranty',    desc: '7-day no-questions refund',  icon: 'ShieldCheck' },
  { title: '24/7 Support',     desc: 'Always here to help you',    icon: 'Headphones' },
  { title: 'Verified Accounts',desc: '100% genuine & official',    icon: 'BadgeCheck' },
];

const FAQS = [
  { q: 'How fast will I get my subscription?', a: 'After your payment is confirmed, your account credentials are delivered to your dashboard within 2–5 minutes, fully automated and instant.' },
  { q: 'Are these accounts genuine and safe?', a: 'Yes. Every subscription is a 100% genuine, official account with full premium features. We use bank-grade 256-bit SSL encryption on all transactions.' },
  { q: 'What if something stops working?', a: 'All purchases come with a full warranty. If anything stops working within your plan, we replace it free — or give you a no-questions-asked refund within 7 days.' },
  { q: 'Which payment methods do you accept?', a: 'We accept UPI, cards, and crypto. You can also pay directly over WhatsApp and get instant manual delivery from our team.' },
  { q: 'Can I buy multiple tools together?', a: 'Absolutely. Check out our Bundles to get multiple premium AI tools in one pack and save up to 40% versus individual subscriptions.' },
];

const HAPPY_USERS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
];

export function Home() {
  const navigate = useNavigate();
  const whatsappNumber = useSettingsStore((s) => s.whatsapp_number);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [bundlesLoading, setBundlesLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => setAllProducts((d.products ?? []).map((p: any) => ({ ...p, id: p._id ?? p.id }))))
      .finally(() => setProductsLoading(false));

    fetch('/api/bundles')
      .then((r) => r.json())
      .then((d) => setBundles((d.bundles ?? []).map((b: any) => ({ ...b, id: b._id ?? b.id }))))
      .finally(() => setBundlesLoading(false));
  }, []);

  const popular = allProducts.slice(0, 8);
  const trending = allProducts.slice(0, 4);

  return (
    <div className="w-full relative overflow-x-hidden">

      {/* ───────────── 1. HERO ───────────── */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* soft background blobs */}
        <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full bg-brand-200/30 blur-[120px] pointer-events-none -z-10" />
        <div className="absolute -bottom-10 left-0 w-80 h-80 rounded-full bg-indigo-200/30 blur-[120px] pointer-events-none -z-10" />

        {/* Left copy */}
        <div className="lg:col-span-6 flex flex-col items-start text-left z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-black tracking-wider uppercase mb-5 border border-brand-100"
          >
            <LucideIcon name="Zap" size={12} className="animate-pulse" />
            Trusted by 15,000+ Creators
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.06] mb-5"
          >
            Premium AI Subscriptions.{' '}
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Instant Delivery.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-slate-500 font-medium leading-relaxed max-w-xl mb-7"
          >
            Get verified access to 30+ top AI tools at a fraction of the price. Official accounts, delivered to your dashboard in minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-8"
          >
            <Link to="/products" className="px-7 py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-extrabold text-sm rounded-xl shadow-xl shadow-brand-500/25 hover:scale-[1.02] active:scale-[0.98] transition-transform text-center flex items-center justify-center gap-2">
              Explore All Products
              <LucideIcon name="ArrowRight" size={16} strokeWidth={2.5} />
            </Link>
            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi! I want to know more about AI Nest premium tools.')}`}
                target="_blank" rel="noopener noreferrer"
                className="px-7 py-3.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98] transition-transform text-center flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white flex-shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center gap-4"
          >
            <div className="flex -space-x-3">
              {HAPPY_USERS.map((src, i) => (
                <img key={i} src={src} alt="" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm bg-slate-200" />
              ))}
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <LucideIcon key={i} name="Star" size={13} className="fill-amber-400" />)}
                <span className="text-xs font-black text-slate-800 ml-1">4.9/5</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">from 2,400+ verified reviews</span>
            </div>
          </motion.div>
        </div>

        {/* Right — numbered feature carousel */}
        <motion.div
          className="lg:col-span-6 w-full z-10"
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
        >
          {productsLoading
            ? <div className="w-full h-[360px] rounded-3xl bg-white border border-slate-200/70 shadow-sm animate-pulse" />
            : <FeatureCarousel products={popular} whatsappNumber={whatsappNumber} />}
        </motion.div>
      </section>

      {/* ───────────── 2. CATEGORY MARQUEE ───────────── */}
      <section className="mb-16 overflow-hidden">
        <div className="mask-fade-edges">
          <div className="marquee-wrapper flex py-2">
            {[0, 1].map((copy) => (
              <div key={copy} className="marquee-track flex items-center gap-3 flex-shrink-0 pr-3">
                {CATEGORY_TILES.map((cat) => (
                  <button
                    key={`${copy}-${cat.id}`}
                    onClick={() => navigate(`/products?category=${cat.id}`)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border whitespace-nowrap cursor-pointer transition-all bg-white border-slate-200/70 text-slate-600 hover:border-brand-300 hover:text-brand-600 shadow-sm hover:scale-105"
                  >
                    <LucideIcon name={cat.icon} size={15} />
                    {cat.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── 3. POPULAR / TRENDING PRODUCTS ───────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="flex flex-col items-start gap-1.5">
            <div className="flex items-center gap-1.5 text-xs font-black text-brand-600 uppercase tracking-widest">
              <LucideIcon name="Flame" size={13} /> Most Ordered · Last 7 Days
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Trending AI Tools</h2>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold">Hand-picked premium tools loved by creators, devs & businesses.</p>
          </div>
          <Link to="/products" className="inline-flex items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-700 hover:gap-1.5 transition-all">
            View All <LucideIcon name="ArrowRight" size={15} strokeWidth={2.5} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {productsLoading
            ? [...Array(8)].map((_, i) => <div key={i} className="rounded-2xl bg-white border border-slate-200/70 shadow-sm animate-pulse" style={{ height: 340 }} />)
            : popular.map((p) => <ProductCard key={p.id || p.slug} product={p} whatsappNumber={whatsappNumber} />)}
        </div>
      </section>

      {/* ───────────── 4. SHOP BY CATEGORY ───────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
        <div className="text-center mb-10">
          <span className="text-xs font-black text-brand-600 uppercase tracking-widest">Browse</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">Shop by Category</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">Find the perfect AI tool for every workflow.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {CATEGORY_TILES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/products?category=${cat.id}`)}
              className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/70 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-5 text-left"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.grad} flex items-center justify-center text-white shadow-md mb-3 group-hover:scale-110 transition-transform`}>
                <LucideIcon name={cat.icon} size={22} strokeWidth={2.2} />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 mb-0.5">{cat.label}</h3>
              <p className="text-[11px] font-semibold text-slate-400">Explore tools</p>
              <LucideIcon name="ArrowUpRight" size={16} className="absolute top-4 right-4 text-slate-300 group-hover:text-brand-500 transition-colors" />
            </button>
          ))}
        </div>
      </section>

      {/* ───────────── 5. BUNDLES (dark band) ───────────── */}
      <section className="relative bg-ink text-white py-16 sm:py-20 px-4 sm:px-6 mb-20 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-brand-600/15 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[10px] font-black text-brand-300 uppercase tracking-widest bg-brand-500/10 border border-brand-500/20 px-3 py-1 rounded-full">
              ⚡ Bundle & Save up to 40%
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mt-3 mb-2">More Tools, <span className="text-brand-300">Less Money</span></h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-md mx-auto">Curated AI tool packs at a fraction of individual subscription costs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {bundlesLoading
              ? [...Array(3)].map((_, i) => <div key={i} className="rounded-2xl bg-white/5 border border-white/10 h-72 animate-pulse" />)
              : bundles.map((bundle) => <BundleCard key={bundle.id} bundle={bundle} />)}
          </div>
        </div>
      </section>

      {/* ───────────── 6. VALUE PROPS / SECURITY ───────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {VALUE_PROPS.map((v) => (
            <div key={v.title} className="flex flex-col items-start gap-3 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/70 shadow-sm hover:shadow-lg transition-all">
              <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <LucideIcon name={v.icon} size={20} strokeWidth={2.3} />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">{v.title}</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* security strip */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5 px-6 rounded-2xl bg-white border border-slate-200/70 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <LucideIcon name="Lock" size={15} className="text-emerald-500" /> 256-bit SSL Encryption
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <LucideIcon name="ShieldCheck" size={15} className="text-emerald-500" /> Bank-grade Security
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <LucideIcon name="BadgeCheck" size={15} className="text-emerald-500" /> Verified Official Accounts
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <LucideIcon name="Clock" size={15} className="text-emerald-500" /> 2–5 Min Delivery
          </div>
        </div>
      </section>

      {/* ───────────── 7. FAQ ───────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 mb-20">
        <div className="text-center mb-8">
          <span className="text-xs font-black text-brand-600 uppercase tracking-widest">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-2xl bg-white border border-slate-200/70 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-extrabold text-sm text-slate-900">{faq.q}</span>
                <LucideIcon name="ChevronDown" size={18} className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180 text-brand-600' : ''}`} />
              </button>
              {openFaq === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  className="px-5 pb-4 text-sm text-slate-500 font-medium leading-relaxed"
                >
                  {faq.a}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── 8. CTA BANNER ───────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
        <div className="p-8 sm:p-12 md:p-16 rounded-3xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-blue-700 text-white text-center relative overflow-hidden shadow-2xl shadow-brand-600/20">
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-indigo-300/15 blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight relative z-10 leading-tight mb-4">Ready to Supercharge Your Workflow?</h2>
          <p className="text-xs sm:text-sm text-white/90 font-medium max-w-xl mx-auto mb-8 relative z-10 leading-relaxed">
            Join 15,000+ creators and businesses using premium AI tools. Get instant dashboard credentials in 2–5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link to="/products" className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold rounded-2xl transition-all hover:scale-[1.02]">Browse All Products</Link>
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 font-extrabold rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-transform">Get Started Now</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
