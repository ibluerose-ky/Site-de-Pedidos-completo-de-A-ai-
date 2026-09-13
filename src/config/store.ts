import { StoreConfig } from '../types';

/**
 * CONFIGURAÇÃO CENTRAL DA LOJA
 * Altere estas informações conforme necessário para personalizar a loja.
 */
export const STORE_CONFIG: StoreConfig = {
  name: "Açaí na Tigela",
  tagline: "O açaí mais cremoso e refrescante da cidade",
  // Número de WhatsApp da loja (com DDI e DDD, apenas números)
  // Exemplo: 5599999999999 ou 5566999999999
  whatsapp: "5566999999999",
  displayPhone: "(66) 99999-9999",
  instagram: "@acainatigela_oficial",
  deliveryFee: 5.00,
  freeDeliveryThreshold: 70.00,
  minimumOrder: 15.00,
  city: "Cuiabá",
  state: "MT",
  address: "Rua das Palmeiras, 123 - Centro",
  openingHours: "Todos os dias: 13:00 às 23:00",
  pixKey: "pix@acainatigela.com.br",
  pixKeyType: "E-mail",
  pixReceiverName: "Açaí na Tigela Ltda",
};

export const COUPONS: Record<string, { code: string; discount: number; type: 'percentage' | 'fixed'; minSubtotal: number; description: string }> = {
  'PRIMEIRACOMPRA': {
    code: 'PRIMEIRACOMPRA',
    discount: 10,
    type: 'percentage',
    minSubtotal: 25,
    description: '10% de desconto na primeira compra'
  },
  'VERAOACAI': {
    code: 'VERAOACAI',
    discount: 5.00,
    type: 'fixed',
    minSubtotal: 30,
    description: 'R$ 5,00 OFF em pedidos acima de R$ 30'
  },
  'FRETEGRATIS': {
    code: 'FRETEGRATIS',
    discount: 5.00,
    type: 'fixed',
    minSubtotal: 40,
    description: 'Frete Grátis acima de R$ 40'
  }
};
