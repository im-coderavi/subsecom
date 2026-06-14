import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeroVisual } from '../components/HeroVisual';
import { ProductCard } from '../components/ProductCard';
import { BundleCard } from '../components/BundleCard';
import { LucideIcon } from '../components/LucideIcon';
import { motion } from 'motion/react';
import { useSettingsStore } from '../store/useSettingsStore';
import { Product, Bundle } from '../types';

export function Home() {
  const navigate = useNavigate();
  const whatsappNumber = useSettingsStore((s) => s.whatsapp_number);
  const [activeCategory, setActiveCategory] = useState('all');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [bundlesLoading, setBundlesLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => {
        const mapped = (d.products ?? []).map((p: any) => ({ ...p, id: p._id ?? p.id }));
        setAllProducts(mapped);
      })
      .finally(() => setProductsLoading(false));

    fetch('/api/bundles')
      .then((r) => r.json())
      .then((d) => setBundles((d.bundles ?? []).map((b: any) => ({ ...b, id: b._id ?? b.id }))))
      .finally(() => setBundlesLoading(false));
  }, []);

  const categories = [
    { id: 'all', label: 'All Products', icon: 'LayoutGrid' },
    { id: 'writing', label: 'AI Writing', icon: 'FileText' },
    { id: 'chat', label: 'AI Chat', icon: 'MessageSquare' },
    { id: 'code', label: 'AI Code', icon: 'Code2' },
    { id: 'image', label: 'AI Image', icon: 'Image' },
    { id: 'video', label: 'AI Video', icon: 'Video' },
    { id: 'voice', label: 'AI Voice', icon: 'Mic' },
    { id: 'productivity', label: 'Productivity', icon: 'CheckSquare' },
    { id: 'design', label: 'Design', icon: 'Palette' },
    { id: 'more', label: 'More', icon: 'Ellipsis' },
  ];

  const filteredProducts = (activeCategory === 'all' || activeCategory === 'more'
    ? allProducts.slice(0, 12)
    : allProducts.filter((p) => p.category === activeCategory));

  const trustBadges = [
    { label: 'Instant Delivery', sub: '2-5 Minutes', icon: 'Zap', color: 'text-amber-500 bg-amber-50' },
    { label: '100% Genuine', sub: 'Official Accounts', icon: 'ShieldCheck', color: 'text-emerald-500 bg-emerald-50' },
    { label: 'Secure & Safe', sub: 'SSL Encrypted', icon: 'Lock', color: 'text-blue-500 bg-blue-50' },
  ];

  const gridTrustBadges = [
    { title: 'Official Accounts', desc: '100% genuine & secure', icon: 'ShieldAlert' },
    { title: 'Instant Access', desc: 'Get access in 2-5 mins', icon: 'Clock' },
    { title: 'Secure Payments', desc: 'SSL encrypted payments', icon: 'Wallet' },
    { title: '7-Day Refund', desc: 'No questions asked', icon: 'Undo2' },
    { title: '24/7 Support', desc: 'We are always here', icon: 'Headphones' },
  ];

  const bottomClaimBadges = [
    { title: '100% Genuine', desc: 'Official & verified accounts', icon: 'BadgeCheck' },
    { title: 'Lowest Prices', desc: 'Best deals in the market', icon: 'Receipt' },
    { title: 'Instant Delivery', desc: 'Access within minutes', icon: 'Zap' },
    { title: 'Secure & Encrypted', desc: 'Your data is protected', icon: 'Lock' },
    { title: '24/7 Customer Support', desc: "We're here to help", icon: 'HelpCircle' },
  ];

  const happyUsers = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100'
  ];

  return (
    <div className="w-full relative bg-[#F8F9FD] overflow-x-hidden pt-20">
      
      {/* 1. Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16 sm:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Copy Panel */}
        <div className="lg:col-span-7 flex flex-col items-start text-left z-20">
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-100 text-violet-700 text-xs font-black tracking-wider uppercase mb-5"
          >
            <LucideIcon name="Zap" size={12} className="animate-pulse" />
            Your AI Powerhouse
            <LucideIcon name="Zap" size={12} className="animate-pulse" />
          </motion.div>

          {/* Epic Main Header */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-neutral-900 tracking-tight leading-[1.08] mb-6"
          >
            Subscribe. Access.<br />
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-500 bg-clip-text text-transparent">
              Create Without Limits.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-neutral-500 font-medium leading-relaxed max-w-xl mb-8"
          >
            Get premium access to 30+ top AI tools with verified accounts, instant delivery and affordable prices. Skip multiple expensive subscriptions.
          </motion.p>

          {/* Quick Core Benefits Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-2xl mb-10"
          >
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-neutral-100 shadow-sm hover:translate-y-[-2px] transition-all">
                <div className={`p-2 rounded-xl flex-shrink-0 ${badge.color}`}>
                  <LucideIcon name={badge.icon} size={15} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-extrabold text-neutral-800 leading-none">{badge.label}</span>
                  <span className="text-[10px] text-neutral-400 font-bold mt-1">{badge.sub}</span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Hero Buttons Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10"
          >
            <Link
              to="/products"
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2"
            >
              Explore All Products
              <LucideIcon name="ArrowRight" size={16} strokeWidth={2.5} />
            </Link>
            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi! I want to know more about AI Nest premium tools.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contact on WhatsApp
              </a>
            )}
          </motion.div>

          {/* High-Trust Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center gap-4 border-t border-neutral-200/50 pt-8"
          >
            <div className="flex -space-x-3">
              {happyUsers.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Happy customer ${i}`}
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm bg-neutral-200 hover:scale-105 hover:z-10 transition-transform cursor-pointer"
                />
              ))}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs sm:text-sm font-extrabold text-neutral-800 leading-tight">
                Trusted by 15,000+ Happy Users
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <LucideIcon key={i} name="Star" size={13} className="fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-black text-neutral-800">4.9/5 Rating</span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Hero Visual */}
        <motion.div
          className="lg:col-span-5 relative w-full flex items-end justify-center z-10 -mb-10"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <HeroVisual />
        </motion.div>

      </section>

      {/* 2. Auto-scrolling category marquee */}
      <section className="mb-16 overflow-hidden" id="categories-section">
        {/* Fade edges */}
        <div
          className="relative"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}
        >
          <style>{`
            @keyframes marquee-scroll {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .marquee-track {
              animation: marquee-scroll 22s linear infinite;
            }
            .marquee-wrapper:hover .marquee-track {
              animation-play-state: paused;
            }
          `}</style>

          <div className="marquee-wrapper flex py-3">
            {/* Two identical sets — second one creates the seamless loop */}
            {[0, 1].map((copy) => (
              <div key={copy} className="marquee-track flex items-center gap-3 flex-shrink-0">
                {categories.map((cat) => (
                  <button
                    key={`${copy}-${cat.id}`}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      if (cat.id !== 'all' && cat.id !== 'more') {
                        navigate(`/products?category=${cat.id}`);
                      } else if (cat.id === 'all') {
                        navigate(`/products`);
                      }
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border whitespace-nowrap cursor-pointer transition-all duration-200 bg-white border-neutral-100 text-neutral-600 hover:border-violet-300 hover:text-violet-600 shadow-sm hover:scale-105"
                  >
                    <LucideIcon name={cat.icon} size={14} />
                    {cat.label}
                  </button>
                ))}
                {/* Spacer between the two sets so the loop feels seamless */}
                <div className="w-3 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Popular AI Products Listing Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4 mb-24" id="popular-products">
        
        {/* Header Title block */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-1.5 text-xs font-black text-rose-500 uppercase tracking-widest leading-none">
              <LucideIcon name="Sparkles" size={12} />
              Top Picks
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight mt-1.5">
              Popular AI Products
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-semibold mt-0.5">
              Hand-picked top AI tools loved by creators, developers and businesses.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-violet-600 hover:text-violet-700 hover:underline hover:gap-1.5 transition-all"
          >
            View All Products
            <LucideIcon name="ArrowRight" size={14} strokeWidth={2.5} />
          </Link>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
          {productsLoading
            ? [...Array(8)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-white border border-neutral-100 shadow-sm animate-pulse" style={{ height: 320 }} />
              ))
            : filteredProducts.map((p) => (
                <ProductCard key={p.id || p.slug} product={p} whatsappNumber={whatsappNumber} />
              ))
          }
        </div>

        {/* Security badges row under products */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 py-8 border-y border-neutral-200/50">
          {gridTrustBadges.map((t) => (
            <div key={t.title} className="flex items-center gap-3 p-3">
              <div className="p-2 rounded-xl bg-violet-100 text-violet-600 flex-shrink-0">
                <LucideIcon name={t.icon} size={16} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-extrabold text-neutral-800 leading-tight">{t.title}</span>
                <span className="text-[10px] text-neutral-400 font-bold mt-0.5 leading-none">{t.desc}</span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 4. Infinite Value Bundles Pricing Grid */}
      <section className="relative bg-neutral-900 text-white py-20 px-4 sm:px-6 mb-24 overflow-hidden" id="how-it-works">
        {/* Background glow orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-10">
            <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full">
              ⚡ Bundle & Save Up to 40%
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-3 mb-2">
              More Tools, <span className="text-violet-400">Less Money</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium max-w-md mx-auto">
              Curated AI tool packs at a fraction of individual subscription costs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

            {/* Left promo banner */}
            <div className="lg:col-span-3 flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-violet-900/70 via-indigo-950/90 to-neutral-900 border border-violet-700/30 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-violet-500/15 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/20 flex items-center justify-center mb-4">
                  <LucideIcon name="Package2" size={18} className="text-violet-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-3 leading-tight">
                  Save More<br />with Bundles
                </h3>
                <p className="text-xs text-neutral-400 font-medium leading-relaxed mb-6">
                  Premium access to multiple AI tools in one unified pack. Save up to 40% vs individual subscriptions.
                </p>
                <div className="space-y-2 mb-6">
                  {['Instant access after purchase', 'Switch tools anytime', 'Single monthly billing'].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-[11px] text-neutral-300 font-semibold">
                      <LucideIcon name="Check" size={11} className="text-violet-400 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to="/products?tag=bundles"
                className="relative inline-flex items-center justify-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-500 text-white font-black text-xs rounded-xl shadow-lg transition-all w-full"
              >
                <LucideIcon name="Layers" size={13} />
                Explore Bundles
                <LucideIcon name="ArrowRight" size={13} strokeWidth={2.5} />
              </Link>
            </div>

            {/* Bundle cards */}
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-5">
              {bundlesLoading
                ? [...Array(3)].map((_, i) => <div key={i} className="rounded-2xl bg-neutral-800/40 border border-neutral-700/30 h-72 animate-pulse" />)
                : bundles.map((bundle) => (
                    <BundleCard key={bundle.id} bundle={bundle} />
                  ))
              }
            </div>

          </div>

        </div>
      </section>

      {/* 5. Statistics, Shields & Trust Segment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4 mb-24" id="trust-statistics">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left panel metrics */}
          <div className="lg:col-span-7 flex flex-col items-start gap-3">
            <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest leading-none">
              Why Choose AI Nest?
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight mt-1.5">
              Premium Service<br />You Can Trust
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-semibold leading-relaxed max-w-lg mb-6">
              We ensure the absolute best experience with fully continuous verified connections, automatic session caching, secure transactions, and instant dashboard credentials delivery.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-violet-500/10 hover:scale-101 active:scale-99 transition-all mb-8"
            >
              Learn More About Us
              <LucideIcon name="ChevronRight" size={14} strokeWidth={2.5} />
            </Link>

            {/* Stats Dashboard Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full pt-6 border-t border-neutral-200/50">
              
              <div>
                <h4 className="text-2xl font-black text-violet-600 tracking-tight">15,000+</h4>
                <p className="text-[10px] font-bold text-neutral-400 uppercase mt-1">Happy Users</p>
                <div className="flex -space-x-1.5 mt-2">
                  {happyUsers.map((src, i) => (
                    <img key={i} src={src} alt="avatar" className="w-5 h-5 rounded-full border border-white object-cover shadow-sm bg-neutral-200" />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-2xl font-black text-indigo-600 tracking-tight">30+</h4>
                <p className="text-[10px] font-bold text-neutral-400 uppercase mt-1">Premium AI Tools</p>
                <div className="flex gap-1 mt-2.5">
                  {['Sparkles', 'MessageSquareCode', 'Sparkle'].map((icon, i) => (
                    <div key={i} className="w-5 h-5 rounded bg-neutral-100 flex items-center justify-center text-neutral-500 border border-neutral-200/50">
                      <LucideIcon name={icon} size={10} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-2xl font-black text-rose-600 tracking-tight">99.9%</h4>
                <p className="text-[10px] font-bold text-neutral-400 uppercase mt-1">Uptime SLA</p>
                <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold mt-2">
                  <LucideIcon name="ShieldCheck" size={12} />
                  <span>Verified SLA</span>
                </div>
              </div>

              <div>
                <h4 className="text-2xl font-black text-neutral-800 tracking-tight">4.9/5</h4>
                <p className="text-[10px] font-bold text-neutral-400 uppercase mt-1">User Rating</p>
                <div className="flex text-amber-400 mt-2.5 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <LucideIcon key={i} name="Star" size={9} className="fill-amber-400" />
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Right panel graphic (Shield / Box layout representation) */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center select-none">
            <div className="absolute w-[260px] h-[260px] rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />
            <div className="relative p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200/60 shadow-xl max-w-sm flex flex-col gap-5">
              
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center shadow-md">
                <LucideIcon name="Lock" size={20} strokeWidth={2.5} />
              </div>

              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-neutral-800 tracking-tight flex items-center gap-2">
                  Double Shield Protection
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[9px] font-extrabold">Active</span>
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed mt-2">
                  Every subscription is isolated with localized session sandboxing. You do not store cookies locally nor share personal sensitive workspace details.
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50/80 border border-neutral-100 mt-1">
                <div className="flex items-center gap-2.5 text-[10px] font-bold text-neutral-500">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Credentials auto-renewing</span>
                </div>
                <LucideIcon name="RefreshCcw" size={11} className="text-neutral-400 animate-spin" />
              </div>

            </div>
          </div>

        </div>

      </section>

      {/* 6. Glowing Call-To-Action Banner section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
        <div className="p-8 sm:p-12 md:p-16 rounded-3xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-indigo-700 text-white text-center relative overflow-hidden shadow-2xl shadow-indigo-600/10">
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-violet-400/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-indigo-400/15 blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight relative z-10 leading-tight mb-4">
            Ready to Supercharge Your Productivity?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-100/90 font-medium max-w-xl mx-auto mb-8 relative z-10 leading-relaxed">
            Join thousands of creators, developers and businesses using premium AI tools. Get instantaneous dashboard credentials in 2-5 min and scale your limits!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link
              to="/products"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold rounded-2xl transition-all hover:scale-102"
            >
              Browse All Products
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-amber-400 hover:bg-amber-500 text-neutral-900 font-extrabold rounded-2xl shadow-lg shadow-amber-500/20 active:scale-98 transition-all"
            >
              Get Started Now
            </Link>
          </div>
        </div>

        {/* Floating trust badges underneath CTA */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 py-8 mt-5 border-b border-neutral-200/50">
          {bottomClaimBadges.map((badge) => (
            <div key={badge.title} className="flex items-center gap-2.5 p-2 justify-center">
              <LucideIcon name={badge.icon} size={15} className="text-violet-600" />
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-neutral-800 leading-tight">{badge.title}</span>
                <span className="text-[9px] text-neutral-400 font-bold mt-0.5 leading-none">{badge.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
