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
  const [priceRange, setPriceRange] = useState(50);

  // Fetch all products from API once
  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => {
        const mapped = (d.products ?? []).map((p: any) => ({ ...p, id: p._id ?? p.id }));
        setAllProducts(mapped);
      })
      .finally(() => setLoading(false));
  }, []);

  // Sync URL params → state
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

  const maxPrice = allProducts.length ? Math.ceil(Math.max(...allProducts.map(p => p.monthlyPrice))) : 50;

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
    <div className="w-full min-h-screen bg-[#F8F9FD] pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <span className="text-[10px] sm:text-xs font-extrabold text-violet-600 uppercase tracking-widest bg-violet-100/50 px-2.5 py-1 rounded-full">
            Complete Marketplace Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mt-3">
            Premium AI Tool Subscriptions
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 font-medium">
            Search, select, and get instant login credentials within minutes.
          </p>
        </div>

        {/* Category strip */}
        <div className="flex items-center overflow-x-auto gap-2 pb-4 mb-8 no-scrollbar border-b border-neutral-200/50">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-violet-600 border-violet-600 text-white shadow-md'
                  : 'bg-white border-neutral-100 text-neutral-600 hover:border-violet-200 hover:text-violet-600 shadow-sm'
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
            <div className="p-5 rounded-2xl bg-white border border-neutral-100 shadow-sm">
              <h3 className="text-xs font-extrabold text-neutral-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <LucideIcon name="Search" size={12} className="text-violet-500" />
                Search
              </h3>
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  placeholder="ChatGPT, Midjourney..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="bg-neutral-50 px-3 py-2 rounded-xl text-xs placeholder-neutral-400 border border-neutral-100 focus:bg-white focus:border-violet-400 focus:outline-none flex-1 font-medium"
                />
                <button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl px-3 flex items-center justify-center cursor-pointer">
                  <LucideIcon name="Search" size={12} />
                </button>
              </form>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-100 shadow-sm">
              <h3 className="text-xs font-extrabold text-neutral-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <LucideIcon name="ArrowDownUp" size={12} className="text-violet-500" />
                Sort By
              </h3>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full bg-neutral-50 px-3 py-2 rounded-xl text-xs border border-neutral-100 focus:outline-none focus:border-violet-400 font-bold text-neutral-700"
              >
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-100 shadow-sm">
              <h3 className="text-xs font-extrabold text-neutral-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                <LucideIcon name="SlidersHorizontal" size={12} className="text-violet-500" />
                Max Price
              </h3>
              <div className="flex items-center justify-between text-xs font-bold text-neutral-500 mt-2 mb-3">
                <span>₹1</span>
                <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded font-extrabold">₹{priceRange}</span>
              </div>
              <input
                type="range"
                min="1"
                max={maxPrice || 50}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
            </div>

            <div className="text-xs text-neutral-400 font-semibold px-1">
              {loading ? 'Loading…' : `${filtered.length} of ${allProducts.length} products`}
            </div>
          </div>

          {/* Products grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white border border-neutral-100 shadow-sm animate-pulse" style={{ height: 320 }} />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filtered.map((p) => (
                  <ProductCard key={p.id || p.slug} product={p} whatsappNumber={whatsappNumber} />
                ))}
              </div>
            ) : (
              <div className="p-16 rounded-3xl bg-white border border-neutral-100 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400">
                  <LucideIcon name="FolderOpen" size={28} />
                </div>
                <h3 className="font-extrabold text-base text-neutral-800">No products found</h3>
                <p className="text-xs text-neutral-400 max-w-sm font-semibold">
                  Try resetting your filters or search query.
                </p>
                <button
                  onClick={() => { handleCategorySelect('all'); setSearchVal(''); setPriceRange(50); }}
                  className="px-6 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-extrabold rounded-xl cursor-pointer"
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
