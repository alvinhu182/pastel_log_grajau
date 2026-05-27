import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Menu from './components/Menu';
import CustomPastelBuilder from './components/CustomPastelBuilder';
import Cart from './components/Cart';
import CommitLogs from './components/CommitLogs';
import { MENU_PRODUCTS, MOCK_COMMIT_LOGS } from './data';
import { Product, OrderItem, CommitLog } from './types';
import { ShoppingBag, MapPin, Clock, ShieldAlert, Wifi, Code2, Globe2 } from 'lucide-react';

export default function App() {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOpenStatus, setIsOpenStatus] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [commitLogs, setCommitLogs] = useState<CommitLog[]>(MOCK_COMMIT_LOGS);

  // Load comments with local storage fallback and API synchronization
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch('/api/comments');
        if (response.ok) {
          const data = await response.json();
          setCommitLogs(data);
          localStorage.setItem('pastel_comments', JSON.stringify(data));
        } else {
          throw new Error('API server did not respond successfully');
        }
      } catch (err) {
        console.warn('Backend is offline or unreachable, restoring comments from local browser storage cache:', err);
        const local = localStorage.getItem('pastel_comments');
        if (local) {
          try {
            setCommitLogs(JSON.parse(local));
          } catch (e) {
            console.error('Failed to parse cached local comments:', e);
          }
        }
      }
    };
    fetchComments();
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product, size: 'P' | 'M' | 'G') => {
    setCart((prev) => {
      // Find if item with same ID and same SIZE is already in state
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size && !item.customIngredients
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        const uniqueId = `${product.id}-${size}-${Date.now()}`;
        return [
          ...prev,
          {
            id: uniqueId,
            product,
            quantity: 1,
            selectedSize: size,
          },
        ];
      }
    });
  };

  const handleAddCustomToCart = (customItem: {
    name: string;
    description: string;
    price: number;
    size: 'P' | 'M' | 'G';
    ingredients: string[];
  }) => {
    // Treat as synthetic virtual product
    const mockProduct: Product = {
      id: `custom-${Date.now()}`,
      name: customItem.name,
      version: 'v4.0.0-custom',
      category: 'salgado',
      description: customItem.description,
      price: customItem.price / (customItem.size === 'P' ? 0.8 : customItem.size === 'M' ? 1.0 : 1.4), // restore base
      tags: ['// self-compiled', '// reactive'],
      originalIngredients: customItem.ingredients
    };

    setCart((prev) => [
      ...prev,
      {
        id: `custom-item-${Date.now()}`,
        product: mockProduct,
        quantity: 1,
        selectedSize: customItem.size,
        customIngredients: customItem.ingredients.map(ing => ing.replace('Base ', ''))
      }
    ]);

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, amount: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + amount;
            return { ...item, quantity: Math.max(0, nextQty) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleAddCommit = async (author: string, message: string) => {
    const randomHash = Math.random().toString(16).substring(2, 9);
    const currentTimeStr = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const localNewLog: CommitLog = {
      id: `log-${Date.now()}`,
      author: author || 'anonymous_dev',
      message: message,
      timestamp: `Hoje às ${currentTimeStr}`,
      likes: Math.floor(Math.random() * 5) + 1,
      hash: randomHash
    };

    // Optimistically load immediately in UI and localStorage to prevent lags
    setCommitLogs(prev => [localNewLog, ...prev]);
    const cached = localStorage.getItem('pastel_comments');
    let cachedList: CommitLog[] = [];
    if (cached) {
      try {
        cachedList = JSON.parse(cached);
      } catch (e) {}
    }
    cachedList.unshift(localNewLog);
    localStorage.setItem('pastel_comments', JSON.stringify(cachedList));

    // Persist to server API
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ author, message }),
      });

      if (response.ok) {
        const persistedLog = await response.json();
        // Replace dynamic optimistic item with actual server-persisted item (with final hash and details)
        setCommitLogs(prev => prev.map(log => log.id === localNewLog.id ? persistedLog : log));
        
        // Pull full fresh sequence to ensure proper timeline structure
        const freshResponse = await fetch('/api/comments');
        if (freshResponse.ok) {
          const freshData = await freshResponse.json();
          setCommitLogs(freshData);
          localStorage.setItem('pastel_comments', JSON.stringify(freshData));
        }
      }
    } catch (err) {
      console.warn('Failed to sync commit with API backend, fallback to local storage:', err);
    }
  };

  // Utility navigations
  const scrollToMenu = () => {
    document.getElementById('cardapio-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCompiler = () => {
    document.getElementById('compiler-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#121214] text-zinc-100 flex flex-col font-sans transition-all">
      
      {/* 1. Header Navigation Workspace */}
      <Navbar
        cart={cart}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        isOpenStatus={isOpenStatus}
        setIsOpenStatus={setIsOpenStatus}
        onCodeClick={scrollToCompiler}
      />

      {/* 2. Hero Interactive Terminal Shell */}
      <Hero
        products={MENU_PRODUCTS}
        onAddToCart={handleAddToCart}
        isOpenStatus={isOpenStatus}
        onNavigateToMenu={scrollToMenu}
      />

      {/* Main Page Containers */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 pb-20 relative">
        
        {/* Store Closed Banner Warning */}
        {!isOpenStatus && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-rose-400">
            <div className="flex items-start space-x-3 text-center sm:text-left">
              <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0 text-rose-400 mx-auto sm:mx-0" />
              <div>
                <strong className="block uppercase text-white tracking-wider mb-0.5">⚠️ STATUS: OFFLINE / FECHADO</strong>
                <span>Nossa fritadeira e servidores de deploy de pasteis estão em manutenção preventiva. Você ainda pode montar e compilar seu pedido no carrinho para testar a pipeline!</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpenStatus(true)}
              className="px-3.5 py-2 bg-rose-500 text-white font-bold rounded-lg hover:bg-rose-400 transition cursor-pointer"
            >
              sudo systemctl start fritadeira
            </button>
          </div>
        )}

        {/* 3. Interactive Menu Grid */}
        <section id="cardapio-section" className="scroll-mt-24">
          <Menu
            products={MENU_PRODUCTS}
            onAddToCart={handleAddToCart}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </section>

        {/* Informative Divider Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border border-white/10 bg-white/[0.02] rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-400/10 border border-amber-400/30 text-amber-300 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="font-mono text-xs">
              <strong className="block text-white text-sm">Deploy Físico</strong>
              <span className="text-zinc-500">Av. Belmira Marin, Grajaú - SP</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66] rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div className="font-mono text-xs">
              <strong className="block text-white text-sm">Uptime Operacional</strong>
              <span className="text-zinc-500">Terça a Domingo // 18h às 23h30</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-sky-400/10 border border-sky-400/30 text-sky-400 rounded-xl">
              <Wifi className="w-5 h-5" />
            </div>
            <div className="font-mono text-xs">
              <strong className="block text-white text-sm">Latency Entrega</strong>
              <span className="text-zinc-500">Atendimento ultra rápido na ZS (Graja e região)</span>
            </div>
          </div>
        </div>

        {/* 4. Custom Pastel Compiler Workspace */}
        <section id="compiler-section" className="scroll-mt-24">
          <CustomPastelBuilder onAddCustomToCart={handleAddCustomToCart} />
        </section>

        {/* 5. Commit Review Logs History */}
        <section id="commits-section" className="scroll-mt-24">
          <CommitLogs logs={commitLogs} onAddCommit={handleAddCommit} />
        </section>

      </main>

      {/* 6. Footer section with brand signatures */}
      <footer className="bg-[#070709] border-t border-zinc-900 py-12 text-zinc-500 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-center md:text-left">
            
            {/* Branding left */}
            <div className="md:col-span-4 space-y-3">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Code2 className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-white text-base">Pastel.log(grajaú)</span>
              </div>
              <p className="text-zinc-650 max-w-sm text-[11px] leading-relaxed font-sans">
                Compilando e fritando os melhores sabores com tecnologia de ponta no coração do distrito de Grajaú, Zona Sul de São Paulo.
              </p>
            </div>

            {/* Middle links */}
            <div className="md:col-span-4 flex flex-wrap justify-center gap-6 text-[11px]">
              <a href="#hero" className="hover:text-amber-400 transition">./root</a>
              <a href="#cardapio-section" className="hover:text-amber-400 transition">./cardapio</a>
              <a href="#compiler-section" className="hover:text-amber-400 transition">./compiler_setup</a>
              <a href="#commits-section" className="hover:text-amber-400 transition">./git_commits</a>
            </div>

            {/* Right coordinates */}
            <div className="md:col-span-4 space-y-1.5 md:text-right">
              <div className="flex items-center justify-center md:justify-end space-x-1.5 text-zinc-400 text-xs">
                <Globe2 className="w-4 h-4 text-zinc-500" />
                <span>localhost:3000 // production</span>
              </div>
              <p className="text-[11px] text-zinc-600 font-sans">
                Made with <span className="text-amber-400 animate-pulse">💛</span>, crispy dough and high performance coffee. All rights reserved.
              </p>
            </div>

          </div>
        </div>
      </footer>

      {/* 7. Slide drawer container for shopping cart */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* 8. Mobile Bottom Sticky Cart Banner Floating trigger */}
      {totalCartCount > 0 && !isCartOpen && (
        <button
          id="mobile-sticky-cart-trigger"
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono font-bold text-xs p-4 rounded-full shadow-2xl flex items-center space-x-2.5 animate-bounce transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 focus:ring-amber-400 cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-zinc-950" />
            <span className="absolute -top-2.5 -right-2.5 bg-zinc-950 text-amber-400 font-sans font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-amber-400">
              {totalCartCount}
            </span>
          </div>
          <span className="hidden sm:inline">Ver Compilação</span>
        </button>
      )}

    </div>
  );
}
