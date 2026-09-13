import React, { useState } from 'react';
import { User, Phone, MapPin, Save, Check, Loader2, Store } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchAddressByCep } from '../utils/cep';
import { formatPhone, formatCep } from '../utils/formatters';

export const Profile: React.FC = () => {
  const { customer, saveCustomerPermanently, setIsAdminOpen } = useApp();

  const [name, setName] = useState(customer.name || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [cep, setCep] = useState(customer.cep || '');
  const [street, setStreet] = useState(customer.street || '');
  const [number, setNumber] = useState(customer.number || '');
  const [neighborhood, setNeighborhood] = useState(customer.neighborhood || '');
  const [city, setCity] = useState(customer.city || '');
  const [state, setState] = useState(customer.state || '');
  const [complement, setComplement] = useState(customer.complement || '');
  const [reference, setReference] = useState(customer.reference || '');

  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepMsg, setCepMsg] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleCepChange = async (val: string) => {
    const formatted = formatCep(val);
    setCep(formatted);
    setCepMsg('');

    const clean = formatted.replace(/\D/g, '');
    if (clean.length === 8) {
      setIsLoadingCep(true);
      const res = await fetchAddressByCep(clean);
      setIsLoadingCep(false);
      if (res.error) {
        setCepMsg(res.error);
      } else {
        if (res.street) setStreet(res.street);
        if (res.neighborhood) setNeighborhood(res.neighborhood);
        if (res.city) setCity(res.city);
        if (res.state) setState(res.state);
        setCepMsg('Endereço localizado via CEP! ✅');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveCustomerPermanently({
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
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="px-4 max-w-xl mx-auto py-4 pb-28">
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-black text-zinc-900 font-['Outfit',sans-serif]">
          Meu Perfil & Endereço
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Mantenha seus dados salvos para agilizar seus próximos pedidos no delivery
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Details */}
        <div className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-sm space-y-3">
          <h2 className="text-xs font-bold text-zinc-700 uppercase tracking-wide flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-purple-800" />
            Dados Pessoais
          </h2>

          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1">
              Telefone / WhatsApp
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
          </div>
        </div>

        {/* Address Details */}
        <div className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-sm space-y-3">
          <h2 className="text-xs font-bold text-zinc-700 uppercase tracking-wide flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-purple-800" />
            Endereço de Entrega Principal
          </h2>

          {/* CEP with lookup */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-zinc-700">CEP</label>
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
            {cepMsg && (
              <p className={`text-[11px] mt-1 font-medium ${cepMsg.includes('sucesso') ? 'text-emerald-600' : 'text-zinc-500'}`}>
                {cepMsg}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-zinc-700 block mb-1">Rua / Logradouro</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Rua das Palmeiras"
                className="w-full text-xs sm:text-sm px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1">Número</label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="123"
                className="w-full text-xs sm:text-sm px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1">Bairro</label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Centro"
                className="w-full text-xs sm:text-sm px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <div className="col-span-2">
                <label className="text-xs font-semibold text-zinc-700 block mb-1">Cidade</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs sm:text-sm px-2.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">UF</label>
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

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1">Complemento</label>
              <input
                type="text"
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
                placeholder="Apto 102, Bloco B"
                className="w-full text-xs sm:text-sm px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1">Ponto de Referência</label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Próximo à padaria"
                className="w-full text-xs sm:text-sm px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>
        </div>

        {/* Submit button */}
        <button
          id="btn-save-profile"
          type="submit"
          className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-purple-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-amber-400/20 transition-all font-['Outfit',sans-serif]"
        >
          {savedSuccess ? (
            <>
              <Check className="w-5 h-5 text-purple-950" />
              <span>DADOS SALVOS COM SUCESSO!</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>USAR ESTE ENDEREÇO & SALVAR</span>
            </>
          )}
        </button>

        {/* Quick link to admin */}
        <div className="pt-3 text-center">
          <button
            type="button"
            onClick={() => setIsAdminOpen(true)}
            className="text-xs font-bold text-purple-800 hover:text-purple-950 underline inline-flex items-center gap-1"
          >
            <Store className="w-3.5 h-3.5" />
            Acessar Painel do Lojista (Administração de Pedidos)
          </button>
        </div>
      </form>
    </div>
  );
};
