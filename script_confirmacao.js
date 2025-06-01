document.addEventListener('DOMContentLoaded', () => {
  // Elementos da página
  const orderNumber = document.getElementById('order-number');
  const paymentMethod = document.getElementById('payment-method');
  const totalAmount = document.getElementById('total-amount');

  // Recuperar informações do pedido
  const orderId = sessionStorage.getItem('currentOrderId');
  const method = sessionStorage.getItem('paymentMethod');
  const total = sessionStorage.getItem('totalAmount');

  // Formatar método de pagamento
  const formatPaymentMethod = (method) => {
    switch (method) {
      case 'card':
        return '<i class="fa-solid fa-credit-card"></i> Cartão de Crédito/Débito';
      case 'mbway':
        return '<i class="fa-solid fa-mobile-screen"></i> MB WAY';
      case 'paypal':
        return '<i class="fa-brands fa-paypal"></i> PayPal';
      default:
        return 'Não especificado';
    }
  };

  // Exibir informações
  if (orderNumber) {
    // Formatar número do pedido para melhor legibilidade
    const formattedOrderId = orderId ? 
      orderId.split('-')[0].match(/.{1,4}/g).join(' ') : 
      'N/A';
    orderNumber.textContent = formattedOrderId;
  }

  if (paymentMethod) {
    paymentMethod.innerHTML = formatPaymentMethod(method);
  }

  if (totalAmount) {
    // Garantir que o total está formatado corretamente
    const formattedTotal = total ? 
      total.includes('€') ? total : `€${parseFloat(total).toFixed(2)}` :
      '€0,00';
    totalAmount.textContent = formattedTotal.replace('.', ',');
  }

  // Limpar dados da sessão após exibição
  sessionStorage.removeItem('currentOrderId');
  sessionStorage.removeItem('paymentMethod');
  sessionStorage.removeItem('totalAmount');

  // Animação de confete ao carregar a página
  const duration = 15 * 1000;
  const animationEnd = Date.now() + duration;
  let skew = 1;

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  (function frame() {
    const timeLeft = animationEnd - Date.now();
    const ticks = Math.max(200, 500 * (timeLeft / duration));

    skew = Math.max(0.8, skew - 0.001);

    confetti({
      particleCount: 1,
      startVelocity: 0,
      ticks: ticks,
      origin: {
        x: Math.random(),
        y: (Math.random() * skew) - 0.2
      },
      colors: ['#0071c2', '#00a1d6', '#4CAF50', '#FFC107'],
      shapes: ['circle', 'square'],
      gravity: randomInRange(0.4, 0.6),
      scalar: randomInRange(0.8, 1.2),
      drift: randomInRange(-0.4, 0.4)
    });

    if (timeLeft > 0) {
      requestAnimationFrame(frame);
    }
  }());
}); 