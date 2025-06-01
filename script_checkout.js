document.addEventListener("DOMContentLoaded", () => {
  const paymentForm = document.getElementById("payment-form");
  const paymentMessage = document.getElementById("payment-message");
  const itensCheckout = document.getElementById("itens-checkout");
  const subtotalEl = document.getElementById("subtotal");
  const ivaEl = document.getElementById("iva");
  const totalEl = document.getElementById("total");

  // Classes de validação
  class FormValidator {
    constructor(form) {
      this.form = form;
      this.errors = new Map();
      this.rules = {
        cardNumber: {
          minLength: 13,
          maxLength: 19,
          pattern: /^[0-9\s]+$/,
          message: 'Número de cartão inválido'
        },
        cardName: {
          minLength: 5,
          maxLength: 100,
          pattern: /^[A-Za-zÀ-ÿ\s]+$/,
          message: 'Nome deve conter apenas letras e espaços'
        },
        cardExpiry: {
          pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
          message: 'Data inválida (MM/AA)'
        },
        cardCVC: {
          minLength: 3,
          maxLength: 4,
          pattern: /^[0-9]+$/,
          message: 'CVC/CVV inválido'
        },
        phoneNumber: {
          pattern: /^9[1236][0-9]{7}$/,
          message: 'Número de telemóvel inválido'
        }
      };
    }

    addError(field, message) {
      const errorElement = field.parentElement.querySelector('.error-message');
      if (errorElement) {
        errorElement.textContent = message;
        field.setAttribute('aria-invalid', 'true');
        field.classList.add('invalid');
        this.errors.set(field, message);

        // Adicionar animação de shake
        field.classList.add('shake');
        setTimeout(() => field.classList.remove('shake'), 500);

        // Atualizar estilo do wrapper para MB WAY
        if (field.id === 'phone-number') {
          const wrapper = field.closest('.phone-wrapper');
          if (wrapper) wrapper.classList.add('invalid');
        }
      }
    }

    clearError(field) {
      const errorElement = field.parentElement.querySelector('.error-message');
      if (errorElement) {
        errorElement.textContent = '';
        field.removeAttribute('aria-invalid');
        field.classList.remove('invalid');
        this.errors.delete(field);

        // Limpar estilo do wrapper para MB WAY
        if (field.id === 'phone-number') {
          const wrapper = field.closest('.phone-wrapper');
          if (wrapper) wrapper.classList.remove('invalid');
        }
      }
    }

    clearAllErrors() {
      this.form.querySelectorAll('.error-message').forEach(error => error.textContent = '');
      this.form.querySelectorAll('[aria-invalid]').forEach(field => {
        field.removeAttribute('aria-invalid');
        field.classList.remove('invalid');
      });
      this.errors.clear();
    }

    hasErrors() {
      return this.errors.size > 0;
    }

    validateCardNumber(number) {
      const digits = number.replace(/\D/g, '');
      
      // Verificar comprimento
      if (digits.length < this.rules.cardNumber.minLength || 
          digits.length > this.rules.cardNumber.maxLength) {
        return false;
      }

      // Algoritmo de Luhn
      let sum = 0;
      let isEven = false;

      for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i]);

        if (isEven) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }

        sum += digit;
        isEven = !isEven;
      }

      return sum % 10 === 0;
    }

    validateCardName(name) {
      // Verificar se tem pelo menos duas palavras
      const words = name.trim().split(/\s+/);
      if (words.length < 2) return false;

      // Verificar comprimento de cada palavra
      if (words.some(word => word.length < 2)) return false;

      // Verificar caracteres permitidos
      return this.rules.cardName.pattern.test(name) &&
             name.length >= this.rules.cardName.minLength &&
             name.length <= this.rules.cardName.maxLength;
    }

    validateExpiry(expiry) {
      if (!this.rules.cardExpiry.pattern.test(expiry)) return false;

      const [month, year] = expiry.split('/').map(Number);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      // Verificar se o ano é válido (não mais que 10 anos no futuro)
      if (year < currentYear || year > currentYear + 10) return false;

      // Se for o ano atual, verificar se o mês é válido
      if (year === currentYear && month < currentMonth) return false;

      return true;
    }

    validateCVC(cvc, cardType) {
      const expectedLength = cardType === 'amex' ? 4 : 3;
      return cvc.length === expectedLength && this.rules.cardCVC.pattern.test(cvc);
    }

    validatePhoneNumber(number) {
      const digits = number.replace(/\D/g, '');
      
      // Verificar se é um número português válido
      if (!this.rules.phoneNumber.pattern.test(digits)) return false;

      // Verificar prefixos específicos
      const prefix = digits.substring(0, 2);
      const validPrefixes = ['91', '92', '93', '96'];
      return validPrefixes.includes(prefix);
    }
  }

  // Classes de pagamento
  class PaymentProcessor {
    constructor(onSuccess, onError) {
      this.onSuccess = onSuccess;
      this.onError = onError;
    }

    async process() {
      throw new Error('Método process deve ser implementado nas classes filhas');
    }
  }

  class CardPaymentProcessor extends PaymentProcessor {
    constructor(cardData, onSuccess, onError) {
      super(onSuccess, onError);
      this.cardData = cardData;
    }

    async process() {
      try {
        // Simulação de processamento do cartão
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulação de sucesso (90% de chance)
        if (Math.random() < 0.9) {
          this.onSuccess();
        } else {
          throw new Error('Cartão recusado');
        }
      } catch (error) {
        this.onError(error.message);
      }
    }
  }

  class MBWayPaymentProcessor extends PaymentProcessor {
    constructor(phoneNumber, onSuccess, onError) {
      super(onSuccess, onError);
      this.phoneNumber = phoneNumber;
      this.modal = document.getElementById('mbway-modal');
      this.timerElement = document.getElementById('mbway-timer');
      this.timeoutDuration = 5 * 60 * 1000; // 5 minutos
      this.setupModal();
    }

    setupModal() {
      const closeButton = this.modal.querySelector('.modal-close');
      closeButton.addEventListener('click', () => this.closeModal());
    }

    showModal() {
      this.modal.style.display = 'flex';
      this.startTimer();
    }

    closeModal() {
      this.modal.style.display = 'none';
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
    }

    startTimer() {
      let timeLeft = this.timeoutDuration;
      const startTime = Date.now();

      this.timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        timeLeft = this.timeoutDuration - elapsed;

        if (timeLeft <= 0) {
          clearInterval(this.timerInterval);
          this.closeModal();
          this.onError('Tempo limite excedido');
          return;
        }

        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        this.timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      }, 1000);
    }

    async process() {
      try {
        this.showModal();

        // Simulação de aprovação após 3 segundos
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        this.closeModal();
        this.onSuccess();
      } catch (error) {
        this.closeModal();
        this.onError(error.message);
      }
    }
  }

  class PayPalPaymentProcessor extends PaymentProcessor {
    async process() {
      try {
        // Salvar informações do pedido
        const total = document.getElementById('total').textContent;
        const orderId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        sessionStorage.setItem('currentOrderId', orderId);
        sessionStorage.setItem('paymentMethod', 'paypal');
        sessionStorage.setItem('totalAmount', total);

        // Abrir PayPal em nova aba
        window.open('https://www.paypal.com/signin', '_blank');

        // Simular processamento por 5 segundos
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Limpar carrinho
        localStorage.removeItem('carrinhoItens');
        localStorage.removeItem('cart');

        // Adicionar overlay de sucesso antes do redirecionamento
        const successOverlay = document.createElement('div');
        successOverlay.className = 'success-overlay';
        successOverlay.innerHTML = `
          <div class="success-content">
            <i class="fa-solid fa-circle-check"></i>
            <h2>Pagamento Confirmado!</h2>
            <p>Redirecionando...</p>
          </div>
        `;
        document.body.appendChild(successOverlay);

        // Aguardar a animação do overlay e redirecionar
        setTimeout(() => {
          window.location.href = 'confirmacao.html';
        }, 2000);

        this.onSuccess();
      } catch (error) {
        this.onError(error.message);
      }
    }
  }

  // Gerenciador do checkout
  class CheckoutManager {
    constructor() {
      this.form = document.getElementById('payment-form');
      this.validator = new FormValidator(this.form);
      this.statusElement = document.getElementById('payment-status');
      this.submitButton = this.form.querySelector('button[type="submit"]');
      this.setupEventListeners();
      this.loadCartItems();
      this.setupTooltips();
      this.setupRealtimeValidation();
    }

    setupEventListeners() {
      // Alternar métodos de pagamento
      const methodInputs = this.form.querySelectorAll('input[name="payment-method"]');
      methodInputs.forEach(input => {
        input.addEventListener('change', () => this.togglePaymentMethod(input.value));
      });

      // Validação de campos do cartão
      const cardNumber = document.getElementById('card-number');
      if (cardNumber) {
        cardNumber.addEventListener('input', (e) => this.formatCardNumber(e.target));
      }

      const cardExpiry = document.getElementById('card-expiry');
      if (cardExpiry) {
        cardExpiry.addEventListener('input', (e) => this.formatCardExpiry(e.target));
      }

      const cardCVC = document.getElementById('card-cvc');
      if (cardCVC) {
        cardCVC.addEventListener('input', (e) => this.formatCardCVC(e.target));
      }

      // Validação do número de telefone MB WAY
      const phoneNumber = document.getElementById('phone-number');
      if (phoneNumber) {
        phoneNumber.addEventListener('input', (e) => this.formatPhoneNumber(e.target));
      }

      // Submissão do formulário
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    togglePaymentMethod(method) {
      const sections = {
        card: document.getElementById('card-form'),
        mbway: document.getElementById('mbway-form'),
        paypal: document.getElementById('paypal-form')
      };

      Object.values(sections).forEach(section => {
        if (section) {
          section.style.display = 'none';
        }
      });

      const selectedSection = sections[method];
      if (selectedSection) {
        selectedSection.style.display = 'block';
      }

      this.validator.clearAllErrors();
    }

    formatCardNumber(input) {
      let value = input.value.replace(/\D/g, '');
      
      // Detectar bandeira do cartão
      const cardType = this.detectCardType(value);
      
      // Aplicar formatação específica para cada bandeira
      if (cardType === 'amex') {
        value = value.replace(/(\d{4})(\d{6})?(\d{5})?/, '$1 $2 $3').trim();
        value = value.slice(0, 17); // AMEX tem 15 dígitos + 2 espaços
      } else {
        value = value.replace(/(\d{4})/g, '$1 ').trim();
        value = value.slice(0, 19); // Outros cartões têm 16 dígitos + 3 espaços
      }
      
      input.value = value;
      input.classList.toggle('formatted-input', value.length > 0);

      const iconElement = input.parentElement.querySelector('.card-type-icon');
      if (iconElement) {
        iconElement.className = cardType ? `card-type-icon fa-brands fa-cc-${cardType}` : 'card-type-icon';
        
        if (cardType) {
          iconElement.classList.add('card-icon-animate');
          setTimeout(() => iconElement.classList.remove('card-icon-animate'), 500);
        }
      }
    }

    formatCardExpiry(input) {
      let value = input.value.replace(/\D/g, '');
      
      // Limitar mês a 12
      if (value.length >= 2) {
        let month = parseInt(value.substring(0, 2));
        if (month > 12) month = 12;
        if (month < 1) month = 1;
        value = month.toString().padStart(2, '0') + value.substring(2);
      }
      
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
      
      input.value = value.slice(0, 5);
      input.classList.toggle('formatted-input', value.length > 0);
    }

    formatCardCVC(input) {
      let value = input.value.replace(/\D/g, '');
      const cardType = this.detectCardType(document.getElementById('card-number').value);
      const maxLength = cardType === 'amex' ? 4 : 3;
      
      input.value = value.slice(0, maxLength);
      input.classList.toggle('formatted-input', value.length > 0);
    }

    formatPhoneNumber(input) {
      let value = input.value.replace(/\D/g, '');
      
      // Formatar como XXX XXX XXX
      if (value.length > 0) {
        value = value.match(/.{1,3}/g).join(' ');
      }
      
      input.value = value.slice(0, 11); // 9 dígitos + 2 espaços
      input.classList.toggle('formatted-input', value.length > 0);

      // Atualizar estilo do wrapper
      const wrapper = input.closest('.phone-wrapper');
      if (wrapper) {
        wrapper.classList.toggle('has-value', value.length > 0);
      }
    }

    detectCardType(number) {
      const patterns = {
        visa: /^4/,
        mastercard: /^5[1-5]/,
        amex: /^3[47]/
      };

      for (const [type, pattern] of Object.entries(patterns)) {
        if (pattern.test(number)) return type;
      }
      return null;
    }

    validateCard() {
      const cardNumber = document.getElementById('card-number');
      const cardName = document.getElementById('card-name');
      const cardExpiry = document.getElementById('card-expiry');
      const cardCVC = document.getElementById('card-cvc');

      this.validator.clearAllErrors();

      if (!cardNumber.value.trim()) {
        this.validator.addError(cardNumber, 'Número do cartão é obrigatório');
      } else if (!this.validator.validateCardNumber(cardNumber.value)) {
        this.validator.addError(cardNumber, 'Número do cartão inválido');
      }

      if (!cardName.value.trim()) {
        this.validator.addError(cardName, 'Nome no cartão é obrigatório');
      } else if (!this.validator.validateCardName(cardName.value)) {
        this.validator.addError(cardName, 'Digite o nome completo como aparece no cartão');
      }

      if (!cardExpiry.value.trim()) {
        this.validator.addError(cardExpiry, 'Data de validade é obrigatória');
      } else if (!this.validator.validateExpiry(cardExpiry.value)) {
        this.validator.addError(cardExpiry, 'Data de validade inválida ou expirada');
      }

      if (!cardCVC.value.trim()) {
        this.validator.addError(cardCVC, 'CVV/CVC é obrigatório');
      } else {
        const cardType = this.detectCardType(cardNumber.value.replace(/\s/g, ''));
        const cvcLength = cardType === 'amex' ? 4 : 3;
        if (!cardCVC.value.match(new RegExp(`^[0-9]{${cvcLength}}$`))) {
          this.validator.addError(cardCVC, `CVV/CVC deve ter ${cvcLength} dígitos`);
        }
      }

      return !this.validator.hasErrors();
    }

    validateMBWay() {
      const phoneNumber = document.getElementById('phone-number');
      this.validator.clearAllErrors();

      if (!phoneNumber.value.trim()) {
        this.validator.addError(phoneNumber, 'Número de telemóvel é obrigatório');
      } else if (!this.validator.validatePhoneNumber(phoneNumber.value)) {
        this.validator.addError(phoneNumber, 'Número de telemóvel inválido');
      }

      return !this.validator.hasErrors();
    }

    showStatus(message, type = 'info') {
      this.statusElement.textContent = message;
      this.statusElement.className = `payment-status ${type}`;
      this.statusElement.style.display = 'block';

      // Adicionar animação
      this.statusElement.classList.add('status-animate');
      setTimeout(() => this.statusElement.classList.remove('status-animate'), 500);
    }

    async handleSubmit(e) {
      e.preventDefault();
      this.submitButton.disabled = true;
      this.showLoadingState(true);

      try {
        const method = this.form.querySelector('input[name="payment-method"]:checked').value;
        let isValid = false;
        let processor = null;

        switch (method) {
          case 'card':
            isValid = this.validateCard();
            if (isValid) {
              const cardData = {
                number: document.getElementById('card-number').value,
                name: document.getElementById('card-name').value,
                expiry: document.getElementById('card-expiry').value,
                cvc: document.getElementById('card-cvc').value
              };
              processor = new CardPaymentProcessor(
                cardData,
                () => this.onPaymentSuccess(),
                (error) => this.onPaymentError(error)
              );
            }
            break;

          case 'mbway':
            isValid = this.validateMBWay();
            if (isValid) {
              const phoneNumber = document.getElementById('phone-number').value;
              processor = new MBWayPaymentProcessor(
                phoneNumber,
                () => this.onPaymentSuccess(),
                (error) => this.onPaymentError(error)
              );
            }
            break;

          case 'paypal':
            isValid = true;
            processor = new PayPalPaymentProcessor(
              () => this.onPaymentSuccess(),
              (error) => this.onPaymentError(error)
            );
            break;
        }

        if (isValid && processor) {
          await processor.process();
        } else {
          this.showLoadingState(false);
        }
      } catch (error) {
        this.onPaymentError(error.message);
      }
    }

    showLoadingState(loading) {
      if (loading) {
        this.submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processando...';
        this.submitButton.disabled = true;
      } else {
        this.submitButton.innerHTML = '<i class="fa-solid fa-lock"></i> Pagar de Forma Segura';
        this.submitButton.disabled = false;
      }
    }

    onPaymentSuccess() {
      this.showStatus('Pagamento realizado com sucesso!', 'success');
      
      // Salvar informações do pedido
      const total = document.getElementById('total').textContent;
      const orderId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const method = this.form.querySelector('input[name="payment-method"]:checked').value;
      
      sessionStorage.setItem('currentOrderId', orderId);
      sessionStorage.setItem('paymentMethod', method);
      sessionStorage.setItem('totalAmount', total);

      // Limpar carrinho
      localStorage.removeItem('carrinhoItens');
      localStorage.removeItem('cart');

      // Adicionar animação de sucesso antes do redirecionamento
      const successOverlay = document.createElement('div');
      successOverlay.className = 'success-overlay';
      successOverlay.innerHTML = `
        <div class="success-content">
          <i class="fa-solid fa-circle-check"></i>
          <h2>Pagamento Confirmado!</h2>
          <p>Redirecionando...</p>
        </div>
      `;
      document.body.appendChild(successOverlay);

      setTimeout(() => {
        window.location.href = 'confirmacao.html';
      }, 2000);
    }

    onPaymentError(error) {
      this.showStatus(error || 'Erro ao processar pagamento. Tente novamente.', 'error');
      this.showLoadingState(false);
    }

    loadCartItems() {
      const itemsList = document.getElementById('items-list');
      const subtotalEl = document.getElementById('subtotal');
      const totalEl = document.getElementById('total');
      const descontoEl = document.getElementById('desconto');
      
      const carrinhoItens = JSON.parse(localStorage.getItem('carrinhoItens')) || [];
      const desconto = parseFloat(localStorage.getItem('desconto')) || 0;

      if (carrinhoItens.length === 0) {
        itemsList.innerHTML = `
          <div class="empty-cart">
            <p>O seu carrinho está vazio.</p>
            <p>Adicione voos ou pacotes para continuar.</p>
          </div>
        `;
        this.form.style.display = 'none';
        return;
      }

      itemsList.innerHTML = carrinhoItens.map(item => {
        let detalhesHTML = '';
        
        switch(item.tipo) {
          case 'voo':
            detalhesHTML = `
              <p>Data Ida: <strong>${item.dataIda}</strong></p>
              ${item.dataVolta ? `<p>Data Volta: <strong>${item.dataVolta}</strong></p>` : ''}
              <p>Passageiros: ${item.adultos} adulto(s)${item.criancas ? `, ${item.criancas} criança(s)` : ''}${item.bebes ? `, ${item.bebes} bebé(s)` : ''}</p>
              <p>Classe: ${item.classe}</p>
            `;
            break;
          
          case 'hotel':
            detalhesHTML = `
              <p>Check-in: <strong>${item.dataIda}</strong></p>
              <p>Check-out: <strong>${item.dataVolta}</strong></p>
              <p>Quarto: ${item.quarto}</p>
              <p>Noites: ${item.noites}</p>
              <p>Passageiros: ${item.adultos} adulto(s)${item.criancas ? `, ${item.criancas} criança(s)` : ''}</p>
            `;
            break;
          
          case 'pacote':
            detalhesHTML = `
              <p>Hotel: ${item.hotelNome}</p>
              <p>Voo: ${item.origem} → ${item.destino}</p>
              <p>Data Ida: <strong>${item.dataIda}</strong></p>
              <p>Data Volta: <strong>${item.dataVolta}</strong></p>
              <p>Passageiros: ${item.adultos} adulto(s)${item.criancas ? `, ${item.criancas} criança(s)` : ''}${item.bebes ? `, ${item.bebes} bebé(s)` : ''}</p>
            `;
            break;
          
          case 'promocao':
            detalhesHTML = `
              <p>${item.descricao}</p>
              <p>Data Ida: <strong>${item.dataIda}</strong></p>
              ${item.dataVolta ? `<p>Data Volta: <strong>${item.dataVolta}</strong></p>` : ''}
              <p>Passageiros: ${item.passageiros}</p>
              <div class="preco-info">
                <p class="preco-original">Preço Original: ${this.formatPrice(item.precoOriginal)}</p>
                <p class="economia">Economia: ${this.formatPrice(item.precoOriginal - item.preco)}</p>
              </div>
            `;
            break;
        }

        return `
          <div class="order-item">
            <img src="${item.imagem}" alt="${item.tipo === 'voo' ? 'Voo' : item.nome}" class="item-image">
            <div class="item-details">
              <h3 class="item-title">
                ${item.tipo === 'voo' ? `Voo ${item.origem} → ${item.destino}` : item.nome}
                ${item.quantidade > 1 ? `<span class="quantidade">x${item.quantidade}</span>` : ''}
              </h3>
              <div class="item-info">
                ${detalhesHTML}
              </div>
              <p class="item-price">${this.formatPrice(item.preco * item.quantidade)}</p>
            </div>
          </div>
        `;
      }).join('');

      const subtotal = carrinhoItens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
      const total = subtotal - desconto;

      subtotalEl.textContent = this.formatPrice(subtotal);
      if (descontoEl) {
        descontoEl.textContent = desconto > 0 ? `- ${this.formatPrice(desconto)}` : '€0,00';
      }
      totalEl.textContent = this.formatPrice(total);
    }

    formatPrice(value) {
      return `€${value.toFixed(2).replace('.', ',')}`;
    }

    setupTooltips() {
      const tooltips = {
        'card-number': 'Insira o número do seu cartão (13-19 dígitos)',
        'card-name': 'Digite o nome completo como aparece no cartão',
        'card-expiry': 'MM/AA (ex: 12/25)',
        'card-cvc': 'Código de segurança (3 ou 4 dígitos)',
        'phone-number': 'Número português começado por 91, 92, 93 ou 96'
      };

      Object.entries(tooltips).forEach(([id, text]) => {
        const element = document.getElementById(id);
        if (element) {
          element.setAttribute('title', text);
          element.setAttribute('data-tooltip', text);
        }
      });
    }

    setupRealtimeValidation() {
      const cardNumber = document.getElementById('card-number');
      const cardName = document.getElementById('card-name');
      const cardExpiry = document.getElementById('card-expiry');
      const cardCVC = document.getElementById('card-cvc');
      const phoneNumber = document.getElementById('phone-number');

      if (cardNumber) {
        cardNumber.addEventListener('input', (e) => {
          this.formatCardNumber(e.target);
          this.validateField(e.target);
        });
      }

      if (cardName) {
        cardName.addEventListener('input', (e) => {
          this.validateField(e.target);
        });
        cardName.addEventListener('blur', (e) => {
          // Capitalizar nome ao perder foco
          e.target.value = e.target.value
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        });
      }

      if (cardExpiry) {
        cardExpiry.addEventListener('input', (e) => {
          this.formatCardExpiry(e.target);
          this.validateField(e.target);
        });
      }

      if (cardCVC) {
        cardCVC.addEventListener('input', (e) => {
          this.formatCardCVC(e.target);
          this.validateField(e.target);
        });
      }

      if (phoneNumber) {
        phoneNumber.addEventListener('input', (e) => {
          this.formatPhoneNumber(e.target);
          this.validateField(e.target);
        });
      }
    }

    validateField(field) {
      this.validator.clearError(field);

      switch (field.id) {
        case 'card-number':
          if (!field.value.trim()) {
            this.validator.addError(field, 'Número do cartão é obrigatório');
          } else if (!this.validator.validateCardNumber(field.value)) {
            this.validator.addError(field, 'Número do cartão inválido');
          }
          break;

        case 'card-name':
          if (!field.value.trim()) {
            this.validator.addError(field, 'Nome no cartão é obrigatório');
          } else if (!this.validator.validateCardName(field.value)) {
            this.validator.addError(field, 'Digite o nome completo como aparece no cartão');
          }
          break;

        case 'card-expiry':
          if (!field.value.trim()) {
            this.validator.addError(field, 'Data de validade é obrigatória');
          } else if (!this.validator.validateExpiry(field.value)) {
            this.validator.addError(field, 'Data de validade inválida ou expirada');
          }
          break;

        case 'card-cvc':
          const cardType = this.detectCardType(document.getElementById('card-number').value);
          if (!field.value.trim()) {
            this.validator.addError(field, 'CVV/CVC é obrigatório');
          } else if (!this.validator.validateCVC(field.value, cardType)) {
            this.validator.addError(field, `CVV/CVC deve ter ${cardType === 'amex' ? '4' : '3'} dígitos`);
          }
          break;

        case 'phone-number':
          if (!field.value.trim()) {
            this.validator.addError(field, 'Número de telemóvel é obrigatório');
          } else if (!this.validator.validatePhoneNumber(field.value)) {
            this.validator.addError(field, 'Número de telemóvel inválido (deve começar com 91, 92, 93 ou 96)');
          }
          break;
      }
    }
  }

  // Inicializar o checkout
  new CheckoutManager();
});