document.addEventListener('DOMContentLoaded', () => {
  // Elementos da página
  const promocaoTitulo = document.getElementById('promocao-titulo');
  const promocaoNome = document.getElementById('promocao-nome');
  const promocaoImagemPrincipal = document.getElementById('promocao-imagem-principal');
  const promocaoDesconto = document.getElementById('promocao-desconto');
  const promocaoLocal = document.getElementById('promocao-local');
  const promocaoDatas = document.getElementById('promocao-datas');
  const promocaoValidade = document.getElementById('promocao-validade');
  const promocaoPrecoOriginal = document.getElementById('promocao-preco-original');
  const promocaoPrecoFinal = document.getElementById('promocao-preco-final');
  const promocaoDescricao = document.getElementById('promocao-descricao');
  const promocaoInclui = document.getElementById('promocao-inclui');
  const promocaoCondicoes = document.getElementById('promocao-condicoes');
  const promocaoGaleria = document.getElementById('promocao-galeria');
  const btnAdicionarCarrinho = document.getElementById('btn-adicionar-carrinho');
  const promocoesRelacionadasGrid = document.getElementById('promocoes-relacionadas-grid');

  // Obter ID da promoção da URL
  const urlParams = new URLSearchParams(window.location.search);
  const promocaoId = urlParams.get('id');

  // Dados mockados da promoção (em produção, isso viria de uma API)
  const promocoesData = {
    'paris': {
      id: 'paris',
      nome: 'Paris Romântica',
      desconto: '-30%',
      local: 'Paris, França',
      datas: '15 Jun - 20 Jun, 2025',
      validade: '15/09/2025',
      precoOriginal: '€899',
      precoFinal: '€629',
      ocupacao: {
        minima: 2,
        maxima: 2,
        tipo: 'Pacote ideal para casais',
        observacoes: 'Preço por pessoa: €314,50'
      },
      voos: {
        ida: {
          numero: 'TP442',
          origem: {
            cidade: 'Lisboa',
            aeroporto: 'Aeroporto Humberto Delgado (LIS)',
            data: '15 Jun, 2025',
            horario: '06:30'
          },
          destino: {
            cidade: 'Paris',
            aeroporto: 'Aeroporto Charles de Gaulle (CDG)',
            data: '15 Jun, 2025',
            horario: '10:05'
          },
          duracao: '2h 35min',
          companhia: 'TAP Air Portugal'
        },
        volta: {
          numero: 'TP443',
          origem: {
            cidade: 'Paris',
            aeroporto: 'Aeroporto Charles de Gaulle (CDG)',
            data: '20 Jun, 2025',
            horario: '10:55'
          },
          destino: {
            cidade: 'Lisboa',
            aeroporto: 'Aeroporto Humberto Delgado (LIS)',
            data: '20 Jun, 2025',
            horario: '12:30'
          },
          duracao: '2h 35min',
          companhia: 'TAP Air Portugal'
        }
      },
      hotel: {
        nome: 'Hôtel Le Petit Paris',
        categoria: '8.7/10',
        endereco: '214 Rue Saint Jacques, 75005 Paris, França',
        descricao: 'Localizado no coração do Quartier Latin, este elegante hotel oferece quartos luxuosos com decoração única inspirada em diferentes períodos da história de Paris. A poucos passos do Jardim de Luxemburgo e do Panthéon.',
        facilidades: [
          { icon: 'fa-wifi', texto: 'Wi-Fi gratuito' },
          { icon: 'fa-utensils', texto: 'Restaurante' },
          { icon: 'fa-coffee', texto: 'Pequeno-almoço' },
          { icon: 'fa-concierge-bell', texto: 'Serviço de quarto 24h' },
        ],
        imagens: [
          'media/hotel_paris1.jpg',  // Fachada do hotel
          'media/hotel_paris2.jpg',  // Quarto
          'media/hotel_paris3.jpg',  // Banheiro
        ],
        quarto: {
          tipo: 'Quarto Deluxe com Vista para a Cidade',
          cama: '1 cama king-size',
          area: '25m²',
          vista: 'Vista para a cidade'
        }
      },
      descricao: `<p>Descubra o charme incomparável de Paris com este pacote especial para casais. 
                  Hospede-se em um hotel no coração do centro histórico e explore a cidade 
                  mais romântica do mundo.</p>
                  
                  <p>O pacote inclui passeios pelos principais pontos turísticos, incluindo a Torre 
                  Eiffel, Museu do Louvre e um romântico cruzeiro pelo Rio Sena ao pôr do sol.</p>
                  
                  <p>Destaques do pacote:</p>
                  <ul>
                    <li>Visita guiada à Torre Eiffel com acesso prioritário</li>
                    <li>Ingresso para o Museu do Louvre com audioguia em português</li>
                    <li>Cruzeiro romântico pelo Rio Sena ao pôr do sol com champagne</li>
                    <li>Passeio por Montmartre e Sacré-Cœur</li>
                    <li>Jantar romântico em restaurante com vista para a Torre Eiffel</li>
                  </ul>`,
      inclui: [
        { icon: 'fa-plane', texto: 'Voos diretos de ida e volta' },
        { icon: 'fa-hotel', texto: 'Hotel 4 estrelas no centro' },
        { icon: 'fa-utensils', texto: 'Pequeno-almoço' },
        { icon: 'fa-ship', texto: 'Cruzeiro no Rio Sena com champagne' },
        { icon: 'fa-ticket', texto: 'Entradas para museus e atrações' },
        { icon: 'fa-car', texto: 'Transfers privativos aeroporto/hotel' },
        { icon: 'fa-map', texto: 'Passeios guiados em português' },
        { icon: 'fa-glass-cheers', texto: 'Jantar romântico com vista' },
        { icon: 'fa-umbrella', texto: 'Seguro viagem completo' }
      ],
      condicoes: `<ul>
        <li>Reserva sujeita a disponibilidade</li>
        <li>Cancelamento gratuito até 30 dias antes da viagem</li>
        <li>Passagens aéreas em classe econômica</li>
        <li>Hospedagem em quarto duplo standard</li>
        <li>Possibilidade de upgrade para quarto superior (consulte valores)</li>
        <li>Check-in no hotel a partir das 15h</li>
        <li>Check-out do hotel até as 11h</li>
        <li>Necessário passaporte com validade mínima de 6 meses</li>
        <li>Seguro viagem com cobertura médica de €30.000</li>
        <li>Taxas e impostos inclusos</li>
      </ul>`,
      imagens: [
        'media/paris.jpg',    // Torre Eiffel
        'media/paris2.jpg',   // Arco do Triunfo
        'media/paris3.jpg',   // Museu do Louvre
        'media/paris4.jpg',   // Rio Sena
        'media/paris5.jpg',   // Jardins de Luxemburgo
        'media/paris6.jpg'    // Sacré-Cœur
      ]
    },
    // Adicionar mais promoções aqui...
  };

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = lightbox.querySelector('.lightbox-image');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxPrev = lightbox.querySelector('.lightbox-prev');
  const lightboxNext = lightbox.querySelector('.lightbox-next');
  let currentImageIndex = 0;

  // Função para abrir o lightbox
  function openLightbox(imageSrc, index) {
    lightboxImage.src = imageSrc;
    lightboxImage.alt = promocoesData[promocaoId].nome;
    currentImageIndex = index;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Previne rolagem
    updateNavigationButtons();
  }

  // Função para fechar o lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restaura rolagem
  }

  // Função para navegar entre imagens
  function navigateImage(direction) {
    const images = promocoesData[promocaoId].imagens;
    currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
    lightboxImage.src = images[currentImageIndex];
    updateNavigationButtons();
  }

  // Atualizar visibilidade dos botões de navegação
  function updateNavigationButtons() {
    const images = promocoesData[promocaoId].imagens;
    lightboxPrev.style.display = images.length > 1 ? 'block' : 'none';
    lightboxNext.style.display = images.length > 1 ? 'block' : 'none';
  }

  // Event Listeners do Lightbox
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => navigateImage(-1));
  lightboxNext.addEventListener('click', () => navigateImage(1));

  // Fechar lightbox ao clicar fora da imagem
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Navegação com teclado no lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        navigateImage(-1);
        break;
      case 'ArrowRight':
        navigateImage(1);
        break;
    }
  });

  // Carregar dados da promoção
  function carregarPromocao(id) {
    const promocao = promocoesData[id];
    if (!promocao) {
      window.location.href = 'promocoes.html';
      return;
    }

    document.title = `${promocao.nome} | FlyScape`;
    promocaoTitulo.textContent = promocao.nome;
    promocaoNome.textContent = promocao.nome;
    promocaoImagemPrincipal.src = promocao.imagens[0];
    promocaoImagemPrincipal.alt = promocao.nome;
    promocaoDesconto.textContent = promocao.desconto;
    promocaoLocal.textContent = promocao.local;
    promocaoDatas.textContent = promocao.datas;
    promocaoValidade.textContent = promocao.validade;
    promocaoPrecoOriginal.textContent = promocao.precoOriginal;
    promocaoPrecoFinal.textContent = promocao.precoFinal;
    promocaoDescricao.innerHTML = promocao.descricao;
    promocaoCondicoes.innerHTML = promocao.condicoes;

    // Atualizar informações de ocupação
    const ocupacaoInfo = document.getElementById('promocao-ocupacao');
    if (ocupacaoInfo && promocao.ocupacao) {
      ocupacaoInfo.innerHTML = `
        <div class="ocupacao-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="ocupacao-detalhes">
          <p class="ocupacao-tipo">${promocao.ocupacao.tipo}</p>
          <p class="ocupacao-pessoas">
            <i class="fas fa-user"></i> ${promocao.ocupacao.minima} pessoas
          </p>
          <p class="ocupacao-preco">
            <i class="fas fa-tag"></i> ${promocao.ocupacao.observacoes}
          </p>
        </div>
      `;
    }

    // Carregar itens incluídos
    promocaoInclui.innerHTML = promocao.inclui.map(item => `
      <li><i class="fas ${item.icon}"></i> ${item.texto}</li>
    `).join('');

    // Atualizar carregamento da galeria
    promocaoGaleria.innerHTML = promocao.imagens.map((img, index) => `
      <img src="${img}" 
           alt="${promocao.nome}" 
           onclick="trocarImagemPrincipal('${img}')"
           data-index="${index}"
           style="cursor: pointer;"
      />
    `).join('');

    // Adicionar evento de clique para abrir lightbox
    promocaoGaleria.querySelectorAll('img').forEach((img, index) => {
      img.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(img.src, index);
      });
    });

    // Adicionar evento de clique na imagem principal para abrir lightbox
    promocaoImagemPrincipal.addEventListener('click', () => {
      const currentSrc = promocaoImagemPrincipal.src;
      const index = promocao.imagens.findIndex(img => img === currentSrc);
      openLightbox(currentSrc, index !== -1 ? index : 0);
    });

    // Atualizar informações do voo
    const promocaoVoos = document.getElementById('promocao-voos');
    if (promocaoVoos && promocao.voos) {
      const voos = promocao.voos;
      promocaoVoos.innerHTML = `
        <div class="voo-card">
          <div class="voo-header">
            <span class="voo-tipo">Voo de Ida</span>
            <span class="voo-numero">${voos.ida.companhia} - ${voos.ida.numero}</span>
          </div>
          <div class="voo-info">
            <div>
              <div class="voo-cidade">${voos.ida.origem.cidade}</div>
              <div class="voo-aeroporto">${voos.ida.origem.aeroporto}</div>
              <div class="voo-horario">${voos.ida.origem.horario}</div>
              <div class="voo-data">${voos.ida.origem.data}</div>
            </div>
            <div class="voo-duracao">
              <span>${voos.ida.duracao}</span>
            </div>
            <div>
              <div class="voo-cidade">${voos.ida.destino.cidade}</div>
              <div class="voo-aeroporto">${voos.ida.destino.aeroporto}</div>
              <div class="voo-horario">${voos.ida.destino.horario}</div>
              <div class="voo-data">${voos.ida.destino.data}</div>
            </div>
          </div>
        </div>

        <div class="voo-card">
          <div class="voo-header">
            <span class="voo-tipo">Voo de Volta</span>
            <span class="voo-numero">${voos.volta.companhia} - ${voos.volta.numero}</span>
          </div>
          <div class="voo-info">
            <div>
              <div class="voo-cidade">${voos.volta.origem.cidade}</div>
              <div class="voo-aeroporto">${voos.volta.origem.aeroporto}</div>
              <div class="voo-horario">${voos.volta.origem.horario}</div>
              <div class="voo-data">${voos.volta.origem.data}</div>
            </div>
            <div class="voo-duracao">
              <span>${voos.volta.duracao}</span>
            </div>
            <div>
              <div class="voo-cidade">${voos.volta.destino.cidade}</div>
              <div class="voo-aeroporto">${voos.volta.destino.aeroporto}</div>
              <div class="voo-horario">${voos.volta.destino.horario}</div>
              <div class="voo-data">${voos.volta.destino.data}</div>
            </div>
          </div>
        </div>
      `;
    }

    // Atualizar informações do hotel
    const promocaoHotel = document.getElementById('promocao-hotel');
    if (promocaoHotel && promocao.hotel) {
      const hotel = promocao.hotel;
      promocaoHotel.innerHTML = `
        <div class="hotel-header">
          <img src="${hotel.imagens[0]}" 
               alt="${hotel.nome}" 
               class="hotel-imagem"
               style="cursor: pointer;"
               onclick="abrirLightboxHotel(this.src)"
          >
          <div class="hotel-detalhes">
            <h4 class="hotel-nome">${hotel.nome} <small>${hotel.categoria}</small></h4>
            <div class="hotel-endereco">
              <i class="fas fa-map-marker-alt"></i>
              <span>${hotel.endereco}</span>
            </div>
            <div class="hotel-quarto">
              <strong>Acomodação:</strong> ${hotel.quarto.tipo}<br>
              <strong>Cama:</strong> ${hotel.quarto.cama}<br>
              <strong>Área:</strong> ${hotel.quarto.area}<br>
              <strong>Vista:</strong> ${hotel.quarto.vista}
            </div>
          </div>
        </div>
        <div class="hotel-facilidades">
          ${hotel.facilidades.map(f => `
            <span class="facilidade">
              <i class="fas ${f.icon}"></i>
              ${f.texto}
            </span>
          `).join('')}
        </div>
        <div class="hotel-descricao">
          ${hotel.descricao}
        </div>
      `;
    }
  }

  // Função para trocar imagem principal
  window.trocarImagemPrincipal = function(src) {
    promocaoImagemPrincipal.src = src;
  };

  // Função para abrir lightbox do hotel
  window.abrirLightboxHotel = function(src) {
    const hotel = promocoesData[promocaoId].hotel;
    const imagens = hotel.imagens;
    currentImageIndex = imagens.indexOf(src);
    
    lightboxImage.src = src;
    lightboxImage.alt = hotel.nome;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Atualizar navegação
    lightboxPrev.style.display = imagens.length > 1 ? 'flex' : 'none';
    lightboxNext.style.display = imagens.length > 1 ? 'flex' : 'none';
    
    // Atualizar handlers de navegação
    lightboxPrev.onclick = () => {
      currentImageIndex = (currentImageIndex - 1 + imagens.length) % imagens.length;
      lightboxImage.src = imagens[currentImageIndex];
    };
    
    lightboxNext.onclick = () => {
      currentImageIndex = (currentImageIndex + 1) % imagens.length;
      lightboxImage.src = imagens[currentImageIndex];
    };
  };

  // Adicionar evento de clique na imagem principal do hotel
  document.addEventListener('click', function(e) {
    if (e.target.matches('.hotel-imagem')) {
      abrirLightboxHotel(e.target.src);
    }
  });

  // Navegação com teclado no lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    const hotel = promocoesData[promocaoId].hotel;
    const imagens = hotel.imagens;
    
    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        if (imagens.length > 1) {
          currentImageIndex = (currentImageIndex - 1 + imagens.length) % imagens.length;
          lightboxImage.src = imagens[currentImageIndex];
        }
        break;
      case 'ArrowRight':
        if (imagens.length > 1) {
          currentImageIndex = (currentImageIndex + 1) % imagens.length;
          lightboxImage.src = imagens[currentImageIndex];
        }
        break;
    }
  });

  // Gerenciar tabs
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');
      
      // Atualizar classes ativas
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Mostrar conteúdo da tab
      document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
      });
      document.getElementById(targetId).classList.add('active');
    });
  });

  // Adicionar ao carrinho
  btnAdicionarCarrinho.addEventListener('click', () => {
    const promocao = promocoesData[promocaoId];
    if (!promocao) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.loggedIn) {
        localStorage.setItem('lastPage', window.location.href);
        showCustomAlert('Por favor, faça login para adicionar itens ao carrinho.', 'error');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
        return;
      }

      const item = {
        id: Date.now(),
        tipo: 'promocao',
        nome: promocao.nome,
        preco: Number(promocao.precoFinal.replace('€', '').replace(',', '.').trim()),
        precoOriginal: Number(promocao.precoOriginal.replace('€', '').replace(',', '.').trim()),
        destino: promocao.local,
        dataIda: promocao.datas,
        imagem: promocao.imagens[0],
        descricao: promocao.descricao,
        passageiros: '2 adultos',
        quantidade: 1
      };

      let carrinho = JSON.parse(localStorage.getItem('carrinhoItens')) || [];
      const itemExistente = carrinho.find(i =>
        i.nome === item.nome &&
        i.preco === item.preco &&
        i.dataIda === item.dataIda
      );

      if (!itemExistente) {
        carrinho.push(item);
        localStorage.setItem('carrinhoItens', JSON.stringify(carrinho));
        btnAdicionarCarrinho.innerHTML = '<i class="fa-solid fa-check"></i> Adicionado';
        btnAdicionarCarrinho.classList.add('adicionado');
        btnAdicionarCarrinho.disabled = true;
        showCustomAlert(`${promocao.nome} adicionado ao carrinho com sucesso!`, 'success');
        atualizarContadorCarrinho();
      } else {
        showCustomAlert('Esta promoção já está no seu carrinho.', 'info');
      }
    } catch (e) {
      console.error('Erro ao salvar no carrinho:', e);
      showCustomAlert('Erro ao adicionar ao carrinho. Tente novamente.', 'error');
    }
  });

  // Verificar se item já está no carrinho
  function verificarItemCarrinho() {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo && userInfo.loggedIn) {
        const carrinho = JSON.parse(localStorage.getItem('carrinhoItens')) || [];
        const promocao = promocoesData[promocaoId];
        
        if (promocao) {
          const itemNoCarrinho = carrinho.find(i =>
            i.nome === promocao.nome &&
            i.preco === Number(promocao.precoFinal.replace('€', '').replace(',', '.').trim()) &&
            i.dataIda === promocao.datas
          );

          if (itemNoCarrinho) {
            btnAdicionarCarrinho.innerHTML = '<i class="fa-solid fa-check"></i> Adicionado';
            btnAdicionarCarrinho.classList.add('adicionado');
            btnAdicionarCarrinho.disabled = true;
            btnAdicionarCarrinho.title = 'Esta promoção já está no seu carrinho';
          } else {
            btnAdicionarCarrinho.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Adicionar ao Carrinho';
            btnAdicionarCarrinho.classList.remove('adicionado');
            btnAdicionarCarrinho.disabled = false;
            btnAdicionarCarrinho.title = 'Adicionar esta promoção ao carrinho';
          }
        }
      }
    } catch (e) {
      console.error('Erro ao verificar carrinho:', e);
    }
  }

  // Atualizar contador do carrinho
  function atualizarContadorCarrinho() {
    const carrinhoContador = document.querySelector('.carrinho-contador');
    if (carrinhoContador) {
      const carrinhoItens = JSON.parse(localStorage.getItem('carrinhoItens')) || [];
      carrinhoContador.textContent = carrinhoItens.length;
    }
  }

  // Inicialização
  if (promocaoId) {
    carregarPromocao(promocaoId);
    verificarItemCarrinho();
    atualizarContadorCarrinho();
  } else {
    window.location.href = 'promocoes.html';
  }

  function preencherItinerario() {
    const voosContainer = document.getElementById('promocao-voos');
    const hotelContainer = document.getElementById('promocao-hotel');

    // Dados dos voos
    const voos = [
      {
        tipo: 'Voo de Ida',
        numero: 'TP 432',
        origem: {
          cidade: 'Lisboa',
          aeroporto: 'LIS',
          horario: '06:30',
          data: '15 Jul 2024'
        },
        destino: {
          cidade: 'Paris',
          aeroporto: 'CDG',
          horario: '10:05',
          data: '15 Jul 2024'
        },
        duracao: '2h 35m'
      },
      {
        tipo: 'Voo de Volta',
        numero: 'TP 433',
        origem: {
          cidade: 'Paris',
          aeroporto: 'CDG',
          horario: '10:55',
          data: '22 Jul 2024'
        },
        destino: {
          cidade: 'Lisboa',
          aeroporto: 'LIS',
          horario: '12:30',
          data: '22 Jul 2024'
        },
        duracao: '2h 35m'
      }
    ];

    // Preencher voos
    voosContainer.innerHTML = voos.map(voo => `
      <div class="voo-card">
        <div class="voo-header">
          <span class="voo-tipo">${voo.tipo}</span>
          <span class="voo-numero">${voo.numero}</span>
        </div>
        <div class="voo-info">
          <div class="voo-partida">
            <div class="voo-cidade">${voo.origem.cidade}</div>
            <div class="voo-aeroporto">${voo.origem.aeroporto}</div>
            <div class="voo-horario">${voo.origem.horario}</div>
            <div class="voo-data">${voo.origem.data}</div>
          </div>
          <div class="voo-duracao">
            <i class="fas fa-plane"></i>
            ${voo.duracao}
          </div>
          <div class="voo-chegada">
            <div class="voo-cidade">${voo.destino.cidade}</div>
            <div class="voo-aeroporto">${voo.destino.aeroporto}</div>
            <div class="voo-horario">${voo.destino.horario}</div>
            <div class="voo-data">${voo.destino.data}</div>
          </div>
        </div>
      </div>
    `).join('');

    // Dados do hotel
    const hotel = {
      nome: 'Hôtel Le Petit Paris',
      categoria: '4 estrelas',
      endereco: '214 Rue Saint Jacques, 75005 Paris, França',
      imagem: 'img/hotel-paris.jpg',
      quarto: 'Quarto Duplo Superior',
      facilidades: [
        { icone: 'fas fa-wifi', texto: 'Wi-Fi Gratuito' },
        { icone: 'fas fa-coffee', texto: 'Pequeno-almoço' },
        { icone: 'fas fa-concierge-bell', texto: 'Serviço de Quarto' },
        { icone: 'fas fa-spa', texto: 'Spa' },
        { icone: 'fas fa-dumbbell', texto: 'Academia' },
        { icone: 'fas fa-utensils', texto: 'Restaurante' }
      ],
      descricao: 'Localizado no coração do Quartier Latin, este elegante hotel oferece quartos luxuosos com decoração única inspirada em diferentes períodos da história de Paris. A poucos passos do Jardim de Luxemburgo e do Panthéon.'
    };

    // Preencher hotel
    hotelContainer.innerHTML = `
      <div class="hotel-header">
        <img src="${hotel.imagem}" alt="${hotel.nome}" class="hotel-imagem">
        <div class="hotel-detalhes">
          <h4 class="hotel-nome">
            ${hotel.nome}
            <small>${hotel.categoria}</small>
          </h4>
          <div class="hotel-endereco">
            <i class="fas fa-map-marker-alt"></i>
            <span>${hotel.endereco}</span>
          </div>
          <div class="hotel-quarto">
            <strong>Tipo de Quarto:</strong> ${hotel.quarto}
          </div>
        </div>
      </div>
      <div class="hotel-facilidades">
        ${hotel.facilidades.map(facilidade => `
          <div class="facilidade">
            <i class="${facilidade.icone}"></i>
            <span>${facilidade.texto}</span>
          </div>
        `).join('')}
      </div>
      <div class="hotel-descricao">
        ${hotel.descricao}
      </div>
    `;
  }

  // Função para mostrar alerta personalizado
  function showCustomAlert(message, type = 'success') {
    // Remover alertas existentes
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => alert.remove());

    // Criar novo alerta
    const alert = document.createElement('div');
    alert.className = `custom-alert ${type}`;
    alert.innerHTML = `
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
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
}); 