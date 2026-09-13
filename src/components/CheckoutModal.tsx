import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Send, 
  Loader2, 
  CheckCircle2, 
  Store,
  AlertCircle,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchAddressByCep } from '../utils/cep';
import { formatCurrency, formatPhone, formatCep } from '../utils/formatters';
import { openWhatsAppOrder } from '../utils/whatsapp';
import { STORE_CONFIG } from '../config/store';
import { PaymentMethod } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    subtotal,
    deliveryFee,
    discount,
    total,
    customer,
    updateCustomer,
    saveCustomerPermanently,
    deliveryType,
    setDeliveryType,
    createOrder,
    clearCart,
    setActiveTab,
    showToast,
  } = useApp();

  // Steps: 1 = Address & Info, 2 = Payment & Note, 3 = Review & Send
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [name, setName] = useState(customer.name || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [cep, setCep] = useState(customer.cep || '');
  const [street, setStreet] = useState(customer.street || '');
  const [number, setNumber] = useState(customer.number || '');
  const [neighborhood, setNeighborhood] = useState(customer.neighborhood || '');
  const [city, setCity] = useState(customer.city || STORE_CONFIG.city);
  const [state, setState] = useState(customer.state || STORE_CONFIG.state);
  const [complement, setComplement] = useState(customer.complement || '');
  const [reference, setReference] = useState(customer.reference || '');

  // Loading CEP
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepStatusMsg, setCepStatusMsg] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [needsChange, setNeedsChange] = useState<boolean>(false);
  const [changeFor, setChangeFor] = useState<string>('');

  // Notes
  const [orderObservation, setOrderObservation] = useState<string>('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Submitting
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  // Handle CEP auto-fill
  const handleCepChange = async (val: string) => {
    const formatted = formatCep(val);
    setCep(formatted);
    setCepStatusMsg('');

    const clean = formatted.replace(/\D/g, '');
    if (clean.length === 8) {
      setIsLoadingCep(true);
      const res = await fetchAddressByCep(clean);
      setIsLoadingCep(false);

      if (res.error) {
        setCepStatusMsg(res.error);
      } else {
        if (res.street) setStreet(res.street);
        if (res.neighborhood) setNeighborhood(res.neighborhood);
        if (res.city) setCity(res.city);
        if (res.state) setState(res.state);
        setCepStatusMsg('Endereço localizado com sucesso! ✅');
      }
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Informe seu nome completo';
    if (!phone.replace(/\D/g, '') || phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Informe um WhatsApp válido com DDD';
    }

    if (deliveryType === 'delivery') {
      if (!cep.replace(/\D/g, '') || cep.replace(/\D/g, '').length < 8) {
        newErrors.cep = 'Informe um CEP válido';
      }
      if (!street.trim()) newErrors.street = 'Informe a rua';
      if (!number.trim()) newErrors.number = 'Informe o número';
      if (!neighborhood.trim()) newErrors.neighborhood = 'Informe o bairro';
      if (!city.trim()) newErrors.city = 'Informe a cidade';
      if (!state.trim()) newErrors.state = 'Informe o estado';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (paymentMethod === 'money' && needsChange) {
      if (!changeFor.trim()) {
        newErrors.changeFor = 'Informe o valor para o troco';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        // Save current customer state
        const currentCustomer = {
          name,
          phone,
          cep,
          street,
          number,
          neighborhood,
          city,
          state,
          complement,
          reference,
        };
        updateCustomer(currentCustomer);
        saveCustomerPermanently(currentCustomer);
        setStep(2);
      }
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
    }
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);

    const finalCustomer = {
      name,
      phone,
      cep,
      street,
      number,
      neighborhood,
      city,
      state,
      complement,
      reference,
    };

    // 1. Create order record
    const created = createOrder({
      customer: finalCustomer,
      deliveryType,
      items: cart,
      subtotal,
      deliveryFee,
      discount,
      total,
      paymentMethod,
      needsChange,
      changeFor: needsChange ? changeFor : undefined,
      observation: orderObservation.trim() || undefined,
    });

    // 2. Open WhatsApp with pre-filled message
    setTimeout(() => {
      openWhatsAppOrder(created);

      // 3. Clear cart and redirect to Orders
      clearCart();
      setIsSubmitting(false);
      setIsCheckoutOpen(false);
      setActiveTab('orders');
      showToast('🎉 Pedido enviado com sucesso para o WhatsApp!', 'success');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="bg-white w-full sm:max-w-xl max-h-[96vh] rounded-t-[32px] sm:rounded-[28px] overflow-hidden flex flex-col shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#370544] text-white p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            {step > 1 && (
              <button
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
                aria-label="Voltar etapa"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h2 className="text-base font-black font-['Outfit',sans-serif]">
                {step === 1 && 'Dados & Entrega'}
                {step === 2 && 'Pagamento & Detalhes'}
                {step === 3 && 'Confira seu Pedido'}
              </h2>
              <span className="text-[11px] text-purple-200">
                Etapa {step} de 3
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
            aria-label="Fechar checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper indicator */}
        <div className="bg-purple-950/10 px-4 py-2 flex items-center justify-between border-b border-zinc-100">
          {[
            { num: 1, label: 'Endereço' },
            { num: 2, label: 'Pagamento' },
            { num: 3, label: 'Confirmação' },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === s.num
                    ? 'bg-[#370544] text-amber-300'
                    : step > s.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-200 text-zinc-600'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className={`text-xs font-semibold ${step === s.num ? 'text-purple-950 font-bold' : 'text-zinc-500'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* STEP 1: DADOS DO CLIENTE & ENDEREÇO */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Delivery Type selector */}
              <div>
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide block mb-2">
                  Tipo de Entrega
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      deliveryType === 'delivery'
                        ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-600/30'
                        : 'border-zinc-200 bg-white hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                      <span>🛵</span> Entrega
                    </div>
                    <span className="text-xs text-purple-900 font-bold mt-1">
                      {STORE_CONFIG.deliveryFee === 0 ? 'Grátis' : formatCurrency(STORE_CONFIG.deliveryFee)}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      deliveryType === 'pickup'
                        ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-600/30'
                        : 'border-zinc-200 bg-white hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
                      <span>🏪</span> Retirada no Local
                    </div>
                    <span className="text-xs text-emerald-700 font-bold mt-1">
                      Taxa R$ 0,00
                    </span>
                  </button>
                </div>
              </div>

              {/* Informações da retirada se selecionado */}
              {deliveryType === 'pickup' && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <Store className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Retire seu pedido diretamente na loja:</p>
                    <p className="mt-0.5">{STORE_CONFIG.address}</p>
                    <p className="text-[11px] text-amber-700 mt-1">Tempo estimado: 20 a 30 minutos.</p>
                  </div>
                </div>
              )}

              {/* Dados Pessoais */}
              <div className="pt-2 border-t border-zinc-100 space-y-3">
                <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wide flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-800" />
                  Dados do Cliente
                </h3>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    Telefone / WhatsApp *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      placeholder="(66) 99999-9999"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <Phone className="w-4 h-4 text-zinc-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                  {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Endereço de Entrega se delivery */}
              {deliveryType === 'delivery' && (
                <div className="pt-2 border-t border-zinc-100 space-y-3">
                  <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wide flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-800" />
                    Endereço de Entrega
                  </h3>

                  {/* CEP Input with ViaCEP lookup */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-zinc-700">
                        CEP * (Busca automática)
                      </label>
                      {isLoadingCep && (
                        <span className="text-[11px] text-purple-700 flex items-center gap-1 font-semibold">
                          <Loader2 className="w-3 h-3 animate-spin" /> Buscando no ViaCEP...
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      maxLength={9}
                      value={cep}
                      onChange={(e) => handleCepChange(e.target.value)}
                      placeholder="78000-000"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    {cepStatusMsg && (
                      <p className={`text-[11px] mt-1 font-medium ${cepStatusMsg.includes('sucesso') ? 'text-emerald-600' : 'text-zinc-500'}`}>
                        {cepStatusMsg}
                      </p>
                    )}
                    {errors.cep && <p className="text-[11px] text-red-600 mt-1">{errors.cep}</p>}
                  </div>

                  {/* Rua & Número */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="text-xs font-semibold text-zinc-700 block mb-1">Rua / Logradouro *</label>
                      <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Ex: Rua das Palmeiras"
                        className="w-full text-xs sm:text-sm px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                      {errors.street && <p className="text-[11px] text-red-600 mt-1">{errors.street}</p>}
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-zinc-700 block mb-1">Número *</label>
                      <input
                        type="text"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="123"
                        className="w-full text-xs sm:text-sm px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                      {errors.number && <p className="text-[11px] text-red-600 mt-1">{errors.number}</p>}
                    </div>
                  </div>

                  {/* Bairro, Cidade, Estado */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-zinc-700 block mb-1">Bairro *</label>
                      <input
                        type="text"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        placeholder="Ex: Centro"
                        className="w-full text-xs sm:text-sm px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                      {errors.neighborhood && <p className="text-[11px] text-red-600 mt-1">{errors.neighborhood}</p>}
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      <div className="col-span-2">
                        <label className="text-xs font-semibold text-zinc-700 block mb-1">Cidade *</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full text-xs sm:text-sm px-2.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-zinc-700 block mb-1">UF *</label>
                        <input
                          type="text"
                          maxLength={2}
                          value={state}
                          onChange={(e) => setState(e.target.value.toUpperCase())}
                          className="w-full text-xs sm:text-sm px-2 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Complemento & Referência */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-zinc-700 block mb-1">Complemento</label>
                      <input
                        type="text"
                        value={complement}
                        onChange={(e) => setComplement(e.target.value)}
                        placeholder="Apto, Casa, Bloco"
                        className="w-full text-xs sm:text-sm px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-700 block mb-1">Ponto de Referência</label>
                      <input
                        type="text"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="Próximo à praça"
                        className="w-full text-xs sm:text-sm px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: FORMA DE PAGAMENTO & OBSERVAÇÕES */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide block mb-2">
                  Escolha a Forma de Pagamento
                </label>

                <div className="space-y-2">
                  {/* PIX */}
                  <label 
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-600/30'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-zinc-900 block">PIX</span>
                        <span className="text-xs text-zinc-500">Aprovação imediata e sem taxas</span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'pix'}
                      onChange={() => setPaymentMethod('pix')}
                      className="accent-purple-700 w-4 h-4"
                    />
                  </label>

                  {/* PIX Details preview */}
                  {paymentMethod === 'pix' && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                      <p className="font-bold mb-1">Chave PIX da loja ({STORE_CONFIG.pixKeyType}):</p>
                      <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-emerald-200 font-mono text-emerald-800 font-bold">
                        <span>{STORE_CONFIG.pixKey}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(STORE_CONFIG.pixKey);
                            showToast('Chave PIX copiada! 📋', 'info');
                          }}
                          className="text-[11px] text-purple-700 underline font-sans"
                        >
                          Copiar
                        </button>
                      </div>
                      <p className="text-[11px] text-emerald-700 mt-1">Beneficiário: {STORE_CONFIG.pixReceiverName}</p>
                    </div>
                  )}

                  {/* DINHEIRO */}
                  <label 
                    onClick={() => setPaymentMethod('money')}
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'money'
                        ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-600/30'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                        <Banknote className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-zinc-900 block">Dinheiro</span>
                        <span className="text-xs text-zinc-500">Pague no momento da entrega/retirada</span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'money'}
                      onChange={() => setPaymentMethod('money')}
                      className="accent-purple-700 w-4 h-4"
                    />
                  </label>

                  {/* Money Change Question */}
                  {paymentMethod === 'money' && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                      <p className="text-xs font-bold text-amber-900">Precisa de troco?</p>
                      <div className="flex items-center gap-4 text-xs font-semibold">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="change"
                            checked={!needsChange}
                            onChange={() => {
                              setNeedsChange(false);
                              setChangeFor('');
                            }}
                            className="accent-purple-700"
                          />
                          <span>Não preciso de troco</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="change"
                            checked={needsChange}
                            onChange={() => setNeedsChange(true)}
                            className="accent-purple-700"
                          />
                          <span>Sim</span>
                        </label>
                      </div>

                      {needsChange && (
                        <div className="pt-2">
                          <label className="text-xs font-semibold text-amber-900 block mb-1">
                            Troco para quanto?
                          </label>
                          <input
                            type="text"
                            value={changeFor}
                            onChange={(e) => setChangeFor(e.target.value)}
                            placeholder="Ex: R$ 50,00 ou R$ 100,00"
                            className="w-full text-xs px-3 py-2 bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-700 font-bold"
                          />
                          {errors.changeFor && <p className="text-[11px] text-red-600 mt-1">{errors.changeFor}</p>}
                        </div>
                      )}
                    </div>
                  )}

                  {/* CARTÃO NA ENTREGA */}
                  <label 
                    onClick={() => setPaymentMethod('card_delivery')}
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'card_delivery'
                        ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-600/30'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-zinc-900 block">Cartão na entrega</span>
                        <span className="text-xs text-zinc-500">Débito ou Crédito na maquininha</span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card_delivery'}
                      onChange={() => setPaymentMethod('card_delivery')}
                      className="accent-purple-700 w-4 h-4"
                    />
                  </label>

                  {/* CARTÃO PELO ESTABELECIMENTO */}
                  <label 
                    onClick={() => setPaymentMethod('card_machine')}
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'card_machine'
                        ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-600/30'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                        <Store className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-zinc-900 block">Cartão pelo estabelecimento</span>
                        <span className="text-xs text-zinc-500">Pagar diretamente no balcão</span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card_machine'}
                      onChange={() => setPaymentMethod('card_machine')}
                      className="accent-purple-700 w-4 h-4"
                    />
                  </label>
                </div>
              </div>

              {/* General order notes */}
              <div className="pt-2 border-t border-zinc-100">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide block mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-800" />
                  Alguma observação para o pedido?
                </label>
                <textarea
                  rows={2}
                  value={orderObservation}
                  onChange={(e) => setOrderObservation(e.target.value)}
                  placeholder='Ex: "Colocar pouco leite condensado", "Não colocar banana", "Tocar interfone 201"...'
                  className="w-full p-2.5 text-xs text-zinc-800 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>
          )}

          {/* STEP 3: RESUMO FINAL ("Confira seu pedido") */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center py-1">
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">Tudo pronto!</span>
                <h3 className="text-lg font-black text-zinc-900 font-['Outfit',sans-serif]">
                  Confira seu Pedido
                </h3>
              </div>

              {/* Customer and Delivery Card */}
              <div className="bg-zinc-50 rounded-2xl p-3.5 border border-zinc-200 space-y-2 text-xs">
                <div className="flex justify-between items-start border-b border-zinc-200 pb-2">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Cliente</span>
                    <p className="font-bold text-zinc-900">{name}</p>
                    <p className="text-zinc-600">{phone}</p>
                  </div>
                  <button 
                    onClick={() => setStep(1)} 
                    className="text-[11px] text-purple-700 font-bold underline"
                  >
                    Alterar
                  </button>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                    {deliveryType === 'delivery' ? 'Endereço de Entrega' : 'Retirada no Local'}
                  </span>
                  {deliveryType === 'delivery' ? (
                    <div className="text-zinc-800 font-medium">
                      <p className="font-bold">{street}, {number}</p>
                      <p>Bairro: {neighborhood} - {city}/{state}</p>
                      <p className="text-zinc-500">CEP: {cep}</p>
                      {complement && <p className="text-zinc-500">Compl: {complement}</p>}
                      {reference && <p className="text-zinc-500">Ref: {reference}</p>}
                    </div>
                  ) : (
                    <p className="font-bold text-zinc-800">{STORE_CONFIG.address}</p>
                  )}
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-zinc-50 rounded-2xl p-3.5 border border-zinc-200 space-y-2 text-xs">
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">Itens do Pedido</span>
                <div className="divide-y divide-zinc-200">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className="py-2 first:pt-0 last:pb-0">
                      <div className="flex justify-between font-bold text-zinc-900">
                        <span>{item.quantity}x {item.name} ({item.size.name})</span>
                        <span>{formatCurrency(item.totalPrice)}</span>
                      </div>
                      {item.toppings && item.toppings.length > 0 && (
                        <p className="text-zinc-500 text-[11px] mt-0.5">
                          + {item.toppings.map(t => t.name).join(', ')}
                        </p>
                      )}
                      {item.observation && (
                        <p className="text-amber-800 text-[10px] italic">
                          Obs: {item.observation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Observations Card */}
              <div className="bg-zinc-50 rounded-2xl p-3.5 border border-zinc-200 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Forma de Pagamento</span>
                    <p className="font-bold text-zinc-900">
                      {paymentMethod === 'pix' && 'PIX'}
                      {paymentMethod === 'money' && (needsChange ? `Dinheiro (Troco para ${changeFor})` : 'Dinheiro (Sem troco)')}
                      {paymentMethod === 'card_delivery' && 'Cartão na Entrega'}
                      {paymentMethod === 'card_machine' && 'Cartão pelo Estabelecimento'}
                    </p>
                  </div>
                  <button 
                    onClick={() => setStep(2)} 
                    className="text-[11px] text-purple-700 font-bold underline"
                  >
                    Alterar
                  </button>
                </div>

                {orderObservation && (
                  <div className="pt-2 border-t border-zinc-200">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">Observação</span>
                    <p className="text-zinc-700 italic">"{orderObservation}"</p>
                  </div>
                )}
              </div>

              {/* Price summary */}
              <div className="bg-purple-50/70 rounded-2xl p-3.5 border border-purple-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Taxa de entrega</span>
                  <span className={`font-semibold ${deliveryFee === 0 ? 'text-emerald-700' : 'text-zinc-900'}`}>
                    {deliveryFee === 0 ? 'Grátis' : formatCurrency(deliveryFee)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Desconto</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-purple-200 flex justify-between text-base font-black text-zinc-900 font-['Outfit',sans-serif]">
                  <span>Total</span>
                  <span className="text-[#370544] text-lg font-black">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-200 bg-white shadow-lg">
          {step < 3 ? (
            <button
              id="btn-checkout-step-next"
              type="button"
              onClick={handleNextStep}
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-purple-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-amber-400/20 transition-all font-['Outfit',sans-serif]"
            >
              <span>CONTINUAR</span>
            </button>
          ) : (
            <button
              id="btn-send-order-whatsapp"
              type="button"
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 active:scale-[0.98] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-emerald-500/25 transition-all font-['Outfit',sans-serif]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>PREPARANDO SEU PEDIDO...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>ENVIAR PEDIDO PELO WHATSAPP</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
