document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.form-panel');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const closeButton = document.querySelector('.close-button');
  const togglePasswordButtons = document.querySelectorAll('.toggle-password');
  const loginMessage = document.getElementById('login-message');
  const registerMessage = document.getElementById('register-message');
  const socialButtons = document.querySelectorAll('.social-button');
  const toggleForms = document.querySelectorAll('.toggle-form');
  const mensagemErro = document.querySelector('.mensagem-erro');

  // Utils
  const showMessage = (element, message, type = 'error') => {
    if (!element) {
      console.error('Elemento de mensagem não encontrado:', message);
      return;
    }
    element.textContent = message;
    element.className = `form-message ${type}`;
  };

  const validateEmail = email =>
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/.test(email);

  const getUsers = () =>
    JSON.parse(localStorage.getItem('users')) || [];

  const saveUsers = users =>
    localStorage.setItem('users', JSON.stringify(users));

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      
      const panelId = `${tab.dataset.tab}-panel`;
      const targetPanel = document.getElementById(panelId);
      targetPanel.classList.add('active');

      showMessage(loginMessage, '', '');
      showMessage(registerMessage, '', '');
      // Clear error classes on inputs when switching tabs
      document.getElementById('login-email')?.classList.remove('error');
      document.getElementById('login-password')?.classList.remove('error');
      document.getElementById('register-email')?.classList.remove('error');
      document.getElementById('register-password')?.classList.remove('error');
      document.getElementById('register-confirm-password')?.classList.remove('error');
    });
  });

  // Toggle password visibility
  togglePasswordButtons.forEach(button => {
    button.addEventListener('click', () => {
      const wrapper = button.closest('.password-wrapper');
      const input = wrapper.querySelector('input');
      const icon = button.querySelector('i');
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      icon.classList.toggle('fa-eye', !isPassword);
      icon.classList.toggle('fa-eye-slash', isPassword);
    });
  });

  // Close modal or page
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      const checkoutRedirect = localStorage.getItem('checkoutRedirect');
      const lastPage = localStorage.getItem('lastPage');

      if (checkoutRedirect === 'true' && lastPage) {
        // Se veio do checkout, volta para o carrinho
        window.location.href = lastPage;
      } else if (!document.referrer || window.history.length <= 1) {
        window.location.replace('index.html');
      } else {
        history.replaceState(null, null, document.location);
        history.back();
      }
    });
  }

  // Função para mostrar mensagem de erro
  function mostrarErro(mensagem) {
    if (mensagemErro) {
      mensagemErro.textContent = mensagem;
      mensagemErro.style.display = 'block';
      setTimeout(() => {
        mensagemErro.style.display = 'none';
      }, 3000);
    }
  }

  // Função para fazer login
  function fazerLogin(email, senha) {
    // Simulação de verificação de login
    const usuarios = getUsers();
    const usuario = usuarios.find(u => u.email === email && u.password === senha);

    if (usuario) {
      // Salvar informação de login
      const userInfo = {
        nome: usuario.firstName + ' ' + usuario.lastName,
        email: usuario.email,
        loggedIn: true
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('activeUser', JSON.stringify(usuario));
      sessionStorage.setItem('activeUser', JSON.stringify(usuario));

      // Verificar se veio do checkout
      const checkoutRedirect = localStorage.getItem('checkoutRedirect');
      const lastPage = localStorage.getItem('lastPage');

      // Limpar flags de redirecionamento
      localStorage.removeItem('checkoutRedirect');
      localStorage.removeItem('lastPage');

      showMessage(loginMessage, 'Login bem-sucedido! Redirecionando...', 'success');
      
      setTimeout(() => {
        if (checkoutRedirect === 'true' && lastPage) {
          window.location.href = lastPage;
        } else if (lastPage && !lastPage.includes('login.html')) {
          window.location.href = lastPage;
        } else {
          window.location.href = 'index.html';
        }
      }, 1500);

      return true;
    }
    return false;
  }

  // Login
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const senha = document.getElementById('login-password').value;

      if (!email || !senha) {
        mostrarErro('Por favor, preencha todos os campos.');
        if (!email) document.getElementById('login-email').classList.add('error');
        if (!senha) document.getElementById('login-password').classList.add('error');
        return;
      }

      if (!fazerLogin(email, senha)) {
        mostrarErro('Email ou senha incorretos.');
        document.getElementById('login-email').classList.add('error');
        document.getElementById('login-password').classList.add('error');
      }
    });
  }

  // Registo
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const firstName = document.getElementById('register-first-name').value.trim();
      const lastName = document.getElementById('register-last-name').value.trim();
      const email = document.getElementById('register-email').value.trim();
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('register-confirm-password').value;
      const terms = document.querySelector('input[name="terms"]').checked;

      // Reset error classes
      document.getElementById('register-first-name').classList.remove('error');
      document.getElementById('register-last-name').classList.remove('error');
      document.getElementById('register-email').classList.remove('error');
      document.getElementById('register-password').classList.remove('error');
      document.getElementById('register-confirm-password').classList.remove('error');

      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        mostrarErro('Por favor, preencha todos os campos.');
        if (!firstName) document.getElementById('register-first-name').classList.add('error');
        if (!lastName) document.getElementById('register-last-name').classList.add('error');
        if (!email) document.getElementById('register-email').classList.add('error');
        if (!password) document.getElementById('register-password').classList.add('error');
        if (!confirmPassword) document.getElementById('register-confirm-password').classList.add('error');
        return;
      }

      if (!validateEmail(email)) {
        mostrarErro('Email inválido.');
        document.getElementById('register-email').classList.add('error');
        return;
      }

      if (password !== confirmPassword) {
        mostrarErro('As senhas não coincidem.');
        document.getElementById('register-password').classList.add('error');
        document.getElementById('register-confirm-password').classList.add('error');
        return;
      }

      if (!terms) {
        mostrarErro('Por favor, aceite os termos de uso.');
        return;
      }

      let users = getUsers();
      if (users.some(u => u.email === email)) {
        mostrarErro('Este email já está registrado.');
        document.getElementById('register-email').classList.add('error');
        return;
      }

      users.push({ firstName, lastName, email, password });
      saveUsers(users);
      registerForm.reset();
      console.log('Registro bem-sucedido, exibindo mensagem de sucesso'); // Depuração
      
      // Exibir mensagem de sucesso
      const successMessage = document.getElementById('register-message');
      successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Registro concluído com sucesso! Faça login para continuar';
      successMessage.className = 'form-message success';
      
      // Atraso para exibir a mensagem antes de trocar de aba
      setTimeout(() => {
        document.getElementById('show-login').click();
      }, 2000); // 2 segundos para o usuário ler a mensagem
    });
  }

  // Toggle entre formulários de login e registro
  toggleForms.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('#login-section').classList.toggle('hidden');
      document.querySelector('#register-section').classList.toggle('hidden');
    });
  });

  // Simulação de login social
  socialButtons.forEach(button => {
    button.addEventListener('click', () => {
      const provider = button.dataset.provider;
      alert(`Login com ${provider} não está disponível nesta simulação.`);
      console.log(`Tentativa de login com ${provider}`);
    });
  });

  // Limpar erros ao digitar
  document.getElementById('login-email')?.addEventListener('input', function() {
    this.classList.remove('error');
    if (!document.getElementById('login-password').classList.contains('error')) {
      loginMessage.textContent = '';
    }
  });

  document.getElementById('login-password')?.addEventListener('input', function() {
    this.classList.remove('error');
    if (!document.getElementById('login-email').classList.contains('error')) {
      loginMessage.textContent = '';
    }
  });

  document.getElementById('register-password')?.addEventListener('input', function() {
    this.classList.remove('error');
    document.getElementById('register-confirm-password')?.classList.remove('error');
    registerMessage.textContent = '';
  });

  document.getElementById('register-confirm-password')?.addEventListener('input', function() {
    this.classList.remove('error');
    document.getElementById('register-password')?.classList.remove('error');
    registerMessage.textContent = '';
  });
});