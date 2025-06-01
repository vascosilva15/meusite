document.addEventListener('DOMContentLoaded', () => {
    // Dados das promoções disponíveis
    const promocoesDisponiveis = ['paris']; // Adicione aqui os IDs das promoções que existem
  
    // Elementos do filtro
    const tipoPromo = document.getElementById('tipo-promo');
    const destino = document.getElementById('destino');
    const preco = document.getElementById('preco');
    const precoValor = document.getElementById('preco-valor');
    const dataIda = document.getElementById('data-ida');
    const ocupacao = document.getElementById('ocupacao');
    const duracao = document.getElementById('duracao');
    const ordenacao = document.getElementById('ordenacao');
    const promoCards = document.querySelectorAll('.promo-card');
    const limparFiltros = document.getElementById('limpar-filtros');
    const carrinhoContador = document.querySelector('.carrinho-contador');
    const noResults = document.querySelector('.no-results');
  
    // Verificar se estamos na página de promoções
    const isPromocoesPage = promoCards.length > 0;
    if (!isPromocoesPage) {
        // Se não estiver na página de promoções, apenas atualizar o contador do carrinho
        try {
            const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
            if (carrinhoContador) {
                carrinhoContador.textContent = carrinho.length;
            }
        } catch (e) {
            console.error('Erro ao acessar localStorage:', e);
        }
        return;
    }
  
    // Mapeamento de meses para conversão
    const meses = {
        'Jan': 0, 'Fev': 1, 'Mar': 2, 'Abr': 3, 'Mai': 4, 'Jun': 5,
        'Jul': 6, 'Ago': 7, 'Set': 8, 'Out': 9, 'Nov': 10, 'Dez': 11
    };
  
    // Prevenir navegação para promoções inexistentes
    document.querySelectorAll('.promo-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const url = new URL(link.href);
        const id = url.searchParams.get('id');
        if (!promocoesDisponiveis.includes(id)) {
          e.preventDefault();
          mostrarMensagem('Fique atento às nossas novidades!', 'info');
        }
      });
    });
  
    // Configurar data mínima como hoje
    if (dataIda) {
        const hoje = new Date().toISOString().split('T')[0];
        dataIda.min = hoje;
        dataIda.addEventListener('change', () => {
            console.log('Data da viagem alterada');
            filtrarPromocoes();
        });
    }
  
    // Atualizar o valor do preço
    if (preco && precoValor) {
        preco.addEventListener('input', function () {
            precoValor.textContent = `€${this.value}`;
            filtrarPromocoes();
        });
    }
  
    // Função debounce
    function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  
    // Função para verificar login
    function verificarLogin() {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return userInfo && userInfo.loggedIn === true;
      } catch (e) {
        console.error('Erro ao verificar login:', e);
        return false;
      }
    }
  
    // Função para mostrar mensagem
    function mostrarMensagem(mensagem, tipo = 'info') {
      showMessage(mensagem, tipo);
    }

    // Função para extrair desconto
    function extrairDesconto(texto) {
      return parseInt(texto.replace('-', '').replace('%', ''));
    }

    // Função para verificar compatibilidade de pessoas
    function verificarCompatibilidadePessoas(card, ocupacaoSelecionada) {
        if (ocupacaoSelecionada === 'todos') return true;

        const titulo = card.querySelector('h3').textContent.trim();
        
        switch (ocupacaoSelecionada) {
            case '2':
                // Apenas Paris e Veneza
                return titulo.includes('Paris') || titulo.includes('Veneza');
            case '2-3':
                // Apenas Madrid e Praga
                return titulo.includes('Madrid') || titulo.includes('Praga');
            case '2-4':
                // Apenas Roma e Viena
                return titulo.includes('Roma') || titulo.includes('Viena');
            default:
                return true;
        }
    }

    // Função para verificar duração da viagem
    function verificarDuracao(card, duracaoSelecionada) {
        if (duracaoSelecionada === 'todos') return true;

        const titulo = card.querySelector('h3').textContent.trim();
        
        switch (duracaoSelecionada) {
            case 'curta':
                // Veneza e Praga (1-3 dias)
                return titulo.includes('Veneza') || titulo.includes('Praga');
            case 'media':
                // Paris, Madrid e Roma (4-7 dias)
                return titulo.includes('Paris') || 
                       titulo.includes('Madrid') || 
                       titulo.includes('Roma');
            case 'longa':
                // Viena (8+ dias)
                return titulo.includes('Viena');
            default:
                return true;
        }
    }

    // Função para calcular duração da viagem em dias
    function calcularDuracao(dataInicio, dataFim) {
        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);
        const diff = fim - inicio;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    // Função para ordenar promoções
    function ordenarPromocoes(cards, criterio) {
        const cardsArray = Array.from(cards);
        
        return cardsArray.sort((a, b) => {
            switch (criterio) {
                case 'desconto': {
                    const descontoA = extrairDesconto(a.querySelector('.promo-badge').textContent);
                    const descontoB = extrairDesconto(b.querySelector('.promo-badge').textContent);
                    return descontoB - descontoA;
                }
                case 'preco': {
                    const precoA = parseFloat(a.querySelector('.final-price').textContent.replace('€', '').trim());
                    const precoB = parseFloat(b.querySelector('.final-price').textContent.replace('€', '').trim());
                    return precoA - precoB;
                }
                default:
                    return 0;
            }
        });
    }

    // Função para extrair data de validade
    function extrairDataValidade(texto) {
        const match = texto.match(/(\d{2})\/(\d{2})\/(\d{4})/);
        if (match) {
            const [, dia, mes, ano] = match;
            return new Date(ano, mes - 1, dia).getTime();
        }
        return null;
    }
  
    // Função para verificar datas
    function verificarDatas(card, dataSelecionada) {
        if (!dataSelecionada) return true;

        // Extrair datas do card
        const datasTexto = card.querySelector('.promo-info .fa-calendar').parentElement.textContent;
        const [dataIdaTexto] = datasTexto.split('-').map(d => d.trim());
        const [diaCard, mesCard] = dataIdaTexto.split(' ');

        // Converter a data selecionada
        const dataSel = new Date(dataSelecionada);
        const diaSel = dataSel.getDate().toString().padStart(2, '0');
        const mesSel = (dataSel.getMonth() + 1).toString().padStart(2, '0');

        // Converter o mês do card para número
        const mesCardNum = (meses[mesCard] + 1).toString().padStart(2, '0');
        
        // Comparar as datas
        return diaSel === diaCard && mesSel === mesCardNum;
    }
  
    // Função para filtrar promoções
    function filtrarPromocoes() {
        if (!promoCards.length) return;

        console.log('Iniciando filtragem...');
        const tipoSelecionado = tipoPromo ? tipoPromo.value : 'todos';
        const destinoSelecionado = destino ? destino.value : 'todos';
        const precoMaximo = preco ? parseFloat(preco.value) : Infinity;
        const ocupacaoSelecionada = ocupacao ? ocupacao.value : 'todos';
        const duracaoSelecionada = duracao ? duracao.value : 'todos';
        const ordenacaoSelecionada = ordenacao ? ordenacao.value : 'desconto';
        const numeroPromocoesElement = document.getElementById('numero-promocoes');

        let cardsVisiveis = Array.from(promoCards).filter(card => {
            let mostrar = true;

            // Filtro por tipo
            if (tipoSelecionado !== 'todos') {
                if (card.getAttribute('data-tipo') !== tipoSelecionado) mostrar = false;
            }

            // Filtro por destino
            if (destinoSelecionado !== 'todos') {
                if (card.getAttribute('data-destino') !== destinoSelecionado) mostrar = false;
            }

            // Filtro por preço
            const precoCard = parseFloat(card.querySelector('.final-price').textContent.replace('€', ''));
            if (precoCard > precoMaximo) mostrar = false;

            // Filtro por ocupação
            if (!verificarCompatibilidadePessoas(card, ocupacaoSelecionada)) {
                mostrar = false;
            }

            // Filtro por duração
            if (!verificarDuracao(card, duracaoSelecionada)) {
                mostrar = false;
            }

            // Filtro por data
            if (dataIda && dataIda.value && !verificarDatas(card, dataIda.value)) {
                mostrar = false;
            }

            return mostrar;
        });

        // Aplicar ordenação
        cardsVisiveis = ordenarPromocoes(cardsVisiveis, ordenacaoSelecionada);

        // Atualizar a exibição
        const container = document.querySelector('.promocoes-grid');
        container.innerHTML = ''; // Limpar o container
        
        if (cardsVisiveis.length === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
            cardsVisiveis.forEach(card => container.appendChild(card));
        }

        // Atualizar contador de promoções
        if (numeroPromocoesElement) {
            numeroPromocoesElement.textContent = cardsVisiveis.length;
        }
    }
  
    // Adicionar event listeners para filtros
    const filtros = [tipoPromo, destino, preco, ocupacao, duracao, ordenacao];
    filtros.forEach(filtro => {
        if (filtro) {
            filtro.addEventListener('change', filtrarPromocoes);
        }
    });

    // Limpar filtros
    if (limparFiltros) {
        limparFiltros.addEventListener('click', () => {
            // Resetar valores dos filtros
            if (tipoPromo) tipoPromo.value = 'todos';
            if (destino) destino.value = 'todos';
            if (preco) preco.value = preco.max;
            if (ocupacao) ocupacao.value = 'todos';
            if (duracao) duracao.value = 'todos';
            if (dataIda) dataIda.value = '';
            if (ordenacao) ordenacao.value = 'padrao';
            if (precoValor) precoValor.textContent = `€${preco.value}`;

            // Atualizar visualização
            filtrarPromocoes();
        });
    }
  
    // Newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      if (!emailRegex.test(email)) {
        mostrarMensagem('Por favor, insira um email válido.', 'erro');
        return;
      }
  
      mostrarMensagem('Inscrição realizada com sucesso! Receba ofertas exclusivas em breve.', 'sucesso');
      this.classList.add('success');
      setTimeout(() => this.classList.remove('success'), 1000);
      this.reset();
    });
  
    // Função para mostrar alerta personalizado
    function showCustomAlert(message, type = 'success') {
      // Remover alertas existentes
      const existingAlerts = document.querySelectorAll('.custom-alert');
      existingAlerts.forEach(alert => alert.remove());

      // Criar novo alerta
      const alert = document.createElement('div');
      alert.className = `custom-alert ${type}`;
      alert.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
      `;

      // Adicionar ao corpo do documento
      document.body.appendChild(alert);

      // Mostrar o alerta com animação
      setTimeout(() => alert.classList.add('show'), 10);

      // Remover o alerta após 3 segundos
      setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
      }, 3000);
    }

    // Função para adicionar ao carrinho
    function adicionarAoCarrinho(card, botao) {

      const titulo = card.querySelector('h3').textContent;
      const precoFinal = parseFloat(card.querySelector('.final-price').textContent.replace('€', ''));
      const precoOriginal = parseFloat(card.querySelector('.original-price').textContent.replace('€', ''));
      const tipo = card.getAttribute('data-tipo');
      const destino = card.getAttribute('data-destino');
      const data = card.getAttribute('data-data');
      const imagem = card.querySelector('img').src;
      const descricao = card.querySelector('.promo-content p').textContent;
      const validade = card.querySelector('.promo-validity').textContent;

      const item = {
        id: Date.now(),
        tipo: 'promocao',
        nome: titulo,
        preco: precoFinal,
        precoOriginal: precoOriginal,
        destino: destino,
        dataIda: data,
        imagem: imagem,
        descricao: descricao,
        validade: validade,
        quantidade: 1
      };

      try {
        let carrinhoItens = JSON.parse(localStorage.getItem('carrinhoItens')) || [];
        const itemExistente = carrinhoItens.find(i =>
          i.nome === item.nome &&
          i.preco === item.preco &&
          i.dataIda === item.dataIda
        );

        if (!itemExistente) {
          carrinhoItens.push(item);
          localStorage.setItem('carrinhoItens', JSON.stringify(carrinhoItens));
          showMessage(`${titulo} adicionado ao carrinho com sucesso!`, 'success');
          atualizarContadorCarrinho();
        } else {
          showMessage('Este item já está no seu carrinho.', 'info');
        }
      } catch (e) {
        console.error('Erro ao salvar no carrinho:', e);
        showMessage('Erro ao adicionar ao carrinho. Tente novamente.', 'error');
      }
    }

    // Função para atualizar contador do carrinho
    function atualizarContadorCarrinho() {
      const carrinhoContador = document.querySelector('.carrinho-contador');
      if (carrinhoContador) {
        const carrinhoItens = JSON.parse(localStorage.getItem('carrinhoItens')) || [];
        carrinhoContador.textContent = carrinhoItens.length;
      }
    }

    // Adicionar event listeners aos botões de carrinho
    document.querySelectorAll('.promo-button').forEach(botao => {
      if (!botao.closest('#limpar-filtros')) { // Ignorar o botão de limpar filtros
        botao.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          const card = this.closest('.promo-card');
          if (card) {
            adicionarAoCarrinho(card, this);
          }
        });
      }
    });

    // Verificar itens já no carrinho ao carregar a página
    if (verificarLogin()) {
      try {
        const carrinhoItens = JSON.parse(localStorage.getItem('carrinhoItens')) || [];
        promoCards.forEach(card => {
          const titulo = card.querySelector('h3').textContent;
          const precoFinal = parseFloat(card.querySelector('.final-price').textContent.replace('€', ''));
          const data = card.getAttribute('data-data');

          const itemNoCarrinho = carrinhoItens.find(i =>
            i.nome === titulo &&
            i.preco === precoFinal &&
            i.dataIda === data
          );

          if (itemNoCarrinho) {
            const botao = card.querySelector('.promo-button');
            if (botao) {
              botao.innerHTML = '<i class="fas fa-check"></i> Adicionado';
              botao.classList.add('adicionado');
              botao.setAttribute('aria-label', `Item ${titulo} adicionado ao carrinho`);
            }
          }
        });

        // Atualizar contador do carrinho
        atualizarContadorCarrinho();
      } catch (e) {
        console.error('Erro ao verificar carrinho:', e);
      }
    }
  
    // Animação suave ao scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  
    // Lazy loading para imagens
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  
    // Inicializar filtros
    filtrarPromocoes();

    // Atualizar contador do carrinho ao carregar a página
    atualizarContadorCarrinho();

    // Adicionar event listeners aos cards de promoção
    document.querySelectorAll('.promo-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Se o clique foi em um link, deixa o comportamento padrão
        if (e.target.closest('a')) {
          return;
        }
        
        // Previne a navegação padrão
        e.preventDefault();
        e.stopPropagation();
        
        // Adiciona ao carrinho
        adicionarAoCarrinho(card);
      });
    });
  });

function showMessage(message, type = 'success') {
  // Remove any existing alerts first
  const existingAlerts = document.querySelectorAll('.custom-alert');
  existingAlerts.forEach(alert => alert.remove());

  // Create new alert
  const alertDiv = document.createElement('div');
  alertDiv.className = `custom-alert ${type}`;
  
  // Add icon based on type
  let icon = 'check-circle';
  if (type === 'error') icon = 'exclamation-circle';
  if (type === 'info') icon = 'info-circle';
  
  alertDiv.innerHTML = `
    <i class="fas fa-${icon}"></i>
    <span>${message}</span>
  `;
  
  // Add to document
  document.body.appendChild(alertDiv);
  
  // Trigger animation
  setTimeout(() => alertDiv.classList.add('show'), 10);
  
  // Remove after delay
  setTimeout(() => {
    alertDiv.classList.remove('show');
    setTimeout(() => alertDiv.remove(), 300);
  }, 3000);
}