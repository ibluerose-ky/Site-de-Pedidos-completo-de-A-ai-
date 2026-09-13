import { Order } from '../types';
import { STORE_CONFIG } from '../config/store';
import { formatCurrency } from './formatters';

export function generateWhatsAppMessage(order: Order): string {
  const lines: string[] = [];

  lines.push(`🍇 *NOVO PEDIDO #${order.orderNumber} - ${STORE_CONFIG.name.toUpperCase()}*`);
  lines.push('');
  lines.push('👤 *CLIENTE*');
  lines.push(`Nome: ${order.customer.name}`);
  lines.push(`WhatsApp: ${order.customer.phone}`);
  lines.push('');

  lines.push('📦 *PEDIDO*');
  lines.push('');

  order.items.forEach((item) => {
    lines.push(`${item.quantity}x ${item.name} (${item.size.name}) - ${formatCurrency(item.totalPrice)}`);
    if (item.toppings && item.toppings.length > 0) {
      item.toppings.forEach((top) => {
        lines.push(`  • ${top.name}${top.price > 0 ? ` (+${formatCurrency(top.price)})` : ''}`);
      });
    }
    if (item.observation && item.observation.trim()) {
      lines.push(`  ↳ Obs: ${item.observation.trim()}`);
    }
    lines.push('');
  });

  lines.push('💰 *VALORES*');
  lines.push(`Subtotal: ${formatCurrency(order.subtotal)}`);
  if (order.deliveryType === 'delivery') {
    lines.push(`Taxa de entrega: ${formatCurrency(order.deliveryFee)}`);
  } else {
    lines.push(`Taxa de entrega: Grátis (Retirada no local)`);
  }
  if (order.discount > 0) {
    lines.push(`Desconto cupom: -${formatCurrency(order.discount)}`);
  }
  lines.push(`*TOTAL: ${formatCurrency(order.total)}*`);
  lines.push('');

  if (order.deliveryType === 'delivery') {
    lines.push('🛵 *ENTREGA*');
    lines.push(`${order.customer.street}, ${order.customer.number}`);
    lines.push(`Bairro: ${order.customer.neighborhood}`);
    lines.push(`Cidade: ${order.customer.city} - ${order.customer.state}`);
    lines.push(`CEP: ${order.customer.cep}`);
    if (order.customer.complement && order.customer.complement.trim()) {
      lines.push(`Complemento: ${order.customer.complement.trim()}`);
    }
    if (order.customer.reference && order.customer.reference.trim()) {
      lines.push(`Referência: ${order.customer.reference.trim()}`);
    }
  } else {
    lines.push('🏪 *RETIRADA NO LOCAL*');
    lines.push(`Retirar na loja: ${STORE_CONFIG.address}`);
    lines.push(`Previsão: 20 a 30 minutos`);
  }
  lines.push('');

  lines.push('💳 *PAGAMENTO*');
  let paymentText = '';
  switch (order.paymentMethod) {
    case 'pix':
      paymentText = 'PIX';
      break;
    case 'money':
      if (order.needsChange && order.changeFor) {
        paymentText = `Dinheiro (Levar troco para ${order.changeFor})`;
      } else {
        paymentText = 'Dinheiro (Não precisa de troco)';
      }
      break;
    case 'card_delivery':
      paymentText = 'Cartão na entrega (Maquininha)';
      break;
    case 'card_machine':
      paymentText = 'Cartão pelo estabelecimento';
      break;
    default:
      paymentText = 'A combinar';
  }
  lines.push(paymentText);
  lines.push('');

  if (order.observation && order.observation.trim()) {
    lines.push('📝 *OBSERVAÇÃO*');
    lines.push(order.observation.trim());
    lines.push('');
  }

  lines.push('Obrigado! ❤️');

  return lines.join('\n');
}

export function openWhatsAppOrder(order: Order, customNumber?: string): void {
  const number = (customNumber || STORE_CONFIG.whatsapp).replace(/\D/g, '');
  const message = generateWhatsAppMessage(order);
  const encodedText = encodeURIComponent(message);
  
  // Try wa.me standard link
  const url = `https://wa.me/${number}?text=${encodedText}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
