import { useState, useEffect } from 'react';
import { Terminal, ShoppingCart, Code2, AlertCircle, ToggleLeft, ToggleRight, Sparkles, BookOpen } from 'lucide-react';
import { OrderItem } from '../types';

interface NavbarProps {
  cart: OrderItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isOpenStatus: boolean;
  setIsOpenStatus: (status: boolean) => void;
  onCodeClick: () => void;
}

export default function Navbar({
  cart,
  setIsCartOpen,
  isOpenStatus,
  setIsOpenStatus,
  onCodeClick
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="main-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#121214]/90 backdrop-blur-md border-b border-white/10 shadow-md py-3'
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-[#FFC107] text-[#121214] p-2 rounded font-mono font-bold flex items-center justify-center shadow-md">
              <Terminal className="w-5 h-5" />
            </div>
            <a href="#" className="font-mono text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center">
              <span>Pastel.log</span>
              <span className="text-zinc-500 text-base sm:text-lg font-normal mx-0.5">(</span>
              <span className="text-[#FFC107] font-extrabold text-lg sm:text-xl relative group">
                grajaú
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FFC107] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </span>
              <span className="text-zinc-500 text-base sm:text-lg font-normal">)</span>
            </a>
          </div>

          {/* Desktop Right Hand Control panel */}
          <div className="flex items-center space-x-4">
            
            {/* Simulation Status Badge Toggle */}
            <div className="hidden md:flex items-center space-x-2 bg-white/[0.02] border border-white/10 rounded px-3 py-1 text-xs">
              <span className="text-zinc-400">Ambiente:</span>
              <button
                id="env-toggle"
                onClick={() => setIsOpenStatus(!isOpenStatus)}
                className="flex items-center space-x-1.5 focus:outline-none focus:ring-1 focus:ring-[#FFC107]/50 rounded px-1.5 py-0.5 transition hover:bg-white/[0.05]"
              >
                <div className={`w-2 h-2 rounded-full ${isOpenStatus ? 'bg-[#00FF66] animate-pulse' : 'bg-rose-500'}`} />
                <span className={isOpenStatus ? 'text-[#00FF66] font-medium' : 'text-rose-400 font-medium'}>
                  {isOpenStatus ? '● Production (Aberto)' : '○ Maintenance (Fechado)'}
                </span>
                <span className="text-[10px] text-zinc-500">([Clique])</span>
              </button>
            </div>

            {/* Mobile simplified status */}
            <button
              onClick={() => setIsOpenStatus(!isOpenStatus)}
              className="md:hidden flex items-center space-x-1 bg-white/[0.02] border border-white/10 rounded px-2.5 py-1 text-[11px] font-mono leading-none"
            >
              <div className={`w-1.5 h-1.5 rounded-full ${isOpenStatus ? 'bg-[#00FF66] animate-pulse' : 'bg-rose-500'}`} />
              <span className={isOpenStatus ? 'text-[#00FF66]' : 'text-rose-400'}>
                {isOpenStatus ? 'Online' : 'Maint'}
              </span>
            </button>

            {/* Interactive Terminal Launcher button */}
            <button
              id="compiler-launcher-btn"
              onClick={onCodeClick}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded border border-white/10 bg-white/[0.02] hover:bg-[#FFC107]/10 hover:border-[#FFC107]/40 text-xs text-zinc-300 hover:text-[#FFC107] transition-all duration-200"
              title="Abrir Compiler de Pastéis"
            >
              <Code2 className="w-3.5 h-3.5 text-[#FFC107]" />
              <span className="hidden sm:inline font-mono">Pastel_Compiler</span>
            </button>

            {/* Cart Button */}
            <button
              id="nav-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded bg-white/[0.02] hover:bg-white/[0.05] text-zinc-300 hover:text-[#FFC107] transition-all duration-200 border border-white/10 hover:border-[#FFC107]/30"
              aria-label="Ver Carrinho de Compras"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#FFC107] text-[#121214] font-bold text-[10px] font-mono h-5 w-5 rounded-full flex items-center justify-center border border-[#121214] animate-bounce">
                  {totalItemsCount}
                </span>
              )}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
