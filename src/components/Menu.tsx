import { useState } from 'react';
import { Search, ShoppingCart, Tag, Filter, Play, Check, Database, Sparkles, BookOpen } from 'lucide-react';
import { Product, CategoryType } from '../types';

interface MenuProps {
  products: Product[];
  onAddToCart: (product: Product, size: 'P' | 'M' | 'G') => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

const CATEGORY_TABS = [
  { id: 'all', label: 'Todos os Módulos', count: 'All' },
  { id: 'salgado', label: 'Salgados (v1.x)', count: 'Salgados' },
  { id: 'doce', label: 'Doces (Sweet)', count: 'Doces' },
  { id: 'bebida', label: 'Coolers & Café', count: 'Bebidas' },
  { id: 'acompanhamento', label: 'Porções / Voids', count: 'Locks' }
];

export default function Menu({
  products,
  onAddToCart,
  activeCategory,
  setActiveCategory
}: MenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, 'P' | 'M' | 'G'>>({});
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [addedAnimationIds, setAddedAnimationIds] = useState<Record<string, boolean>>({});

  const handleSizeChange = (productId: string, size: 'P' | 'M' | 'G') => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const handleAddToCartWithScale = (product: Product) => {
    const size = selectedSizes[product.id] || 'M';
    onAddToCart(product, size);
    
    // Quick flash animation trigger
    setAddedAnimationIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedAnimationIds(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter((p) => {
    // Category check
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
    
    // Search query check (search in name, description, ingredients, or tags)
    const normalizedQuery = searchQuery.toLowerCase();
    const matchesName = p.name.toLowerCase().includes(normalizedQuery);
    const matchesDesc = p.description.toLowerCase().includes(normalizedQuery);
    const matchesTags = p.tags.some(tag => tag.toLowerCase().includes(normalizedQuery));
    const matchesIng = p.originalIngredients.some(ing => ing.toLowerCase().includes(normalizedQuery));

    return matchesName || matchesDesc || matchesTags || matchesIng;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0; // default order based on index
  });

  return (
    <div className="space-y-8 font-sans">
      
      {/* Title block */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white uppercase tracking-tight flex items-center justify-center space-x-2">
          <Database className="w-5 h-5 text-amber-400 mr-1 animate-pulse" />
          <span>Pasta_Cardapio.db</span>
        </h2>
        <p className="text-zinc-500 text-xs sm:text-sm font-mono">
          Pesquise por variáveis e filtre os módulos em tempo de execução. Todos os pastéis são fritos sob demanda.
        </p>
      </div>

      {/* Control panel: Search / Sort / Tabs */}
      <div className="bg-white/[0.02] rounded-xl border border-white/10 p-4 sm:p-5 space-y-4 shadow-sm">
        
        {/* Row 1: Search & Sort inputs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          
          {/* Search box formatted like IDE debugger console */}
          <div className="md:col-span-8 relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="grep -rI 'queijo' ./cardapio..."
              className="w-full bg-[#121214] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm font-mono text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-[#FFC107] focus:ring-1 focus:ring-[#FFC107]/20"
            />
          </div>

          {/* Sorter */}
          <div className="md:col-span-4 relative flex items-center bg-[#121214] border border-white/10 rounded-lg px-3 py-1 font-mono text-xs">
            <Filter className="w-4 h-4 text-zinc-500 mr-2 shrink-0" />
            <span className="text-zinc-600 mr-2 font-bold uppercase select-none text-[10px]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-zinc-300 font-mono w-full outline-none focus:ring-0 cursor-pointer text-xs"
            >
              <option value="default" className="bg-[#121214] text-zinc-400">INDEX_BY_RECIPE</option>
              <option value="price-asc" className="bg-[#121214] text-zinc-400">PRICE_ASCENDING</option>
              <option value="price-desc" className="bg-[#121214] text-zinc-400">PRICE_DESCENDING</option>
            </select>
          </div>

        </div>

        {/* Row 2: Category Tabs */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-white/10">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded text-xs font-mono font-bold uppercase transition ${
                  isActive
                    ? 'bg-[#FFC107] text-[#121214] shadow'
                    : 'bg-white/[0.01] border border-white/10 text-zinc-400 hover:border-white/20 hover:text-white cursor-pointer'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

      </div>

      {/* Grid containing products */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white/[0.01] rounded-xl border border-white/10 border-dashed">
          <p className="text-zinc-500 font-mono text-sm">[404] Nenhum pastel ou cooler encontrado para a busca especificada.</p>
          <button
            onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
            className="mt-4 font-mono text-xs text-[#FFC107] hover:underline inline-block"
          >
            reboot_filters()
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => {
            const isAdded = addedAnimationIds[product.id];
            const activeSize = selectedSizes[product.id] || 'M';
            const basePrice = product.price;

            // Sizing scaling factors
            const sizeMultiplier = activeSize === 'P' ? 0.8 : activeSize === 'M' ? 1.0 : 1.4;
            const finalPrice = basePrice * sizeMultiplier;

            return (
              <div
                id={`product-card-${product.id}`}
                key={product.id}
                className="bg-white/[0.02] rounded-xl border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#FFC107]/40 group shadow-sm transition-all duration-300 relative hover:shadow-md"
              >
                
                {/* Visual Top Highlight border represent IDE categories */}
                <div className={`h-[2px] w-full bg-white/15 transition-colors group-hover:bg-[#FFC107]/60 ${
                  product.category === 'doce' ? 'group-hover:bg-pink-400/60' : 
                  product.category === 'bebida' ? 'group-hover:bg-sky-400/60' : ''
                }`} />

                {/* Body Content resembling code components */}
                <div className="p-5 flex-1 space-y-4">
                  
                  {/* Title & Version Row */}
                  <div className="space-y-1">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-mono text-zinc-500 font-medium tracking-wider">
                        {`#${product.id}`}
                      </span>
                      {product.version && (
                        <span className="text-[9px] bg-white/[0.03] border border-white/10 font-mono text-zinc-400 px-1.5 py-0.5 rounded">
                          {product.version}
                        </span>
                      )}
                    </div>
                    <h3 className="font-mono text-base font-bold text-white group-hover:text-[#FFC107] transition-colors duration-200">
                      {product.name}
                    </h3>
                  </div>

                  {/* Descriptions block with humanized and tech details */}
                  <p className="text-zinc-400 text-xs leading-relaxed font-sans min-h-[48px]">
                    {product.description}
                  </p>

                  {/* Original ingredients tags mapped as elements */}
                  <div className="pt-2">
                    <span className="text-[9px] font-mono text-zinc-600 block mb-1.5">const ingredients = [</span>
                    <div className="flex flex-wrap gap-1.5 pl-2.5">
                      {product.originalIngredients.map((ing) => (
                        <span key={ing} className="text-[10px] bg-black/30 font-mono text-zinc-500 border border-white/5 rounded px-1.5 py-0.5">
                          &apos;{ing}&apos;
                        </span>
                      ))}
                    </div>
                    <span className="text-[9px] font-mono text-zinc-600 block mt-1">];</span>
                  </div>

                  {/* Sizing switch selector (only if sizes apply for multiplier) */}
                  {product.sizeMultiplier && (
                    <div className="pt-2 font-mono space-y-1.5">
                      <span className="text-[10px] text-zinc-600 block">select_environment:</span>
                      <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                        {(['P', 'M', 'G'] as const).map((s) => {
                          const isSelectedSize = activeSize === s;
                          const label = s === 'P' ? 'P / Sandb.' : s === 'M' ? 'M / Staging' : 'G / Prod.';
                          return (
                            <button
                              key={s}
                              onClick={() => handleSizeChange(product.id, s)}
                              className={`py-1 text-[10px] font-bold rounded text-center transition-all cursor-pointer ${
                                isSelectedSize
                                  ? 'bg-[#FFC107] text-[#121214] shadow'
                                  : 'text-zinc-650 hover:text-zinc-400'
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Interactive comment tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {product.tags.map((tag) => (
                      <span key={tag} className="text-[9px] font-mono text-zinc-600 italic">
                        {tag}
                      </span>
                    ))}
                  </div>

                </div>

                {/* Footer price & purchase block */}
                <div className="p-4 bg-white/[0.01] border-t border-white/15 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider">compilation_cost:</span>
                    <span className="text-lg font-bold font-mono text-[#00FF66]">
                      R$ {finalPrice.toFixed(2)}
                    </span>
                  </div>

                  {isAdded ? (
                    <button
                      className="px-3.5 py-2.5 rounded text-xs font-mono font-extrabold uppercase bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 flex items-center justify-center space-x-1"
                      disabled
                    >
                      <Check className="w-3.5 h-3.5 animate-bounce" />
                      <span>DEPLOYED</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToCartWithScale(product)}
                      className="px-3.5 py-2.5 rounded text-xs font-mono font-extrabold uppercase bg-white/[0.02] border border-white/10 hover:border-[#FFC107]/40 text-zinc-400 hover:text-[#FFC107] cursor-pointer transition flex items-center justify-center space-x-1.5 group/btn"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>ADD_TO_CART</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
