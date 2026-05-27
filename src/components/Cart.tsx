import { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Gift, Check, ArrowRight, MessageSquare, ShieldCheck, HelpCircle } from 'lucide-react';
import { OrderItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: OrderItem[];
  onUpdateQuantity: (id: string, amount: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

const DEPLOYMENT_COUPONS = {
  'SUDO_DISCOUNT': { rate: 0.10, desc: '10% OFF para comandos administrativos' },
  'BUG_FREE': { rate: 0.15, desc: '15% OFF pela ausência de falas na receita' },
  'GRAJATECH': { rate: 0.20, desc: '20% de desconto de morador desenvolvedor do Grajaú!' },
};

export default function Cart({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}: CartProps) {
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<{ code: string; rate: number; desc: string } | null>(null);
  const [couponError, setCouponError] = useState('');
  
  // Client delivery info
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<'ENTREGA' | 'RETIRADA'>('ENTREGA');
  
  // Detailed delivery fields
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [complement, setComplement] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CARTAO_DEBITO' | 'CARTAO_CREDITO' | 'DINHEIRO'>('PIX');

  if (!isOpen) return null;

  // Calculators
  const subtotal = cart.reduce((acc, item) => {
    let itemPrice = item.product.price;
    if (item.customIngredients) {
      itemPrice = item.product.price; // Custom price is pre-calculated on compile
    }
    const sizeMultiplier = item.selectedSize === 'P' ? 0.8 : item.selectedSize === 'M' ? 1.0 : 1.4;
    return acc + (itemPrice * sizeMultiplier) * item.quantity;
  }, 0);

  const discountAmount = activeCoupon ? subtotal * activeCoupon.rate : 0;
  const deliveryFee = deliveryType === 'ENTREGA' ? 5.50 : 0.00;
  const grandTotal = subtotal - discountAmount + deliveryFee;

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code in DEPLOYMENT_COUPONS) {
      const entry = DEPLOYMENT_COUPONS[code as keyof typeof DEPLOYMENT_COUPONS];
      setActiveCoupon({
        code,
        rate: entry.rate,
        desc: entry.desc
      });
      setCouponError('');
    } else {
      setCouponError('Error: Invalid token code. Tente [GRAJATECH] ou [SUDO_DISCOUNT]');
      setTimeout(() => setCouponError(''), 4000);
    }
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
    setCouponCode('');
  };

  // Compile full digital order context to WhatsApp formatted string
  const compileWhatsAppOrder = () => {
    if (cart.length === 0) return;

    const formattedDate = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    let message = `🚀 *PASTEL.LOG(GRAJAÚ) - COMPILANDO PEDIDO* 🚀\n`;
    message += `=========================================\n`;
    message += `👤 *CLIENTE:* ${clientName || 'Desenvolvedor Anônimo'}\n`;
    if (clientPhone) {
      message += `📞 *CONTATO:* ${clientPhone}\n`;
    }
    message += `🕒 *DATA DO DEPLOY:* Hoje às ${formattedDate}\n`;
    message += `📦 *MÉTODO:* ${deliveryType}\n`;
    if (deliveryType === 'ENTREGA') {
      const fullAddress = `${street || 'Não informada'}${number ? `, Nº ${number}` : ''}${neighborhood ? `, Bairro: ${neighborhood}` : ''}${complement ? ` (${complement})` : ''}`;
      message += `📍 *ENDEREÇO:* ${fullAddress}\n`;
    }
    message += `=========================================\n\n`;
    message += `🛒 *ITENS NA ESTEIRA DE FRITURA:*\n`;

    cart.forEach((item, index) => {
      const sizeLabel = item.selectedSize === 'P' ? 'Sandbox [P]' : item.selectedSize === 'M' ? 'Staging [M]' : 'Production [G]';
      message += `👉 *[${index + 1}]* ${item.quantity}x *${item.product.name}*\n`;
      message += `   - Target: \`${sizeLabel}\`\n`;
      if (item.customIngredients && item.customIngredients.length > 0) {
        message += `   - Var adicionadas: ${item.customIngredients.join(', ')}\n`;
      }
      const itemPrice = item.product.price;
      const sizeMultiplier = item.selectedSize === 'P' ? 0.8 : item.selectedSize === 'M' ? 1.0 : 1.4;
      const finalItemTotal = ((itemPrice * sizeMultiplier) * item.quantity).toFixed(2);
      message += `   - Preço Compilado: R$ ${finalItemTotal}\n\n`;
    });

    message += `=========================================\n`;
    message += `💵 *SUBTOTAL:* R$ ${subtotal.toFixed(2)}\n`;
    if (activeCoupon) {
      message += `🎟️ *CUPOM APLICADO:* \`${activeCoupon.code}\` (-${activeCoupon.rate * 100}%)\n`;
      message += `   - Desconto: -R$ ${discountAmount.toFixed(2)}\n`;
    }
    message += `🛵 *TAXA DE LOGÍSTICA (Entrega):* R$ ${deliveryFee.toFixed(2)}\n`;
    message += `💰 *TOTAL DO DEPLOY:* R$ ${grandTotal.toFixed(2)}\n`;
    message += `💳 *PAGAMENTO:* ${paymentMethod.replace('_', ' ')}\n`;
    message += `=========================================\n`;
    message += `⚠️ status: [● AGUARDANDO_PREPARO]\n`;
    message += `⌨️ Made on top with Pastel.log(grajaú) 💛`;

    const encodedMessage = encodeURIComponent(message);
    // WhatsApp link using the requested number 35988351193
    const whatsappUrl = `https://wa.me/5535988351193?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div id="cart-drawer-content" className="w-screen max-w-md bg-[#121214] border-l border-white/10 text-zinc-100 flex flex-col shadow-2xl relative">
          
          {/* Header */}
          <div className="px-6 py-5 bg-[#151518]/90 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="bg-[#FFC107] text-zinc-950 p-2 rounded font-mono">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-mono text-base font-bold uppercase tracking-tight text-white">Production Cart</h2>
                <span className="text-[10px] text-zinc-500 font-mono block">status: compiling order payload...</span>
              </div>
            </div>
            
            <button
              id="close-cart-btn"
              onClick={onClose}
              className="p-1.5 rounded border border-white/10 hover:border-white/20 bg-white/[0.02] text-zinc-400 hover:text-white transition"
              aria-label="Preencher console"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Item Feed */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 space-y-3 font-mono">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 text-xl font-bold animate-pulse">
                  0x0
                </div>
                <div>
                  <p className="text-zinc-400 text-xs text-semibold">[Nenhum item deployado na esteira]</p>
                  <p className="text-zinc-600 text-[10px] mt-1">Navegue no cardápio e adicione variáveis à mesa.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase text-zinc-500 font-mono tracking-wider font-bold">Variáveis de Compra ({cart.length})</span>
                  <button
                    id="clear-cart-btn"
                    onClick={onClearCart}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-mono underline flex items-center space-x-1"
                  >
                    <Trash2 className="w-3 h-3 mr-0.5" />
                    <span>clean_cache()</span>
                  </button>
                </div>

                {cart.map((item) => {
                  const sizeLabel = item.selectedSize === 'P' ? 'Sandbox [P]' : item.selectedSize === 'M' ? 'Staging [M]' : 'Production [G]';
                  const basePrice = item.product.price;
                  const sizeMultiplier = item.selectedSize === 'P' ? 0.8 : item.selectedSize === 'M' ? 1.0 : 1.4;
                  const singlePrice = basePrice * sizeMultiplier;
                  const itemTotalPrice = singlePrice * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="bg-white/[0.02] rounded border border-white/10 p-3 flex flex-col justify-between space-y-3 relative overflow-hidden group hover:bg-[#151518] transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono text-[#FFC107] bg-[#FFC107]/10 px-1.5 py-0.5 rounded">
                            {item.product.version || 'v1.0.0'}
                          </span>
                          <h4 className="text-sm font-semibold text-white tracking-tight pt-1">
                            {item.product.name}
                          </h4>
                          <span className="text-[10px] font-mono text-zinc-500 block">
                            Target size: <span className="text-zinc-300">{sizeLabel}</span>
                          </span>
                          {item.customIngredients && item.customIngredients.length > 0 && (
                            <p className="text-[10px] font-mono text-zinc-500 leading-tight mt-1 bg-black/40 p-2 rounded border border-white/10">
                              <span className="text-sky-400">imports:</span> {item.customIngredients.join(', ')}
                            </p>
                          )}
                        </div>

                        {/* Remove item button */}
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-zinc-500 hover:text-rose-400 p-1 rounded hover:bg-white/[0.02] transition"
                          title="Remover Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-white/5">
                        {/* Quantity picker */}
                        <div className="flex items-center space-x-1.5 bg-black/30 px-1.5 py-1 rounded border border-white/10">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 rounded text-zinc-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs w-6 text-center text-white font-bold">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 rounded text-zinc-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Cost */}
                        <div className="text-right">
                          <span className="text-xs text-[#00FF66] font-bold font-mono">
                            R$ {itemTotalPrice.toFixed(2)}
                          </span>
                          <span className="block text-[9px] text-zinc-500 font-mono">
                            un: R$ {singlePrice.toFixed(2)}
                          </span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* Client Input Credentials (only if there are items) */}
            {cart.length > 0 && (
              <div className="mt-8 border-t border-white/10 pt-5 space-y-4 font-mono">
                <span className="text-[11px] uppercase text-zinc-500 tracking-wider font-bold block">Fritador Config_Variables</span>
                
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 flex items-center space-x-1">
                    <span>const Client_Name =</span>
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ex: Lucas_Dev"
                    className="w-full bg-[#121214] border border-white/10 rounded py-2 px-3 text-xs text-white focus:outline-none focus:border-[#FFC107]"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 flex items-center space-x-1">
                    <span>const Client_Phone =</span>
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Ex: (35) 98835-1193"
                    className="w-full bg-[#121214] border border-white/10 rounded py-2 px-3 text-xs text-white focus:outline-none focus:border-[#FFC107]"
                  />
                </div>

                {/* Logistics (Entrega vs Retirada) */}
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400">const DeliveryMode =</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('ENTREGA')}
                      className={`py-2 px-3 rounded border text-center transition-all cursor-pointer ${
                        deliveryType === 'ENTREGA'
                          ? 'bg-[#FFC107]/10 border-[#FFC107] text-[#FFC107]'
                          : 'bg-[#121214] border-white/10 text-zinc-450 hover:border-white/20'
                      }`}
                    >
                      &quot;ENTREGA&quot;
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType('RETIRADA')}
                      className={`py-2 px-3 rounded border text-center transition-all cursor-pointer ${
                        deliveryType === 'RETIRADA'
                          ? 'bg-[#FFC107]/10 border-[#FFC107] text-[#FFC107]'
                          : 'bg-[#121214] border-white/10 text-zinc-450 hover:border-white/20'
                      }`}
                    >
                      &quot;RETIRADA&quot;
                    </button>
                  </div>
                </div>

                {/* Address (only if Delivery) */}
                {deliveryType === 'ENTREGA' && (
                  <div className="space-y-3 p-3 bg-white/[0.01] border border-white/5 rounded animate-fadeIn text-left">
                    <span className="text-[10px] text-[#FFC107] font-mono block mb-1">📍 const Delivery_Address_Schema = &#123;</span>
                    
                    <div className="space-y-1 pl-2">
                      <label className="text-[10px] text-zinc-500">rua_avenida:</label>
                      <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Nome da rua / Avenida"
                        className="w-full bg-[#121214] border border-white/10 rounded py-1.5 px-3 text-xs text-white focus:outline-none focus:border-[#FFC107] font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 pl-2">
                      <div className="col-span-1 space-y-1">
                        <label className="text-[10px] text-zinc-500">numero:</label>
                        <input
                          type="text"
                          value={number}
                          onChange={(e) => setNumber(e.target.value)}
                          placeholder="EX: 2030"
                          className="w-full bg-[#121214] border border-white/10 rounded py-1.5 px-2 text-xs text-white focus:outline-none focus:border-[#FFC107] font-mono"
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-[10px] text-zinc-500">bairro:</label>
                        <input
                          type="text"
                          value={neighborhood}
                          onChange={(e) => setNeighborhood(e.target.value)}
                          placeholder="Ex: Grajaú"
                          className="w-full bg-[#121214] border border-white/10 rounded py-1.5 px-2 text-xs text-white focus:outline-none focus:border-[#FFC107] font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 pl-2">
                      <label className="text-[10px] text-zinc-500">complemento:</label>
                      <input
                        type="text"
                        value={complement}
                        onChange={(e) => setComplement(e.target.value)}
                        placeholder="Ex: Apto 12 / Ponto Ref"
                        className="w-full bg-[#121214] border border-white/10 rounded py-1.5 px-3 text-xs text-white focus:outline-none focus:border-[#FFC107] font-mono"
                      />
                    </div>
                    
                    <span className="text-[10px] text-[#FFC107] font-mono block mt-1">&#125;;</span>
                  </div>
                )}

                {/* Payment Method */}
                <div className="space-y-1 font-mono">
                  <label className="text-[10px] text-zinc-400">const Payment_Token =</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-[#121214] border border-white/10 rounded py-2 px-3 text-xs text-zinc-350 focus:outline-none focus:border-[#FFC107]"
                  >
                    <option value="PIX">&quot;PIX&quot; (Desconto Adicional de 2%)</option>
                    <option value="CARTAO_DEBITO">&quot;CARTAO_DEBITO&quot;</option>
                    <option value="CARTAO_CREDITO">&quot;CARTAO_CREDITO&quot;</option>
                    <option value="DINHEIRO">&quot;DINHEIRO&quot;</option>
                  </select>
                </div>
              </div>
            )}

          </div>

          {/* Footer checkout panel */}
          {cart.length > 0 && (
            <div className="bg-[#151518]/95 border-t border-white/10 p-6 space-y-4">
              
              {/* Promotion / Coupon Module */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold flex items-center space-x-1">
                    <Gift className="w-3.5 h-3.5 text-[#FFC107] mr-1" />
                    <span>Injetar Token de Desconto</span>
                  </span>
                  {activeCoupon && (
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-[9px] text-rose-450 font-mono underline hover:text-rose-350"
                    >
                      [remover]
                    </button>
                  )}
                </div>

                {!activeCoupon ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Ex: SUDO_DISCOUNT"
                      className="flex-1 bg-black/20 border border-white/10 rounded px-3 py-2 font-mono text-xs text-white uppercase focus:outline-none focus:border-[#FFC107]"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-3.5 bg-white/[0.02] border border-white/10 text-zinc-300 hover:text-[#FFC107] text-xs font-mono rounded transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="p-2.5 bg-[#00FF66]/10 border border-[#00FF66]/20 rounded text-[#00FF66] text-xs font-mono flex items-center justify-between">
                    <div>
                      <span className="font-bold">{activeCoupon.code}</span>
                      <span className="block text-[9px] text-zinc-500">{activeCoupon.desc}</span>
                    </div>
                    <Check className="w-4 h-4 text-[#00FF66] shrink-0" />
                  </div>
                )}
                {couponError && (
                  <span className="text-[10px] font-mono text-rose-400 block">{couponError}</span>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-white/5 pt-3 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                {activeCoupon && (
                  <div className="flex justify-between text-[#00FF66]">
                    <span>Desconto ({activeCoupon.code})</span>
                    <span>-R$ {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-500">
                  <span>Taxa de Logística (Frete)</span>
                  <span>{deliveryFee === 0 ? 'R$ 0.00' : `R$ ${deliveryFee.toFixed(2)}`}</span>
                </div>
                {paymentMethod === 'PIX' && (
                  <div className="flex justify-between text-[#00FF66]/90 text-[11px]">
                    <span>Bônus de Lote (PIX - 2% Off)</span>
                    <span>-R$ {(grandTotal * 0.02).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-white/10">
                  <span>DEPLOY TOTAL:</span>
                  <span className="text-[#00FF66] font-mono font-black text-base">
                    R$ {(paymentMethod === 'PIX' ? grandTotal * 0.98 : grandTotal).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Fire Deploy! */}
              <button
                id="whatsapp-deploy-btn"
                onClick={compileWhatsAppOrder}
                className="w-full text-zinc-950 font-mono text-[13px] font-bold bg-[#FFC107] hover:bg-[#FFC107]/90 py-3 rounded flex items-center justify-center space-x-2 shadow-lg cursor-pointer transition leading-none shadow-amber-400/10"
              >
                <MessageSquare className="w-4 h-4" />
                <span>SUDO COMPILE PEDIDO (Wpp)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[10px] text-zinc-650 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00FF66]" />
                <span>Payload compilado localmente em tempo real</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
