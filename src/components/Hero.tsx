import { useState, useRef, useEffect } from 'react';
import { Terminal, Code, ChevronRight, Play, Server, Layers, HelpCircle, ArrowDown } from 'lucide-react';
import { Product, OrderItem } from '../types';

interface HeroProps {
  products: Product[];
  onAddToCart: (product: Product, size: 'P' | 'M' | 'G') => void;
  isOpenStatus: boolean;
  onNavigateToMenu: () => void;
}

export default function Hero({ products, onAddToCart, isOpenStatus, onNavigateToMenu }: HeroProps) {
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'System: PastelOS v4.1.2-beta boot successful.',
    'System: Cooling_System.exe is running on port 3000.',
    'System: Fritadora_Core connected successfully.',
    'Execute o comando [help] ou clique nas tags abaixo para começar:',
  ]);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Pre-compiled quick commands
  const quickCommands = ['neofetch', 'sudo get-pastel', 'git log', 'clear'];

  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    let response: string[] = [];
    response.push(`$ ${cmd}`);

    if (trimmed === 'help') {
      response.push(
        'Comandos disponíveis:',
        '  neofetch      - Informações do sistema do e especificações da loja',
        '  cardapio      - Lista todas as categorias de pastéis e bebidas',
        '  git log       - Histórico de commits (avaliações dos clientes)',
        '  sudo get-carne - Adiciona um Pastel de Carne (v1.0) ao seu carrinho!',
        '  env           - Variáveis de ambiente da cozinha',
        '  clear         - Limpa o terminal'
      );
    } else if (trimmed === 'neofetch') {
      response.push(
        '  [33mPastel.log(grajaú)[0m',
        '  ------------------',
        '  OS: PastelOS GNU/Linux x86_64',
        '  Uptime: Aberto há 4 horas (desde o início do expediente)',
        '  Shell: bash /bin/fritar_pastel',
        '  CPU: Fritadeira Turbo de Indução v2 (12 núcleos)',
        '  GPU: Molho Especial de Pimenta v4 (Ray Tracing)',
        '  RAM: 16GB Muçarela Estabilizada / 8GB Presunto',
        '  Localização: Grajaú, São Paulo, ZS',
        `  Status: ${isOpenStatus ? 'Aberto / Compactando sabores' : 'Fechado para Manutenção / Commitando receitas'}`
      );
    } else if (trimmed === 'cardapio' || trimmed === 'cat cardapio') {
      response.push(
        '  [PASTÉIS SALGADOS]',
        '    - Carne v1.0 [R$ 11.00]',
        '    - Queijo v2.0 [R$ 11.00]',
        '    - Frango Merge Conflict [R$ 13.00]',
        '    - StackOverflow (Gigante) [R$ 18.00]',
        '  [PASTÉIS DOCES]',
        '    - Nutella Sweet Code [R$ 15.00]',
        '  [SISTEMA DE ARREFECIMENTO]',
        '    - Caldo de Cana Cooling_System [R$ 9.00]'
      );
    } else if (trimmed === 'sudo get-pastel' || trimmed === 'sudo get-carne') {
      const carne = products.find(p => p.id === 'carne_v1');
      if (carne) {
        onAddToCart(carne, 'M');
        response.push(
          '  [32m[SUCCESS] Compilação Concluída![0m',
          '  Pastel de Carne (v1.0) adicionado ao carrinho com permissões de ROOT.',
          '  Verifique seu painel de produção (carrinho) à direita.'
        );
      } else {
        response.push('  [31m[ERROR] Código do pastel não encontrado no banco.[0m');
      }
    } else if (trimmed === 'git log') {
      response.push(
        '  commit 0aefc12 (HEAD -> master, origin/master)',
        '  Author: ana_dev_web <ana@frontend.br>',
        '  Date:   Wed May 27 22:11:00 2026',
        '  ',
        '      fix: o Pastel de Queijo (v2.0) resolveu meu bug de fome com 200 OK. Maravilhoso!',
        '  ',
        '  commit 6fb3a2c',
        '  Author: lucas_hackGraja <lucas@graja.tech>',
        '  ',
        '      feat: caldo de cana super gelado reduzindo gargalo de processamento.'
      );
    } else if (trimmed === 'env') {
      response.push(
        '  AMBIENTE=producao',
        '  MAQUINA_FRITADORA=automatic_oil_3000',
        '  SEGREDO_MASSA=crocante_com_cachaca_premium',
        '  DEBUG=false',
        '  FOME_LEVEL=MAXIMUM'
      );
    } else if (trimmed === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else {
      response.push(`  bash: comando não encontrado: ${cmd}. Digite [help] para ajuda.`);
    }

    setTerminalHistory(prev => [...prev, ...response]);
    setTerminalInput('');
  };

  return (
    <section id="hero" className="relative pt-32 pb-20 sm:pb-28 overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Background abstract ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-400/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-emerald-400/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Copy Area */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 bg-[#FFC107]/10 border border-[#FFC107]/30 rounded-full px-3 py-1.5 text-xs text-[#FFC107] font-mono font-medium">
              <Code className="w-3.5 h-3.5" />
              <span>import &apos;FeiraLivre_Grajaú&apos;;</span>
            </div>

            {/* Main title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-mono font-bold text-white tracking-tight leading-[1.1]">
              while(<span className="text-[#00FF66]">fome</span>) &#123;<br />
              <span className="pl-6 sm:pl-10 text-[#FFC107] inline-block animate-pulse">comer_pastel();</span><br />
              &#125;
            </h1>

            {/* Subheading text */}
            <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
              Compilando a tradição irresistível da massa crocante com o recheio transbordando que você ama. 
              Injetamos tecnologia no seu prato no coração do Grajaú. Experimente pasteis e bebidas otimizados de verdade.
            </p>

            {/* Action buttons CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
              <button
                id="hero-cta-menu"
                onClick={onNavigateToMenu}
                className="w-full sm:w-auto font-mono text-sm font-semibold text-[#121214] bg-[#FFC107] hover:bg-[#FFC107]/90 transition-colors duration-200 px-6 py-3.5 rounded flex items-center justify-center space-x-2 shadow-sm group cursor-pointer"
              >
                <span>cd /cardapio_digital</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-cta-compiler"
                onClick={onNavigateToMenu} // Point to compiler action below
                className="w-full sm:w-auto font-[#121214] text-sm font-medium text-zinc-300 hover:text-white bg-white/[0.02] border border-white/10 hover:border-[#FFC107]/30 transition-colors duration-200 px-6 py-3.5 rounded flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Server className="w-4 h-4 text-[#00FF66]" />
                <span>sudo make custom-pastel</span>
              </button>
            </div>

            {/* Trust and details */}
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-6 border-t border-white/10 text-xs font-mono text-zinc-500">
              <div>
                <span className="block font-bold text-zinc-300 text-sm">Tempo de Resposta:</span>
                <span>~15min (Low Latency)</span>
              </div>
              <div className="border-l border-white/10 h-8" />
              <div>
                <span className="block font-bold text-zinc-300 text-sm">Deploy Físico:</span>
                <span>Grajaú, SP (ZS)</span>
              </div>
              <div className="border-l border-white/10 h-8" />
              <div>
                <span className="block font-bold text-zinc-300 text-sm">Avaliação:</span>
                <span className="text-[#FFC107]">★★★★★ 4.9 (git log)</span>
              </div>
            </div>

          </div>

          {/* Interactive Terminal Emulator */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-[#151518]/90 rounded-xl border border-white/10 shadow-xl overflow-hidden font-mono text-xs flex flex-col h-[340px] sm:h-[380px]">
              
              {/* Terminal Window Header Bar */}
              <div className="bg-white/[0.02] border-b border-white/10 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="text-zinc-500 font-medium text-[11px] select-none text-center flex items-center space-x-1.5">
                  <Server className="w-3.5 h-3.5 text-zinc-650" />
                  <span>terminal@pastel.log.grajau</span>
                </div>
                <div className="w-10" /> {/* Spacer */}
              </div>

              {/* Terminal Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-2.5 text-zinc-300 scrollbar-thin">
                {terminalHistory.map((line, index) => {
                  // Basic formatting tags parser
                  let formatted = line;
                  let isSuccess = false;
                  let isBoldYellow = false;
                  let isError = false;

                  if (line.includes('[SUCCESS]') || line.includes('[32m')) {
                    isSuccess = true;
                    formatted = line.replace('[32m', '').replace('[0m', '');
                  } else if (line.includes('Pastel.log') || line.includes('[33m')) {
                    isBoldYellow = true;
                    formatted = line.replace('[33m', '').replace('[0m', '');
                  } else if (line.includes('[ERROR]') || line.includes('[31m')) {
                    isError = true;
                    formatted = line.replace('[31m', '').replace('[0m', '');
                  }

                  return (
                    <div 
                      key={index} 
                      className={`whitespace-pre-wrap leading-relaxed ${
                        isSuccess ? 'text-[#00FF66] font-medium' : 
                        isBoldYellow ? 'text-[#FFC107] font-bold' : 
                        isError ? 'text-rose-400' :
                        line.startsWith('$') ? 'text-white font-medium' : 'text-zinc-400'
                      }`}
                    >
                      {formatted}
                    </div>
                  );
                })}
                <div ref={terminalBottomRef} />
              </div>

              {/* Terminal Input Row */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCommand(terminalInput);
                }}
                className="bg-[#121214] px-4 py-2.5 border-t border-white/10 flex items-center"
              >
                <ChevronRight className="w-4 h-4 text-[#FFC107] animate-pulse mr-1" />
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="Instale o jantar..."
                  className="flex-1 bg-transparent border-none outline-none ring-0 text-white font-mono placeholder-zinc-700"
                />
                <button
                  type="submit"
                  className="p-1 text-zinc-500 hover:text-[#FFC107] transition"
                  title="Executar comando"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </form>

            </div>

            {/* Quick-Click Command Badges */}
            <div className="mt-3 flex flex-wrap gap-2 items-center justify-center">
              <span className="text-[10px] text-zinc-500 font-mono">Quick Run:</span>
              {quickCommands.map((command) => (
                <button
                  key={command}
                  onClick={() => handleCommand(command)}
                  className="px-2 py-1 bg-white/[0.02] hover:bg-white/[0.05] text-[11px] font-mono font-medium rounded text-zinc-400 hover:text-[#FFC107] border border-white/10 hover:border-[#FFC107]/30 transition-all cursor-pointer"
                >
                  ./{command}
                </button>
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* Decorative arrow down */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer opacity-40 hover:opacity-100 transition-opacity" onClick={onNavigateToMenu}>
        <span className="text-[10px] font-mono text-zinc-500 mb-1">cd cardapio</span>
        <ArrowDown className="w-4 h-4 text-[#FFC107] animate-bounce" />
      </div>
    </section>
  );
}
