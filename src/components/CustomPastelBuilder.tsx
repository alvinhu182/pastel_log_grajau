import { useState, useEffect } from 'react';
import { Cpu, Terminal, Sparkles, Plus, AlertTriangle, Check, Layers, Play } from 'lucide-react';
import { INGREDIENTES_ADICIONAIS } from '../data';
import { Product, OrderItem } from '../types';

interface CustomPastelBuilderProps {
  onAddCustomToCart: (customItem: {
    name: string;
    description: string;
    price: number;
    size: 'P' | 'M' | 'G';
    ingredients: string[];
  }) => void;
}

const BASE_FLAVORS = [
  { id: 'base_carne', name: 'Base Carne (v1.0)', price: 11.00, desc: 'Carne moída refogada clássica' },
  { id: 'base_queijo', name: 'Base Queijo (v2.0)', price: 11.00, desc: 'Muçarela premium derretendo' },
  { id: 'base_frango', name: 'Base Frango (v3.0)', price: 12.00, desc: 'Frango suculento desfiado' },
  { id: 'base_palmito', name: 'Base Palmito (v0.5-beta)', price: 13.00, desc: 'Palmito pupunha picado' },
];

export default function CustomPastelBuilder({ onAddCustomToCart }: CustomPastelBuilderProps) {
  const [selectedBase, setSelectedBase] = useState(BASE_FLAVORS[0]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [targetSize, setTargetSize] = useState<'P' | 'M' | 'G'>('M');
  const [compilerLogs, setCompilerLogs] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [successPulse, setSuccessPulse] = useState(false);

  // Compute final price
  const basePrice = selectedBase.price;
  const extrasPrice = selectedExtras.reduce((acc, name) => {
    const ing = INGREDIENTES_ADICIONAIS.find(i => i.name === name);
    return acc + (ing ? ing.price : 0);
  }, 0);
  
  const sizeMultiplier = targetSize === 'P' ? 0.8 : targetSize === 'M' ? 1.0 : 1.4;
  const totalPrice = parseFloat(((basePrice + extrasPrice) * sizeMultiplier).toFixed(2));

  // Determine warnings
  const isHighLoad = selectedExtras.length >= 4;
  const isStackOverflow = selectedExtras.length >= 5;

  const toggleExtra = (name: string) => {
    setSelectedExtras(prev => 
      prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]
    );
  };

  // Compile process simulation
  useEffect(() => {
    const logs = [
      `Initializing PastelCompiler v2.0.0-PRO...`,
      `Base Selected: ${selectedBase.name}`,
      `Selected variables (extras): [${selectedExtras.length > 0 ? selectedExtras.join(', ') : 'nenhum'}]`,
      `Compilation target: size_${targetSize}`,
      `Total Memory (Sabor) calculated to be ${selectedExtras.length * 4 + 8}MB.`,
    ];

    if (isHighLoad) {
      logs.push(`[WARN] Sabor de alto impacto: Risco de vazamento de gordura gostosa.`);
    }
    if (isStackOverflow) {
      logs.push(`[CRITICAL] StackOverflow Exception! Recheio ultrapassa o limite da massa física.`);
    }

    logs.push(`Status: Pronto para fritar.`);
    setCompilerLogs(logs);
  }, [selectedBase, selectedExtras, targetSize, isHighLoad, isStackOverflow]);

  const handleCompileDeploy = () => {
    setIsCompiling(true);
    setCompilerLogs(prev => [...prev, '>>> exec: fritar_pastel_customizado()', '>>> status: imergindo em óleo a 180°C...']);

    setTimeout(() => {
      setIsCompiling(false);
      setSuccessPulse(true);

      const computedName = `Custom_Pastel(${selectedBase.name.split(' ')[1]})`;
      const description = `Pastel compilado com base de ${selectedBase.name.replace('Base ', '')} e adicionais: ${
        selectedExtras.length > 0 ? selectedExtras.join(', ') : 'sem extras'
      }.`;

      onAddCustomToCart({
        name: computedName,
        description,
        price: totalPrice,
        size: targetSize,
        ingredients: [selectedBase.name, ...selectedExtras]
      });

      // Clear states
      setSelectedExtras([]);
      setTargetSize('M');

      setTimeout(() => {
        setSuccessPulse(false);
      }, 3000);
    }, 1200);
  };

  return (
    <div id="pastel-compiler" className="bg-[#151518]/90 rounded-xl border border-white/10 p-6 sm:p-8 relative overflow-hidden">
      {/* Decorative gradient border top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FFC107] via-[#00FF66] to-[#FFC107]" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[#FFC107]">
              <Cpu className="w-5 h-5 text-[#FFC107] animate-spin" style={{ animationDuration: '6s' }} />
              <h3 className="font-mono text-lg font-bold uppercase tracking-tight">Compilador de Pastéis</h3>
            </div>
            <p className="text-sm text-zinc-400">
              Declare suas variáveis e compile seu pastel customizado na hora. Escolha a base e adicione novos módulos de sabor.
            </p>
          </div>

          {/* 1. Base Select */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold text-zinc-400 flex items-center space-x-1 uppercase">
              <span className="text-[#FFC107]">01.</span>
              <span>Selecionar Base (Herança de Classe)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {BASE_FLAVORS.map((base) => {
                const isSelected = selectedBase.id === base.id;
                return (
                  <button
                    key={base.id}
                    onClick={() => setSelectedBase(base)}
                    className={`p-3 rounded border text-left transition-all font-mono relative cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFC107]/10 border-[#FFC107] text-[#FFC107] shadow'
                        : 'bg-white/[0.01] border-white/10 text-zinc-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <span className="block text-[11px] text-zinc-500 font-normal">class Base_</span>
                    <span className="block text-xs font-bold leading-tight">{base.name.split(' (')[0]}</span>
                    <span className="block text-xs mt-1 text-[#00FF66]/90 font-bold">R$ {base.price.toFixed(2)}</span>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 bg-[#FFC107] rounded-full p-0.5 text-[#121214]">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Additional selection */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold text-zinc-400 flex items-center space-x-1 uppercase mt-4">
              <span className="text-[#FFC107]">02.</span>
              <span>Adicionar Bibliotecas / Dependências Extras</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {INGREDIENTES_ADICIONAIS.map((item) => {
                const isAdded = selectedExtras.includes(item.name);
                return (
                  <button
                    key={item.name}
                    onClick={() => toggleExtra(item.name)}
                    className={`flex items-center justify-between p-3 rounded border transition-all text-left font-mono cursor-pointer ${
                      isAdded
                        ? 'bg-white/[0.04] border-[#00FF66]/50 text-[#00FF66]'
                        : 'bg-white/[0.01] border-white/10 text-zinc-400 hover:border-white/20 hover:text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`p-1 rounded ${isAdded ? 'bg-[#00FF66]/10 text-[#00FF66]' : 'bg-black/30 text-zinc-600'}`}>
                        {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </div>
                      <div className="leading-tight">
                        <span className="text-xs font-medium block">{item.name}</span>
                        <span className="text-[10px] text-zinc-500 font-normal">{item.type}</span>
                      </div>
                    </div>
                    <span className="text-xs text-[#00FF66] font-semibold">+ R${item.price.toFixed(2)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Compilation targets (Size) */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold text-zinc-400 flex items-center space-x-1 uppercase mt-4">
              <span className="text-[#FFC107]">03.</span>
              <span>Definir Target de Compilação (Tamanho)</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'P', label: 'P // Sandbox', scale: '0.8x preço', desc: 'Pastel individual compacto para testes rápidos' },
                { id: 'M', label: 'M // Staging', scale: '1.0x preço', desc: 'O tamanho padrão clássico para o dia a dia' },
                { id: 'G', label: 'G // Production', scale: '1.4x preço', desc: 'Gigante otimizado de feira de 30cm para saciar' }
              ].map((size) => {
                const isActive = targetSize === size.id;
                return (
                  <button
                    key={size.id}
                    onClick={() => setTargetSize(size.id as 'P' | 'M' | 'G')}
                    className={`p-3 rounded border text-left transition-all font-mono cursor-pointer ${
                      isActive
                        ? 'bg-[#121214] border-[#FFC107] text-[#FFC107]'
                        : 'bg-white/[0.01] border-white/10 text-zinc-500 hover:border-white/25 hover:text-zinc-400'
                    }`}
                  >
                    <span className="text-xs font-black block text-[#FFC107]">{size.id}</span>
                    <span className="text-[10px] font-bold block">{size.label.split(' // ')[1]}</span>
                    <span className="text-[9px] text-zinc-500 block mt-1">{size.scale}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Compiler Feedback & Deploy Column */}
        <div className="lg:col-span-5 space-y-6 h-full flex flex-col justify-between self-stretch">
          
          {/* Outputs */}
          <div className="bg-black/35 rounded border border-white/10 p-4 font-mono text-[11px] text-zinc-400 flex-1 flex flex-col justify-between min-h-[220px]">
            <div className="space-y-1">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-wider flex items-center space-x-1">
                  <Terminal className="w-3.5 h-3.5 text-zinc-500 mr-1" />
                  <span>Compiler Dashboard</span>
                </span>
                <span className="text-[9px] bg-white/[0.04] text-zinc-450 border border-white/5 px-1.5 py-0.5 rounded">
                  Status: PRONTO
                </span>
              </div>
              <div className="space-y-1.5 overflow-y-auto max-h-[160px] text-zinc-400">
                {compilerLogs.map((log, i) => {
                  let logColor = 'text-zinc-500';
                  if (log.startsWith('[WARN]')) logColor = 'text-[#FFC107] font-medium';
                  if (log.startsWith('[CRITICAL]')) logColor = 'text-rose-500 font-bold';
                  if (log.includes('Success:')) logColor = 'text-[#00FF66]';
                  if (log.startsWith('>>>')) logColor = 'text-sky-400 italic';
                  return (
                    <div key={i} className={`leading-tight ${logColor}`}>
                      {log}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Warnings visual panel if appropriate */}
            <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
              {isStackOverflow && (
                <div className="flex items-start space-x-2 bg-rose-500/10 border border-rose-500/30 rounded p-2 text-rose-400">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-none" />
                  <p className="text-[10px] leading-tight">
                    <strong>CRITICAL_WARN:</strong> Massa corre o risco de rompimento no fritador. Recomenda-se compilar com cautela de mestre.
                  </p>
                </div>
              )}
              {!isStackOverflow && isHighLoad && (
                <div className="flex items-start space-x-2 bg-amber-500/10 border border-amber-500/30 rounded p-2 text-amber-400">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-none" />
                  <p className="text-[10px] leading-tight">
                    <strong>SYSTEM_WARN:</strong> Pastel de alta densidade calórica compilado. Prepare o estômago para o deploy físico do almoço!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Pricing & Send to production (Cart) */}
          <div className="bg-white/[0.02] rounded border border-white/10 p-4 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-zinc-500 text-[11px] font-mono block uppercase">Preço Estimado de Compilação</span>
                <span className="text-2xl font-black font-mono text-[#00FF66]">
                  R$ {totalPrice.toFixed(2)}
                </span>
              </div>
              <span className="text-[10px] bg-[#121214] font-mono text-zinc-500 px-2.5 py-1 rounded border border-white/10">
                scale: {sizeMultiplier.toFixed(1)}x
              </span>
            </div>

            {successPulse ? (
              <div className="py-3 bg-[#00FF66]/10 border border-[#00FF66]/30 rounded flex items-center justify-center space-x-2 text-[#00FF66] font-mono text-xs">
                <Check className="w-4 h-4 animate-bounce" />
                <span>[SUCCESS] Deployado para o carrinho do Grajaú!</span>
              </div>
            ) : (
              <button
                id="compile-pastel-submit-btn"
                onClick={handleCompileDeploy}
                disabled={isCompiling}
                className={`w-full font-mono text-sm font-semibold text-[#121214] bg-[#FFC107] hover:bg-[#FFC107]/90 py-3.5 px-4 rounded flex items-center justify-center space-x-2.5 leading-none cursor-pointer transition shadow-sm ${
                  isCompiling ? 'opacity-50 cursor-not-allowed bg-zinc-600 text-zinc-300' : ''
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isCompiling ? 'Compilando código...' : 'SUDO MAKE PASTEL (Deploy)'}</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
