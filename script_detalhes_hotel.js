document.addEventListener('DOMContentLoaded', () => {
  // Obter parâmetros da URL
  const urlParams = new URLSearchParams(window.location.search);
  const hotelId = parseInt(urlParams.get('id')) || 1;
  const checkInDate = urlParams.get('checkin') || '2025-05-25';
  const checkOutDate = urlParams.get('checkout') || '2025-05-26';
  const adultos = parseInt(urlParams.get('adultos')) || 1;
  const criancas = parseInt(urlParams.get('criancas')) || 0;

  // Função para mostrar mensagens
  function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }

  // Função para verificar se o hotel está nos favoritos
  function isHotelFavorited(hotelId) {
    const user = JSON.parse(sessionStorage.getItem('activeUser'));
    if (!user) return false;
    return user.favoriteHotels && user.favoriteHotels.includes(hotelId);
  }

  // Função para atualizar o visual do botão de favorito
  function updateFavoriteButton(isFavorited) {
    const favoriteBtn = document.getElementById('favorite-btn');
    if (favoriteBtn) {
      favoriteBtn.classList.toggle('active', isFavorited);
      const icon = favoriteBtn.querySelector('i');
      if (isFavorited) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
      } else {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
      }
      favoriteBtn.setAttribute('aria-label', 
        isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
      );
    }
  }

  // Função para alternar favorito
  function toggleFavorite() {
    const user = JSON.parse(sessionStorage.getItem('activeUser'));
    if (!user) {
      showMessage('Por favor, faz login para adicionar hotéis aos favoritos.', 'error');
      return;
    }

    user.favoriteHotels = user.favoriteHotels || [];
    const isFavorited = user.favoriteHotels.includes(hotelId);

    if (isFavorited) {
      user.favoriteHotels = user.favoriteHotels.filter(id => id !== hotelId);
      showMessage('Hotel removido dos favoritos!');
    } else {
      user.favoriteHotels.push(hotelId);
      showMessage('Hotel adicionado aos favoritos!');
    }

    // Atualizar sessionStorage e localStorage
    sessionStorage.setItem('activeUser', JSON.stringify(user));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], favoriteHotels: user.favoriteHotels };
      localStorage.setItem('users', JSON.stringify(users));
    }

    updateFavoriteButton(!isFavorited);
  }

  console.log('Parâmetros da URL:', { hotelId, checkInDate, checkOutDate, adultos, criancas }); // Debug

  const hotels = [
    {
      id: 1,
      name: "Grande Hotel Lisboa",
      images: [
        "media/hotel1_exterior.jpg",
        "media/hotel1_interior.jpg",
        "media/hotel1.jpg",
        "media/hotel1_rececao.jpg"
      ],
      location: "Lisboa, Portugal",
      rating: 9.2,
      reviews: 456,
      amenities: ["WiFi Gratuito", "Pequeno-almoço", "Restaurante"],
      basePrice: 120,
      type: "Hotel",
      distanceToCenter: 2,
      freeCancellation: true,
      description: "Localizado no coração de Lisboa, o Grande Hotel Lisboa oferece uma experiência luxuosa com vista deslumbrante para a cidade. Com quartos elegantemente decorados e serviços de primeira classe, é o destino perfeito para uma estadia memorável."
    },
    // ... outros hotéis
  ];

  const hotel = hotels.find(h => h.id === hotelId);
  const nights = calculateNights(checkInDate, checkOutDate);

  // Calcular preço baseado na ocupação
  function calculateTotalPrice(basePrice, adultos, criancas) {
    const baseGuests = 1;
    const adultIncreaseFactor = 1.2; // 20% de aumento por adulto adicional
    const childIncreaseFactor = 1.1;  // 10% de aumento por criança

    let priceAdjustment = 1;
    const extraAdults = Math.max(0, adultos - baseGuests);
    priceAdjustment *= Math.pow(adultIncreaseFactor, extraAdults);
    priceAdjustment *= Math.pow(childIncreaseFactor, criancas);

    return Math.round(basePrice * priceAdjustment);
  }

  // Calcular preço baseado na ocupação e número de quartos necessários
  function calculateTotalPriceWithRooms(basePrice, adultos, criancas) {
    // Calcular número de quartos necessários
    let standardRooms = Math.ceil(adultos / 2); // Base inicial: 2 adultos por quarto
    
    // Se há mais de 1 criança OU se há uma criança acima de 12 anos, precisa de quarto adicional
    if (criancas > 1) {
      standardRooms = 2; // Para 2 ou mais crianças, sempre precisamos de 2 quartos
    } else if (criancas === 1) {
      // Para 1 criança, depende da idade
      const childAge = document.querySelector('.child-age') ? 
        parseInt(document.querySelector('.child-age').value) || 0 : 13; // Se não encontrar idade, assume > 12
      if (childAge > 12) {
        standardRooms = 2;
      }
    }

    const pricePerRoom = calculateTotalPrice(basePrice, adultos, criancas);
    return pricePerRoom * standardRooms;
  }

  if (hotel) {
    // Verificar disponibilidade
    const isAvailable = checkAvailability(checkInDate, checkOutDate, hotel.unavailableDates);
  
    if (!isAvailable) {
      document.getElementById('hotel-name-header').textContent = hotel.name;
      document.getElementById('hotel-gallery').innerHTML = '';
      document.getElementById('hotel-description').innerHTML = `
        <p style="color: red; font-weight: bold;">Este hotel não está disponível nas datas selecionadas (${checkInDate} a ${checkOutDate}).</p>
      `;
      return;
    }
  
    // Inicializar botão de favoritos
    const favoriteBtn = document.getElementById('favorite-btn');
    if (favoriteBtn) {
      const isFavorited = isHotelFavorited(hotelId);
      updateFavoriteButton(isFavorited);
      favoriteBtn.addEventListener('click', toggleFavorite);
    }
  
    // Calcular preço total incluindo número de quartos necessários
    const totalPriceWithRooms = calculateTotalPriceWithRooms(hotel.basePrice, adultos, criancas);
    const totalPrice = totalPriceWithRooms * nights;
    const standardRooms = Math.ceil(adultos / 2); // Atualizar para usar a mesma lógica de quartos
  
    // Preencher informações do hotel
    document.getElementById('hotel-name-header').textContent = hotel.name;
    
    // Preencher a galeria
    document.getElementById('hotel-gallery').innerHTML = `
      ${hotel.images.map((img, index) => `<img src="${img}" alt="${hotel.name} - Foto ${index + 1}" data-index="${index}">`).join('')}
    `;
    
    document.getElementById('hotel-rating').textContent = `${hotel.rating} / 10`;
    document.getElementById('hotel-reviews').textContent = `${hotel.reviews} avaliações`;
    
    // Atualizar o preço com o novo formato
    const pricePerRoom = calculateTotalPrice(hotel.basePrice, adultos, criancas);
    document.getElementById('hotel-total-price').textContent = `${totalPriceWithRooms}€`;
    document.getElementById('hotel-stay-details').textContent = 
      `${nights} ${nights === 1 ? 'noite' : 'noites'}, ${adultos} ${adultos === 1 ? 'adulto' : 'adultos'}${criancas > 0 ? ` e ${criancas} ${criancas === 1 ? 'criança' : 'crianças'}` : ''} (${pricePerRoom}€ por quarto)`;
  
    document.getElementById('hotel-description').textContent = hotel.description;
  
    // Criar lista de comodidades, incluindo "Cancelamento Gratuito" se aplicável
    const amenitiesToShow = [...hotel.amenities];
    if (hotel.freeCancellation) {
      amenitiesToShow.push("Cancelamento Gratuito");
    }
  
    document.getElementById('hotel-amenities').innerHTML = `
      ${amenitiesToShow.map(amenity => `<span>${amenity}</span>`).join('')}
    `;
  
    // Adicionar o mapa após a seção de comodidades
    const leftColumn = document.querySelector('.left-column');
    const mapSection = document.createElement('div');
    mapSection.className = 'section map-section';
    mapSection.innerHTML = `
      <h2>Localização</h2>
      <div class="map-container">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3744.0575498679823!2d-9.1494325!3d38.7420487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd193308ec5a9f75%3A0x97d636c8dd380917!2sAvenida%205%20de%20Outubro%20197%2C%201050-054%20Lisboa!5e1!3m2!1sen!2spt!4v1748775175428!5m2!1sen!2spt"
          width="600" 
          height="450" 
          style="border:0; width: 100%; height: 250px;" 
          allowfullscreen="" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      </div>
    `;
    leftColumn.appendChild(mapSection);

    // Atualizar o texto do botão de ocupação
    const dropdownBtn = document.getElementById('dropdownBtn');
    if (dropdownBtn) {
      dropdownBtn.textContent = `${adultos} Adulto${adultos > 1 ? 's' : ''}, ${criancas} Criança${criancas > 1 ? 's' : ''}`;
    }

    // Atualizar os contadores
    const adultosCount = document.getElementById('adultosCount');
    const criancasCount = document.getElementById('criancasCount');
    if (adultosCount) adultosCount.textContent = adultos;
    if (criancasCount) criancasCount.textContent = criancas;

    // Configurar o modal
    const modal = document.getElementById('image-modal');
    let currentImageIndex = 0;

    // Atualizar o HTML do modal para incluir os botões de navegação
    modal.innerHTML = `
      <span class="close">&times;</span>
      <div class="modal-content">
        <img id="modal-image" src="" alt="Imagem Ampliada">
        <button class="nav-btn prev-btn" aria-label="Imagem anterior">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="nav-btn next-btn" aria-label="Próxima imagem">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    `;

    const modalImage = modal.querySelector('#modal-image');
    const closeBtn = modal.querySelector('.close');
    const prevBtn = modal.querySelector('.prev-btn');
    const nextBtn = modal.querySelector('.next-btn');

    // Função para atualizar a imagem do modal
    function updateModalImage(index) {
      currentImageIndex = index;
      modalImage.src = hotel.images[index];
      
      // Atualizar visibilidade dos botões de navegação
      prevBtn.style.display = index === 0 ? 'none' : 'block';
      nextBtn.style.display = index === hotel.images.length - 1 ? 'none' : 'block';
    }

    // Event listeners para todas as imagens
    document.querySelectorAll('#hotel-gallery img').forEach(img => {
      img.addEventListener('click', () => {
        const index = parseInt(img.getAttribute('data-index'));
        updateModalImage(index);
        modal.classList.add('active');
      });
    });

    // Event listeners para navegação
    prevBtn.addEventListener('click', () => {
      if (currentImageIndex > 0) {
        updateModalImage(currentImageIndex - 1);
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentImageIndex < hotel.images.length - 1) {
        updateModalImage(currentImageIndex + 1);
      }
    });

    // Fechar modal
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    // Fechar o modal ao clicar fora da imagem
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });

    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('active')) return;
      
      if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
        updateModalImage(currentImageIndex - 1);
      } else if (e.key === 'ArrowRight' && currentImageIndex < hotel.images.length - 1) {
        updateModalImage(currentImageIndex + 1);
      } else if (e.key === 'Escape') {
        modal.classList.remove('active');
      }
    });

    // Definir multiplicadores para os diferentes tipos de quarto
    const roomTypes = [
      {
        name: "Quarto Standard",
        title: "Quarto Standard com Vista Cidade",
        size: "25m²",
        capacity: 2,
        capacityText: "2 pessoas",
        bed: "1 cama queen-size",
        view: "Vista cidade",
        features: ["Cama Queen", "Vista cidade", "WiFi gratuito", "Ar condicionado"],
        images: ["media/hotel1.jpg", "media/suite_standard1.jpg"],
        priceMultiplier: 1 // Preço base
      },
      {
        name: "Quarto Deluxe",
        title: "Quarto Deluxe com Vista Rio",
        size: "35m²",
        capacity: 3,
        capacityText: "2-3 pessoas",
        bed: "1 cama king-size",
        view: "Vista rio",
        features: ["Cama King", "Vista rio", "Minibar", "Cofre", "Roupão"],
        images: ["media/suite_conforto1.jpg", "media/suite_conforto2.jpg"],
        priceMultiplier: 1.5 // 50% mais caro que o Standard
      },
      {
        name: "Suíte Executive",
        title: "Suíte Executive com Vista Panorâmica",
        size: "50m²",
        capacity: 4,
        capacityText: "4 pessoas",
        bed: "1 cama king-size + sofá-cama",
        view: "Vista panorâmica",
        features: ["Sala separada", "Vista panorâmica", "Serviço de quarto 24h", "Champagne de boas-vindas"],
        images: ["media/suite_executiva1.jpg", "media/suite_executiva2.jpg"],
        priceMultiplier: 2.33 // 133% mais caro que o Standard
      }
    ];

    // Calcular o total de hóspedes
    const totalGuests = adultos + criancas;

    // Função para calcular quantidade recomendada de quartos
    function calculateRecommendedRooms(roomType, totalGuests) {
      if (roomType === "Quarto Standard") {
        let standardRooms = Math.ceil(adultos / 2);
        if (criancas > 1) {
          standardRooms = 2; // Para 2 ou mais crianças, sempre precisamos de 2 quartos
        } else if (criancas === 1) {
          // Para 1 criança, depende da idade
          const childAge = document.querySelector('.child-age') ? 
            parseInt(document.querySelector('.child-age').value) || 0 : 13;
          if (childAge > 12) {
            standardRooms = 2;
          }
        }
        return standardRooms;
      } else if (roomType === "Quarto Deluxe") {
        return Math.ceil(totalGuests / 3);
      } else {
        return Math.ceil(totalGuests / 4);
      }
    }

    // Gerar mensagem de recomendação
    function generateRecommendation(totalGuests, roomTypes) {
      // Primeiro, criar o modal para as imagens dos quartos
      const modalHtml = `
        <div id="room-image-modal" class="modal">
          <span class="close">&times;</span>
          <div class="modal-content">
            <img id="room-modal-image" src="" alt="Imagem Ampliada do Quarto">
            <button class="nav-btn prev-btn" aria-label="Imagem anterior">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button class="nav-btn next-btn" aria-label="Próxima imagem">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      `;

      // Adicionar o modal ao body se ainda não existir
      if (!document.getElementById('room-image-modal')) {
        document.body.insertAdjacentHTML('beforeend', modalHtml);
      }

      let recommendation = `<div class="room-recommendation">
        <h3><i class="fas fa-info-circle"></i> Opções de acomodação para ${adultos} ${adultos === 1 ? 'adulto' : 'adultos'}${criancas > 0 ? ` e ${criancas} ${criancas === 1 ? 'criança' : 'crianças'}` : ''}</h3>
        <p>Para ${totalGuests} ${totalGuests === 1 ? 'pessoa' : 'pessoas'}, estas são as suas opções:</p>
        <div class="recommendation-options">`;
      
      // Opção 1: Quartos Standard
      if (totalGuests <= 6) {
        const standardRooms = calculateRecommendedRooms("Quarto Standard", totalGuests);
        if (standardRooms <= 3) {
          const totalPrice = Math.round(calculateTotalPrice(hotel.basePrice, adultos, criancas)) * standardRooms * nights;
          recommendation += `
            <div class="option-card">
              <div class="option-header" onclick="toggleOptionDetails(this)">
                <div class="option-title">
                  <strong>Opção Económica:</strong> 
                  ${standardRooms} ${standardRooms === 1 ? 'Quarto' : 'Quartos'} Standard
                  <span class="total-price">${totalPrice}€</span>
                </div>
                <i class="fas fa-chevron-down"></i>
              </div>
              <div class="option-details">
                <div class="room-info-container">
                  <div class="room-image-gallery">
                    <div class="room-image" onclick="openRoomModal('standard', 0)">
                      <img src="${roomTypes[0].images[0]}" alt="${roomTypes[0].title}">
                      <div class="image-overlay">
                        <i class="fas fa-expand"></i>
                        <span>${roomTypes[0].images.length} fotos</span>
                      </div>
                    </div>
                  </div>
                  <div class="room-details">
                    <h4>${roomTypes[0].title}</h4>
                    <div class="room-specs">
                      <p><strong>Acomodação:</strong> ${roomTypes[0].title}</p>
                      <p><strong>Cama:</strong> ${roomTypes[0].bed}</p>
                      <p><strong>Área:</strong> ${roomTypes[0].size}</p>
                      <p><strong>Vista:</strong> ${roomTypes[0].view}</p>
                    </div>
                    <div class="room-amenities">
                      <div class="amenities-container">
                        <div class="amenities-grid">
                          <span><i class="fas fa-wifi"></i> Wi-Fi gratuito</span>
                          <span><i class="fas fa-utensils"></i> Restaurante</span>
                          <span><i class="fas fa-concierge-bell"></i> Serviço de quarto 24h</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="option-booking">
                  <div class="booking-controls">
                    <div class="quantity-info">
                      Quantidade: ${standardRooms} ${standardRooms === 1 ? 'quarto' : 'quartos'}
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCartFromOption('Quarto Standard', ${totalPrice/standardRooms}, this)">
                      <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
                    </button>
                  </div>
                  <div class="price-summary">
                    <span class="price-per-night">${Math.round(totalPrice/standardRooms/nights)}€ por noite</span>
                    <span class="total-nights">${nights} ${nights === 1 ? 'noite' : 'noites'}</span>
                    <span class="final-price">${totalPrice}€ total</span>
                  </div>
                </div>
              </div>
            </div>`;
        }
      }

      // Opção 2: Quartos Deluxe
      if (totalGuests <= 6) {
        const deluxeRooms = calculateRecommendedRooms(roomTypes[1].capacity, totalGuests);
        if (deluxeRooms <= 2) {
          const totalPrice = Math.round(calculateTotalPrice(hotel.basePrice, adultos, criancas) * roomTypes[1].priceMultiplier) * deluxeRooms * nights;
          recommendation += `
            <div class="option-card">
              <div class="option-header" onclick="toggleOptionDetails(this)">
                <div class="option-title">
                  <strong>Opção Conforto:</strong> 
                  ${deluxeRooms} ${deluxeRooms === 1 ? 'Quarto' : 'Quartos'} Deluxe
                  <span class="total-price">${totalPrice}€</span>
                </div>
                <i class="fas fa-chevron-down"></i>
              </div>
              <div class="option-details">
                <div class="room-info-container">
                  <div class="room-image-gallery">
                    <div class="room-image" onclick="openRoomModal('deluxe', 0)">
                      <img src="${roomTypes[1].images[0]}" alt="${roomTypes[1].title}">
                      <div class="image-overlay">
                        <i class="fas fa-expand"></i>
                        <span>${roomTypes[1].images.length} fotos</span>
                      </div>
                    </div>
                  </div>
                  <div class="room-details">
                    <h4>${roomTypes[1].title}</h4>
                    <div class="room-specs">
                      <p><strong>Acomodação:</strong> ${roomTypes[1].title}</p>
                      <p><strong>Cama:</strong> ${roomTypes[1].bed}</p>
                      <p><strong>Área:</strong> ${roomTypes[1].size}</p>
                      <p><strong>Vista:</strong> ${roomTypes[1].view}</p>
                    </div>
                    <div class="room-amenities">
                      <div class="amenities-grid">
                        <span><i class="fas fa-wifi"></i> Wi-Fi gratuito</span>
                        <span><i class="fas fa-utensils"></i> Restaurante</span>
                        <span><i class="fas fa-coffee"></i> Pequeno-almoço</span>
                        <span><i class="fas fa-concierge-bell"></i> Serviço de quarto 24h</span>
                        <span><i class="fas fa-glass-martini"></i> Minibar</span>
                        <span><i class="fas fa-lock"></i> Cofre</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="option-booking">
                  <div class="booking-controls">
                    <div class="quantity-info">
                      Quantidade: ${deluxeRooms} ${deluxeRooms === 1 ? 'quarto' : 'quartos'}
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCartFromOption('Quarto Deluxe', ${totalPrice/deluxeRooms}, this)">
                      <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
                    </button>
                  </div>
                  <div class="price-summary">
                    <span class="price-per-night">${Math.round(totalPrice/deluxeRooms/nights)}€ por noite</span>
                    <span class="total-nights">${nights} ${nights === 1 ? 'noite' : 'noites'}</span>
                    <span class="final-price">${totalPrice}€ total</span>
                  </div>
                </div>
              </div>
            </div>`;
        }
      }

      // Opção 3: Suíte Executive
      if (totalGuests <= 4) {
        const executiveRooms = calculateRecommendedRooms(roomTypes[2].capacity, totalGuests);
        if (executiveRooms === 1) {
          const totalPrice = Math.round(calculateTotalPrice(hotel.basePrice, adultos, criancas) * roomTypes[2].priceMultiplier) * nights;
          recommendation += `
            <div class="option-card">
              <div class="option-header" onclick="toggleOptionDetails(this)">
                <div class="option-title">
                  <strong>Opção Premium:</strong> 
                  1 Suíte Executive
                  <span class="total-price">${totalPrice}€</span>
                </div>
                <i class="fas fa-chevron-down"></i>
              </div>
              <div class="option-details">
                <div class="room-info-container">
                  <div class="room-image-gallery">
                    <div class="room-image" onclick="openRoomModal('executive', 0)">
                      <img src="${roomTypes[2].images[0]}" alt="${roomTypes[2].title}">
                      <div class="image-overlay">
                        <i class="fas fa-expand"></i>
                        <span>${roomTypes[2].images.length} fotos</span>
                      </div>
                    </div>
                  </div>
                  <div class="room-details">
                    <h4>${roomTypes[2].title}</h4>
                    <div class="room-specs">
                      <p><strong>Acomodação:</strong> ${roomTypes[2].title}</p>
                      <p><strong>Cama:</strong> ${roomTypes[2].bed}</p>
                      <p><strong>Área:</strong> ${roomTypes[2].size}</p>
                      <p><strong>Vista:</strong> ${roomTypes[2].view}</p>
                    </div>
                    <div class="room-amenities">
                      <div class="amenities-grid">
                        <span><i class="fas fa-wifi"></i> Wi-Fi gratuito</span>
                        <span><i class="fas fa-utensils"></i> Restaurante</span>
                        <span><i class="fas fa-coffee"></i> Pequeno-almoço</span>
                        <span><i class="fas fa-concierge-bell"></i> Serviço de quarto 24h</span>
                        <span><i class="fas fa-glass-martini"></i> Minibar</span>
                        <span><i class="fas fa-lock"></i> Cofre</span>
                        <span><i class="fas fa-couch"></i> Sala separada</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="option-booking">
                  <div class="booking-controls">
                    <div class="quantity-info">
                      Quantidade: 1 quarto
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCartFromOption('Suíte Executive', ${totalPrice}, this)">
                      <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
                    </button>
                  </div>
                  <div class="price-summary">
                    <span class="price-per-night">${Math.round(totalPrice/nights)}€ por noite</span>
                    <span class="total-nights">${nights} ${nights === 1 ? 'noite' : 'noites'}</span>
                    <span class="final-price">${totalPrice}€ total</span>
                  </div>
                </div>
              </div>
            </div>`;
        }
      }

      recommendation += `
        </div>
        <p class="recommendation-note"><i class="fas fa-lightbulb"></i> Clique nas opções para ver mais detalhes.</p>
      </div>`;

      return recommendation;
    }

    // Adicionar função para toggle dos detalhes
    window.toggleOptionDetails = function(header) {
      const card = header.closest('.option-card');
      const details = card.querySelector('.option-details');
      const arrow = header.querySelector('.fa-chevron-down');
      
      // Toggle da classe active
      card.classList.toggle('active');
      
      // Animar a seta
      if (card.classList.contains('active')) {
        arrow.style.transform = 'rotate(180deg)';
        details.style.maxHeight = details.scrollHeight + 'px';
      } else {
        arrow.style.transform = 'rotate(0)';
        details.style.maxHeight = '0';
      }
    };

    // Adicionar função para adicionar ao carrinho a partir das opções
    window.addToCartFromOption = function(roomType, basePrice, button) {
      try {
        // Verificar se o usuário está logado
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.loggedIn) {
          localStorage.setItem('lastPage', window.location.href);
          showMessage('Faça login para adicionar itens ao carrinho.', 'error');
          window.location.href = 'login.html';
          return;
        }

        // Determinar a quantidade baseada no tipo de quarto e número de hóspedes
        let quantidade;
        const totalGuests = adultos + criancas;
        
        if (roomType === 'Suíte Executive') {
          quantidade = 1;
        } else if (roomType === 'Quarto Deluxe') {
          quantidade = Math.ceil(totalGuests / 3);
        } else { // Quarto Standard
          quantidade = Math.ceil(totalGuests / 2);
        }

        // Carregar itens existentes do carrinho
        let carrinhoItens = JSON.parse(localStorage.getItem("carrinhoItens")) || [];
        
        // Verificar se o quarto já está no carrinho
        const itemExistente = carrinhoItens.find(item => 
          item.tipo === 'hotel' && 
          item.nome === hotel.name &&
          item.quarto === roomType &&
          item.dataIda === checkInDate &&
          item.dataVolta === checkOutDate
        );

        if (itemExistente) {
          showMessage('Este quarto já está no seu carrinho!', 'info');
          return;
        }

        // Criar novo item
        const novoItem = {
          id: Date.now(),
          tipo: 'hotel',
          nome: hotel.name,
          quarto: roomType,
          dataIda: checkInDate,
          dataVolta: checkOutDate,
          adultos: adultos,
          criancas: criancas,
          preco: basePrice * nights * quantidade,
          precoNoite: basePrice,
          noites: nights,
          imagem: "media/hotel1_rececao.jpg",
          quantidade: quantidade
        };

        // Adicionar ao carrinho
        carrinhoItens.push(novoItem);
        
        // Salvar no localStorage
        localStorage.setItem("carrinhoItens", JSON.stringify(carrinhoItens));
        
        // Atualizar o botão
        button.innerHTML = '<i class="fas fa-check"></i> Adicionado';
        button.classList.add('adicionado');
        button.disabled = true;
        
        // Atualizar o contador do carrinho
        const carrinhoContador = document.querySelector('.carrinho-contador');
        if (carrinhoContador) {
          carrinhoContador.textContent = carrinhoItens.length;
        }
        
        showMessage(`${quantidade} ${quantidade === 1 ? 'quarto' : 'quartos'} ${roomType} adicionado${quantidade === 1 ? '' : 's'} ao carrinho com sucesso!`, 'success');
      } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error);
        showMessage('Erro ao adicionar ao carrinho. Tente novamente.', 'error');
      }
    };

    // Função para abrir o modal com as imagens do quarto
    window.openRoomModal = function(roomType, initialIndex) {
      const modal = document.getElementById('room-image-modal');
      const modalImg = document.getElementById('room-modal-image');
      const prevBtn = modal.querySelector('.prev-btn');
      const nextBtn = modal.querySelector('.next-btn');
      const closeBtn = modal.querySelector('.close');
      
      let currentRoom;
      switch(roomType) {
        case 'standard':
          currentRoom = roomTypes[0];
          break;
        case 'deluxe':
          currentRoom = roomTypes[1];
          break;
        case 'executive':
          currentRoom = roomTypes[2];
          break;
      }

      let currentIndex = initialIndex;
      const images = currentRoom.images;

      function updateImage() {
        modalImg.src = images[currentIndex];
        prevBtn.style.display = currentIndex === 0 ? 'none' : 'block';
        nextBtn.style.display = currentIndex === images.length - 1 ? 'none' : 'block';
      }

      // Event listeners
      prevBtn.onclick = () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateImage();
        }
      };

      nextBtn.onclick = () => {
        if (currentIndex < images.length - 1) {
          currentIndex++;
          updateImage();
        }
      };

      closeBtn.onclick = () => {
        modal.classList.remove('active');
      };

      modal.onclick = (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      };

      // Navegação por teclado
      document.addEventListener('keydown', function(e) {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
          currentIndex--;
          updateImage();
        } else if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
          currentIndex++;
          updateImage();
        } else if (e.key === 'Escape') {
          modal.classList.remove('active');
        }
      });

      // Mostrar o modal e a primeira imagem
      updateImage();
      modal.classList.add('active');
    };

    // Atualizar a seção de tipos de quartos
    const roomTypesSection = document.querySelector('.room-types');
    roomTypesSection.innerHTML = `      <h2>Tipos de Quartos</h2>
      ${generateRecommendation(totalGuests, roomTypes)}
    `;
  } else {
    document.getElementById('hotel-name-header').textContent = 'Hotel Não Encontrado';
    document.getElementById('hotel-gallery').innerHTML = '';
    document.getElementById('hotel-description').innerHTML = '<p>Não foi possível carregar os detalhes do hotel.</p>';
  }

  function calculateNights(checkInDate, checkOutDate) {
    if (!checkInDate || !checkOutDate) return 1;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut - checkIn;
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  }

  function checkAvailability(checkInDate, checkOutDate, unavailableDates) {
    if (!checkInDate || !checkOutDate || !unavailableDates || unavailableDates.length === 0) return true;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const stayDates = [];

    let currentDate = new Date(checkIn);
    while (currentDate <= checkOut) {
      stayDates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return !stayDates.some(date => unavailableDates.includes(date));
  }

  // Adicionar eventos para o dropdown de ocupação
  const dropdownBtn = document.getElementById('dropdownBtn');
  const dropdownContent = document.getElementById('dropdownContent');
  const confirmBtn = document.getElementById('confirmBtn');
  const adultosCount = document.getElementById('adultosCount');
  const criancasCount = document.getElementById('criancasCount');

  if (dropdownBtn && dropdownContent && confirmBtn) {
    // Atualizar texto inicial do botão com os valores da URL
    dropdownBtn.textContent = `${adultos} Adulto${adultos > 1 ? 's' : ''}, ${criancas} Criança${criancas > 1 ? 's' : ''}`;

    // Atualizar contadores com os valores da URL
    if (adultosCount) adultosCount.textContent = adultos;
    if (criancasCount) criancasCount.textContent = criancas;

    // Adicionar evento para atualizar preço quando confirmar ocupação
    confirmBtn.addEventListener('click', () => {
      const newAdultos = parseInt(adultosCount.textContent);
      const newCriancas = parseInt(criancasCount.textContent);
      const newPrice = calculateTotalPrice(hotel.basePrice, newAdultos, newCriancas);
      
      document.getElementById('hotel-price').innerHTML = `
        ${newPrice}€ <span>por noite</span>
        <div class="price-details" style="font-size: 0.8rem; color: #666; margin-top: 5px;">
          Preço base: ${hotel.basePrice}€
          ${newAdultos > 1 ? `<br>+ ${newAdultos - 1} adulto(s) extra` : ''}
          ${newCriancas > 0 ? `<br>+ ${newCriancas} criança(s)` : ''}
        </div>
      `;

      dropdownContent.style.display = 'none';
    });
  }

  // Função auxiliar para obter o ícone correto para cada feature
  function getIconForFeature(feature) {
    const iconMap = {
      'Cama Queen': 'bed',
      'Cama King': 'bed',
      'Vista cidade': 'eye',
      'Vista rio': 'eye',
      'Vista panorâmica': 'binoculars',
      'WiFi gratuito': 'wifi',
      'Ar condicionado': 'fan',
      'Minibar': 'glass-martini',
      'Cofre': 'lock',
      'Roupão': 'tshirt',
      'Sala separada': 'couch',
      'Serviço de quarto 24h': 'concierge-bell',
      'Champagne de boas-vindas': 'champagne-glasses'
    };
    return iconMap[feature] || 'check';
  }

  // Função para adicionar ao carrinho
  function adicionarAoCarrinho(roomType, roomPrice) {
    try {
      // Verificar se o usuário está logado
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.loggedIn) {
        localStorage.setItem('lastPage', window.location.href);
        showMessage('Faça login para adicionar itens ao carrinho.', 'error');
        window.location.href = 'login.html';
        return;
      }

      // Obter a quantidade selecionada
      const quantitySelect = document.querySelector(`#quantity-${roomType}`);
      const quantidade = parseInt(quantitySelect.value);

      // Carregar itens existentes do carrinho
      let carrinhoItens = JSON.parse(localStorage.getItem("carrinhoItens")) || [];
      
      // Verificar se o quarto já está no carrinho
      const itemExistente = carrinhoItens.find(item => 
        item.tipo === 'hotel' && 
        item.nome === hotel.name &&
        item.quarto === roomType &&
        item.dataIda === checkInDate &&
        item.dataVolta === checkOutDate
      );

      if (itemExistente) {
        showMessage('Este quarto já está no seu carrinho!', 'info');
        return;
      }

      // Criar novo item
      const novoItem = {
        id: Date.now(),
        tipo: 'hotel',
        nome: hotel.name,
        quarto: roomType,
        dataIda: checkInDate,
        dataVolta: checkOutDate,
        adultos: adultos,
        criancas: criancas,
        preco: roomPrice * nights * quantidade,
        precoNoite: roomPrice,
        noites: nights,
        imagem: "media/hotel1_rececao.jpg",
        quantidade: quantidade
      };

      // Adicionar ao carrinho
      carrinhoItens.push(novoItem);
      
      // Salvar no localStorage
      localStorage.setItem("carrinhoItens", JSON.stringify(carrinhoItens));
      
      // Atualizar o botão
      const button = event.target;
      button.innerHTML = '<i class="fas fa-check"></i> Adicionado';
      button.classList.add('adicionado');
      button.disabled = true;
      
      // Atualizar o contador do carrinho
      const carrinhoContador = document.querySelector('.carrinho-contador');
      if (carrinhoContador) {
        carrinhoContador.textContent = carrinhoItens.length;
      }
      
      showMessage(`${quantidade} ${quantidade === 1 ? 'quarto' : 'quartos'} ${roomType} adicionado${quantidade === 1 ? '' : 's'} ao carrinho com sucesso!`, 'success');
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      showMessage('Erro ao adicionar ao carrinho. Tente novamente.', 'error');
    }
  }

  // Adicionar event listeners aos botões de reserva
  document.querySelectorAll('.book-room-btn').forEach(button => {
    button.addEventListener('click', function(event) {
      const roomCard = this.closest('.room-card');
      const roomType = roomCard.querySelector('h3').textContent;
      const roomPrice = parseInt(roomCard.querySelector('.room-price span').textContent);
      adicionarAoCarrinho(roomType, roomPrice);
    });
  });

  // Verificar itens no carrinho ao carregar a página
  function verificarItensCarrinho() {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.loggedIn) return;

      const carrinhoItens = JSON.parse(localStorage.getItem("carrinhoItens")) || [];
      
      document.querySelectorAll('.room-card').forEach(card => {
        const roomType = card.querySelector('h3').textContent;
        const itemNoCarrinho = carrinhoItens.find(item => 
          item.tipo === 'hotel' && 
          item.nome === hotel.name &&
          item.quarto === roomType &&
          item.dataIda === checkInDate &&
          item.dataVolta === checkOutDate
        );

        if (itemNoCarrinho) {
          const button = card.querySelector('.book-room-btn');
          button.innerHTML = '<i class="fas fa-check"></i> Adicionado';
          button.classList.add('adicionado');
          button.disabled = true;
        }
      });
    } catch (e) {
      console.error('Erro ao verificar carrinho:', e);
    }
  }

  // Chamar a verificação ao carregar a página
  verificarItensCarrinho();
});
