document.addEventListener('DOMContentLoaded', () => {
  // Newsletter form handling
  const form = document.getElementById('form-newsletter');
  const formMessage = document.getElementById('form-message');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value;

    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formMessage.textContent = 'Obrigado por subscrever! Verifique o seu email.';
      formMessage.style.color = '#ffffff';
      form.reset();
    } else {
      formMessage.textContent = 'Por favor, insira um email válido.';
      formMessage.style.color = '#ff6b6b';
    }
  });
});