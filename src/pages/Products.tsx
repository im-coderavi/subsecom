import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { LucideIcon } from '../components/LucideIcon';
import { useSettingsStore } from '../store/useSettingsStore';
import { Product } from '../types';

const CATEGORIES = [
  { id: 'all',          label: 'All',          icon: 'LayoutGrid' },
  { id: 'chat',         label: 'AI Chat',      icon: 'MessageSquare' },
  { id: 'code',         label: 'AI Code',      icon: 'Code2' },
  { id: 'image',        label: 'AI Image',     icon: 'Image' },
  { id: 'video',        label: 'AI Video',     icon: 'Video' },
  { id: 'voice',        label: 'AI Voice',     icon: 'Mic' },
  { id: 'productivity', label: 'Productivity', icon: 'CheckSquare' },
  { id: 'design',       label: 'Design',       icon: 'Palette' },
  { id: 'writing',      label: 'Writing',      icon: 'FileText' },
];

export function Products() {
  const whatsappNumber = useSettingsStore((s) => s.whatsapp_number);
  const [searchParams, setSearchParams] = useSearchParams();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [searchVal, setSearchVal] = useState(searchParams.get('search') || '');
  const [sortOption, setSortOption] = useState('popular');
  const [priceRange, setPriceRange] = useState(100000);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => setAllProducts((d.products ?? []).map((p: any) => ({ ...p, id: p._id ?? p.id }))))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setActiveCategory(searchParams.get('category') || 'all');
    setSearchVal(searchParams.get('search') || '');
  }, [searchParams]);

  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
    const p = new URLSearchParams(searchParams);
    id === 'all' ? p.delete('category') : p.set('category', id);
    setSearchParams(p);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams(searchParams);
    searchVal.trim() ? p.set('search', searchVal.trim()) : p.delete('search');
    setSearchParams(p);
  };

  const maxPrice = allProducts.length ? Math.ceil(Math.max(...allProducts.map(p => p.monthlyPrice))) : 100000;

  const filtered = allProducts
    .filter((p) => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory;
      const q = searchVal.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q);
      const matchPrice = p.monthlyPrice <= priceRange;
      return matchCat && matchSearch && matchPrice;
    })
    .sort((a, b) => {
      if (sortOption === 'price-asc')  return a.monthlyPrice - b.monthlyPrice;
      if (sortOption === 'price-desc') return b.monthlyPrice - a.monthlyPrice;
      if (sortOption === 'rating')     return b.rating - a.rating;
      return b.ratingCount - a.ratingCount;
    });

  return (
    <div className="w-full min-h-screen pt-10 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <span className="text-[10px] sm:text-xs font-extrabold text-brand-400 uppercase tracking-widest bg-brand-500/10 border border-brand-500/20 px-3 py-1 rounded-full">
            Complete Marketplace Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mt-3">Premium AI Subscriptions</h1>
          <p className="text-sm text-slate-400 mt-2 font-medium">Search, select, and get instant login credentials within minutes.</p>
        </div>

        {/* Category strip */}
        <div className="flex items-center overflow-x-auto gap-2 pb-4 mb-8 no-scrollbar border-b border-line">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-500/25'
                  : 'bg-surface border-line text-slate-300 hover:border-brand-500/40 hover:text-brand-400'
              }`}
            >
              <LucideIcon name={cat.icon} size={13} />
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar filters */}
          <div className="space-y-5">
            <div className="p-5 rounded-2xl bg-surface border border-line">
              <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <LucideIcon name="Search" size={12} className="text-brand-400" /> Search
              </h3>
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text" placeholder="ChatGPT, Midjourney..." value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="bg-surface-2 px-3 py-2 rounded-xl text-xs placeholder-slate-500 border border-line focus:border-brand-500 focus:outline-none flex-1 font-medium text-white"
                />
                <button type="submit" className="bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl px-3 flex items-center justify-center cursor-pointer">
                  <LucideIcon name="Search" size={12} />
                </button>
              </form>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-line">
              <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <LucideIcon name="ArrowDownUp" size={12} className="text-brand-400" /> Sort By
              </h3>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full bg-surface-2 px-3 py-2 rounded-xl text-xs border border-line focus:outline-none focus:border-brand-500 font-bold text-slate-200"
              >
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-line">
              <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <LucideIcon name="SlidersHorizontal" size={12} className="text-brand-400" /> Max Price
              </h3>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mt-2 mb-3">
                <span>₹1</span>
                <span className="text-brand-300 bg-brand-500/10 px-2 py-0.5 rounded font-extrabold">₹{priceRange.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range" min="1" max={maxPrice || 100000} value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            <div className="text-xs text-slate-500 font-semibold px-1">
              {loading ? 'Loading…' : `${filtered.length} of ${allProducts.length} products`}
            </div>
          </div>

          {/* Products grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => <div key={i} className="rounded-2xl bg-surface border border-line animate-pulse" style={{ height: 420 }} />)}
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((p) => <ProductCard key={p.id || p.slug} product={p} whatsappNumber={whatsappNumber} />)}
              </div>
            ) : (
              <div className="p-16 rounded-3xl bg-surface border border-line text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-surface-3 flex items-center justify-center text-slate-500">
                  <LucideIcon name="FolderOpen" size={28} />
                </div>
                <h3 className="font-extrabold text-base text-white">No products found</h3>
                <p className="text-xs text-slate-400 max-w-sm font-semibold">Try resetting your filters or search query.</p>
                <button
                  onClick={() => { handleCategorySelect('all'); setSearchVal(''); setPriceRange(100000); }}
                  className="px-6 py-2 bg-surface-3 hover:bg-surface-2 border border-line text-slate-200 text-xs font-extrabold rounded-xl cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
