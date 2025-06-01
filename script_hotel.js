document.addEventListener('DOMContentLoaded', () => {
  // Função para calcular preço base por quarto
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

  // Calcular preço total com quartos necessários
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

  // Array de hotéis
  const hotels = [
    {
      id: 1,
      name: "Grande Hotel Lisboa",
      image: "media/hotel1.jpg",
      location: "Lisboa, Portugal",
      rating: 9.2,
      reviews: 456,
      amenities: ["Wifi", "Pequeno-almoço", "Restaurante"],
      price: 120,
      type: "Hotel",
      distanceToCenter: 2,
      freeCancellation: true,
      basePrice: 120,
      unavailableDates: ["2025-05-25", "2025-05-26"]
    },
    {
      id: 2,
      name: "Riverside Suites & Spa",
      image: "media/hotel2.jpg",
      location: "Margem do Rio Tejo, Portugal",
      rating: 8.8,
      reviews: 324,
      amenities: ["Wifi", "SPA"],
      price: 95,
      type: "Resort",
      distanceToCenter: 5,
      freeCancellation: false,
      basePrice: 95,
      unavailableDates: ["2025-05-25", "2025-05-26"]
    },
    {
      id: 3,
      name: "Alfama Boutique Hotel",
      image: "media/hotel3.jpg",
      location: "Alfama, Portugal",
      rating: 9.0,
      reviews: 278,
      amenities: ["Wifi", "Piscina"],
      price: 110,
      type: "Hotel",
      distanceToCenter: 1.5,
      freeCancellation: true,
      basePrice: 110,
      unavailableDates: ["2025-05-28"]
    },
    {
      id: 4,
      name: "Monte Verde Resort",
      image: "media/hotel4.jpg",
      location: "Serra da Estrela, Portugal",
      rating: 9.5,
      reviews: 229,
      amenities: ["Wifi", "Estacionamento", "SPA"],
      price: 140,
      type: "Resort",
      distanceToCenter: 10,
      freeCancellation: false,
      basePrice: 140,
      unavailableDates: []
    },
    {
      id: 5,
      name: "The Manhattan Grand",
      image: "media/hotel5.jpg",
      location: "Nova Iorque, EUA",
      rating: 8.9,
      reviews: 1024,
      amenities: ["Wifi", "Pequeno-almoço"],
      price: 210,
      type: "Hotel",
      distanceToCenter: 3,
      freeCancellation: true,
      basePrice: 210,
      unavailableDates: []
    },
    {
      id: 6,
      name: "Tokyo View Hotel",
      image: "media/hotel6.jpg",
      location: "Shinjuku, Tóquio",
      rating: 9.1,
      reviews: 874,
      amenities: ["Wifi", "Restaurante"],
      price: 180,
      type: "Hotel",
      distanceToCenter: 4,
      freeCancellation: false,
      basePrice: 180,
      unavailableDates: ["2025-05-27"]
    },
    {
      id: 7,
      name: "La Belle Vue",
      image: "media/hotel7.jpg",
      location: "Paris, França",
      rating: 9.3,
      reviews: 653,
      amenities: ["Wifi", "Piscina"],
      price: 200,
      type: "Hotel",
      distanceToCenter: 2.5,
      freeCancellation: true,
      basePrice: 200,
      unavailableDates: ["2025-05-25", "2025-05-26"]
    },
    {
      id: 8,
      name: "Ocean Breeze Resort",
      image: "media/hotel8.jpg",
      location: "Phuket, Tailândia",
      rating: 8.8,
      reviews: 721,
      amenities: ["Wifi", "Estacionamento"],
      price: 92,
      type: "Resort",
      distanceToCenter: 8,
      freeCancellation: false,
      basePrice: 92,
      unavailableDates: []
    },
  ];

  // Save hotels to localStorage
  localStorage.setItem('hotels', JSON.stringify(hotels));

  // Variáveis de paginação
  let displayedHotels = 4;
  const hotelsPerLoad = 4;
  let baseMaxPrice = 500;
  let filteredHotelsBeforeAvailability = []; // Para armazenar hotéis antes do filtro de disponibilidade

  // Elementos do DOM
  const searchForm = document.getElementById('search-form');
  const hotelList = document.getElementById('hotel-list');
  const resultsCount = document.getElementById('results-count');
  const noHotelsMessage = document.getElementById('no-hotels');
  const loadMoreBtn = document.getElementById('load-more');
  const loadingBar = document.getElementById('loading-bar');
  const destinationFilter = document.getElementById('destination');
  const checkInDateFilter = document.getElementById('check-in-date');
  const checkOutDateFilter = document.getElementById('check-out-date');
  const nameFilter = document.getElementById('nome-hotel');
  const suggestionsList = document.getElementById('suggestions');
  const typeFilter = document.getElementById('tipo-alojamento');
  const priceFilter = document.getElementById('price-range');
  const priceValue = document.getElementById('price-value');
  const distanceFilter = document.getElementById('distancia-centro');
  const distanceValue = document.getElementById('distancia-value');
  const freeCancellationFilter = document.getElementById('cancelamento-gratuito');
  const clearFiltersBtn = document.getElementById('clear-filters');
  const sortBy = document.getElementById('sort-by');
  const dropdownBtn = document.getElementById('dropdownBtn');
  const dropdownContent = document.getElementById('dropdownContent');
  const confirmBtn = document.getElementById('confirmBtn');
  const adultosCount = document.getElementById('adultosCount');
  const criancasCount = document.getElementById('criancasCount');
  const quartosCount = document.getElementById('quartosCount');
  const amenitiesDropdownBtn = document.getElementById('amenitiesDropdownBtn');
  const amenitiesDropdownContent = document.getElementById('amenitiesDropdownContent');
  const amenitiesConfirmBtn = document.getElementById('amenitiesConfirmBtn');
  const amenitiesFilter = document.getElementById('amenities-filter');

  // Definir data mínima para os campos de data
  const today = new Date('2025-05-25');
  checkInDateFilter.min = today.toISOString().split('T')[0];
  checkOutDateFilter.min = today.toISOString().split('T')[0];

  // Função para obter parâmetros da URL
  function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      destino: params.get('destino') || '',
      checkin: params.get('checkin') || '',
      checkout: params.get('checkout') || '',
      adultos: parseInt(params.get('adultos')) || 1,
      criancas: parseInt(params.get('criancas')) || 0,
      quartos: parseInt(params.get('quartos')) || 1,
      idadesCriancas: params.get('idades-criancas') ? params.get('idades-criancas').split(',').map(Number) : [],
    };
  }

  // Aplicar parâmetros da URL
  const queryParams = getQueryParams();
  destinationFilter.value = queryParams.destino;
  checkInDateFilter.value = queryParams.checkin;
  checkOutDateFilter.value = queryParams.checkout;
  adultosCount.textContent = queryParams.adultos;
  criancasCount.textContent = queryParams.criancas;
  quartosCount.textContent = queryParams.quartos;
  dropdownBtn.textContent = `${queryParams.adultos} Adulto${queryParams.adultos > 1 ? 's' : ''}, ${queryParams.criancas} Criança${queryParams.criancas > 1 ? 's' : ''}, ${queryParams.quartos} Quarto${queryParams.quartos > 1 ? 's' : ''}`;

  // Atualizar idades das crianças
  if (queryParams.idadesCriancas.length > 0) {
    updateChildAgeInputs();
    const childAgeSelects = document.querySelectorAll('.child-age');
    queryParams.idadesCriancas.forEach((age, index) => {
      if (childAgeSelects[index]) {
        childAgeSelects[index].value = age;
      }
    });
  }

  // Função para atualizar os campos de idade das crianças
  function updateChildAgeInputs() {
    const criancas = parseInt(criancasCount.textContent);
    const childAgeInputs = document.getElementById('childAgeInputs');
    const childAgesSection = document.getElementById('childAges');
    childAgeInputs.innerHTML = '';

    if (criancas > 0) {
      for (let i = 0; i < criancas; i++) {
        const div = document.createElement('div');
        div.classList.add('child-age-group');
        div.innerHTML = `
          <label>Criança ${i + 1}:</label>
          <select class="child-age" data-child="${i}">
            ${Array.from({ length: 18 }, (_, age) => `<option value="${age}">${age} anos</option>`).join('')}
          </select>
        `;
        childAgeInputs.appendChild(div);
      }
      childAgesSection.style.display = 'block';
    } else {
      childAgesSection.style.display = 'none';
    }
  }

  // Função para calcular o número de noites
  function calculateNights(checkInDate, checkOutDate) {
    if (!checkInDate || !checkOutDate) return 1;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut - checkIn;
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  }

  // Função para verificar disponibilidade
  function checkAvailability(checkInDate, checkOutDate, unavailableDates) {
    if (!checkInDate || !checkOutDate || !unavailableDates || unavailableDates.length === 0) return true;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const stayDates = [];

    // Gerar todas as datas do período de estadia
    let currentDate = new Date(checkIn);
    while (currentDate <= checkOut) {
      stayDates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Verificar se alguma data de estadia está indisponível
    return !stayDates.some(date => unavailableDates.includes(date));
  }

  // Função para validar se a data é passada
  function isPastDate(dateStr) {
    const today = new Date('2025-05-29');
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateStr);
    return date < today;
  }

  // Função para atualizar o preço dos hotéis com base no número de hóspedes
  function updatePriceRangeLimit() {
    const adultos = parseInt(adultosCount.textContent);
    const criancas = parseInt(criancasCount.textContent);
    const childAges = [];
    document.querySelectorAll('.child-age').forEach(select => {
      childAges.push(parseInt(select.value));
    });

    let effectiveAdults = adultos;
    let effectiveChildren = 0;
    childAges.forEach(age => {
      if (age > 12) {
        effectiveAdults++;
      } else {
        effectiveChildren++;
      }
    });

    const baseGuests = 1;
    const adultIncreaseFactor = 1.2;
    const childIncreaseFactor = 1.1;

    hotels.forEach(hotel => {
      let priceAdjustment = 1;
      const extraAdults = Math.max(0, effectiveAdults - baseGuests);
      priceAdjustment *= Math.pow(adultIncreaseFactor, extraAdults);
      priceAdjustment *= Math.pow(childIncreaseFactor, effectiveChildren);
      hotel.price = Math.round(hotel.basePrice * priceAdjustment);
    });

    const highestPrice = Math.max(...hotels.map(hotel => hotel.price));
    baseMaxPrice = Math.ceil(highestPrice * 1.1);
    priceFilter.max = baseMaxPrice;
    priceFilter.value = baseMaxPrice;
    priceValue.textContent = `Até ${baseMaxPrice}€`;

    applyFiltersAndSort();
  }

  priceFilter.addEventListener('input', () => {
    priceValue.textContent = `Até ${priceFilter.value}€`;
    applyFiltersAndSort();
  });

  distanceFilter.addEventListener('input', () => {
    distanceValue.textContent = `Até ${distanceFilter.value}km`;
    applyFiltersAndSort();
  });

  // Função para validar datas
  function checkDates() {
    const checkInDate = document.getElementById('check-in-date');
    const checkOutDate = document.getElementById('check-out-date');
    
    if (!checkInDate || !checkOutDate) return;

    checkOutDate.setCustomValidity('');
    if (checkInDate.value && checkOutDate.value) {
      const checkIn = new Date(checkInDate.value);
      const checkOut = new Date(checkOutDate.value);
      if (checkOut < checkIn) {
        checkOutDate.setCustomValidity('A data de check-out não pode ser anterior à data de check-in.');
      }
    }
  }

  // Adicionar validação de data aos inputs
  checkInDateFilter.addEventListener('change', function() {
    this.setCustomValidity('');
    if (checkOutDateFilter.value) {
      checkDates();
    }
    this.reportValidity();
  });

  checkOutDateFilter.addEventListener('change', function() {
    this.setCustomValidity('');
    if (checkInDateFilter.value) {
      checkDates();
    }
    this.reportValidity();
  });

  function validateSearchForm() {
    const destination = destinationFilter;
    const checkInDate = checkInDateFilter;
    const checkOutDate = checkOutDateFilter;

    // Resetar todas as mensagens de erro
    [destination, checkInDate, checkOutDate].forEach(input => {
      if (input) input.setCustomValidity('');
    });

    // Validar destino
    if (!destination.value.trim()) {
      destination.setCustomValidity('Por favor, insira o destino.');
      destination.reportValidity();
      return false;
    }

    // Validar data de check-in
    if (!checkInDate.value) {
      checkInDate.setCustomValidity('Por favor, insira a data de check-in.');
      checkInDate.reportValidity();
      return false;
    }

    // Validar se a data de check-in não é no passado
    if (isPastDate(checkInDate.value)) {
      checkInDate.setCustomValidity('A data de check-in não pode ser no passado.');
      checkInDate.reportValidity();
      return false;
    }

    // Validar data de check-out
    if (!checkOutDate.value) {
      checkOutDate.setCustomValidity('Por favor, insira a data de check-out.');
      checkOutDate.reportValidity();
      return false;
    }

    // Validar se a data de check-out é posterior à data de check-in
    checkDates();
    if (checkOutDate.validity.customError) {
      checkOutDate.reportValidity();
      return false;
    }

    return true;
  }

  function renderHotels(hotelsToRender, allFilteredHotels) {
    const hotelList = document.getElementById('hotel-list');
    const resultsCount = document.getElementById('results-count');
    const user = JSON.parse(sessionStorage.getItem('activeUser'));
  
    // Obter informações de datas e ocupação
    const checkInDate = document.getElementById('check-in-date').value;
    const checkOutDate = document.getElementById('check-out-date').value;
    const nights = calculateNights(checkInDate, checkOutDate);
    const adultos = parseInt(document.getElementById('adultosCount').textContent) || 1;
    const criancas = parseInt(document.getElementById('criancasCount').textContent) || 0;

    if (hotelsToRender.length === 0) {
      resultsCount.textContent = '0 Hotéis Encontrados';
      hotelList.innerHTML = `
        <div class="no-results">
          <p>Nenhum hotel encontrado com os filtros selecionados.</p>
          <p>Tente ajustar os seus filtros ou datas de viagem.</p>
        </div>
      `;
      document.getElementById('no-hotels').style.display = 'none';
      document.getElementById('load-more').style.display = 'none';
      return;
    }
  
    document.getElementById('no-hotels').style.display = 'none';
    resultsCount.textContent = `${allFilteredHotels.length} Hotéis Encontrados`;
  
    hotelList.innerHTML = hotelsToRender.map(hotel => {
      const isFavorited = user && user.favoriteHotels && user.favoriteHotels.includes(hotel.id);
      
      // Calcular preços usando as funções unificadas
      const pricePerRoom = calculateTotalPrice(hotel.price, adultos, criancas);
      const totalPriceAllRooms = calculateTotalPriceWithRooms(hotel.price, adultos, criancas) * nights;

      return `
        <div class="hotel-card" data-hotel-id="${hotel.id}">
          <img src="${hotel.image}" alt="${hotel.name}" loading="lazy">
          <div class="hotel-details">
            <h2>${hotel.name}</h2>
            <p class="hotel-location"><i class="fas fa-map-marker-alt"></i> ${hotel.location}</p>
            <div class="hotel-rating">
              <span class="rating-box">${hotel.rating}/10</span>
              <span>${hotel.reviews} avaliações</span>
            </div>
            <div class="hotel-amenities">
              ${hotel.amenities.slice(0, 4).map(amenity => `<span>${amenity}</span>`).join('')}
            </div>
          </div>
          <div class="hotel-price-actions">
            <div class="price-favorite">
              <span class="total-price">${totalPriceAllRooms}€</span>
              <button class="favorite-button ${isFavorited ? 'active' : ''}" aria-label="${isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
                <i class="fas fa-heart"></i>
              </button>
            </div>
            <p class="price-details">${nights} noite${nights > 1 ? 's' : ''}, ${adultos} adulto${adultos > 1 ? 's' : ''}${criancas > 0 ? `, ${criancas} criança${criancas > 1 ? 's' : ''}` : ''} (${pricePerRoom}€ por quarto)</p>
            <a href="detalhes_hotel.html?id=${hotel.id}&checkin=${checkInDate}&checkout=${checkOutDate}&adultos=${adultos}&criancas=${criancas}" class="details-button">Ver Detalhes</a>
          </div>
        </div>
      `;
    }).join('');
  
    // Adicionar event listeners para os botões de favorito
    document.querySelectorAll('.favorite-button').forEach(button => {
      const hotelCard = button.closest('.hotel-card');
      button.addEventListener('click', () => toggleFavorite(hotelCard));
    });
  
    // Mostrar ou esconder o botão "Carregar Mais"
    const loadMoreButton = document.getElementById('load-more');
    loadMoreButton.style.display = allFilteredHotels.length > hotelsToRender.length ? 'block' : 'none';
  }
  
  function applyFiltersAndSort() {
    const destination = destinationFilter.value.toLowerCase().trim();
    const checkInDate = checkInDateFilter.value;
    const checkOutDate = checkOutDateFilter.value;
    const name = nameFilter.value.toLowerCase().trim();
    const type = typeFilter.value;
    const maxPrice = parseInt(priceFilter.value);
    const maxDistance = parseInt(distanceFilter.value);
    const freeCancellation = freeCancellationFilter.checked;
    const selectedAmenities = Array.from(document.querySelectorAll('input[name="amenities"]:checked')).map(cb => cb.value);
    const sort = sortBy.value;
    const minRating = parseFloat(amenitiesFilter.value) || 0;

    // Filtrar hotéis sem considerar disponibilidade
    let filteredHotels = hotels.filter(hotel => {
      const destMatch = !destination || hotel.location.toLowerCase().includes(destination);
      const nameMatch = !name || hotel.name.toLowerCase().includes(name);
      const typeMatch = !type || hotel.type === type;
      const priceMatch = hotel.price <= maxPrice;
      const distanceMatch = hotel.distanceToCenter <= maxDistance;
      const freeCancellationMatch = !freeCancellation || hotel.freeCancellation;
      const amenitiesMatch = selectedAmenities.length === 0 || selectedAmenities.every(amenity => hotel.amenities.includes(amenity));
      const ratingMatch = minRating === 0 || hotel.rating >= minRating;

      return (
        destMatch &&
        nameMatch &&
        typeMatch &&
        priceMatch &&
        distanceMatch &&
        freeCancellationMatch &&
        amenitiesMatch &&
        ratingMatch
      );
    });

    filteredHotels.sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating-desc') return b.rating - a.rating;
      if (sort === 'distance-asc') return a.distanceToCenter - b.distanceToCenter;
      return 0;
    });

    // Passar a lista completa de hotéis filtrados para renderHotels
    renderHotels(filteredHotels.slice(0, displayedHotels), filteredHotels);

    loadMoreBtn.disabled = displayedHotels >= filteredHotels.length;
    loadMoreBtn.textContent = displayedHotels >= filteredHotels.length ? 'Sem mais hotéis' : 'Carregar Mais Hotéis';
  }

  function showAvailabilityCalendar(hotel) {
    // Criar o modal
    const modal = document.createElement('div');
    modal.classList.add('availability-modal');
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">×</span>
        <h2>Disponibilidade do ${hotel.name}</h2>
        <p>Dias disponíveis estão em verde, indisponíveis em vermelho.</p>
        <div id="availability-calendar"></div>
      </div>
    `;
    document.body.appendChild(modal);

    // Adicionar evento para fechar o modal
    const closeModal = modal.querySelector('.close-modal');
    closeModal.addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    // Fechar com tecla Esc
    document.addEventListener('keydown', function closeOnEsc(e) {
      if (e.key === 'Escape') {
        document.body.removeChild(modal);
        document.removeEventListener('keydown', closeOnEsc);
      }
    });

    // Gerar o calendário
    const calendarContainer = modal.querySelector('#availability-calendar');
    const today = new Date('2025-05-25');
    today.setHours(0, 0, 0, 0); // Normalizar para início do dia
    const startDate = new Date(today);
    const endDate = new Date('2025-12-31'); // Final do ano de 2025

    const calendarHTML = [];
    const monthNames = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    let currentMonth = startDate.getMonth(); // 4 (Maio)
    while (currentMonth <= 11) { // Até Dezembro
      const monthStart = new Date(2025, currentMonth, 1);
      const monthEnd = new Date(2025, currentMonth + 1, 0);
      const firstDayOfMonth = monthStart.getDay();
      const startDay = currentMonth === 4 ? 25 : 1;
      const firstDisplayDate = new Date(2025, currentMonth, startDay);

      calendarHTML.push(`<h3 class="month-header">${monthNames[currentMonth]} 2025</h3>`);
      calendarHTML.push(`
        <div class="calendar-days-of-week">
          <span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span>
        </div>
      `);

      calendarHTML.push('<div class="calendar-grid">');

      if (currentMonth !== 4) {
        for (let i = 0; i < firstDayOfMonth; i++) {
          calendarHTML.push('<div class="calendar-day empty"></div>');
        }
      } else {
        const firstDayToShow = firstDisplayDate.getDay();
        for (let i = 0; i < firstDayToShow; i++) {
          calendarHTML.push('<div class="calendar-day empty"></div>');
        }
      }

      let currentDate = new Date(firstDisplayDate);
      currentDate.setHours(0, 0, 0, 0);

      while (currentDate <= monthEnd) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const isAvailable = !hotel.unavailableDates.includes(dateStr);
        const dayClass = isAvailable ? 'available' : 'unavailable';
        const dayLabel = day;
        const monthLabel = month;

        calendarHTML.push(`
          <div class="calendar-day ${dayClass}" title="${dateStr}">
            ${dayLabel}/${monthLabel}
          </div>
        `);

        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(0, 0, 0, 0); // Normalizar após incremento
      }

      calendarHTML.push('</div>');
      currentMonth++;
    }

    calendarContainer.innerHTML = calendarHTML.join('');
    modal.style.display = 'block';
    window.scrollTo(0, 0);
  }

  // Substituição da lógica do dropdown pela versão da página principal
  const formsConfig = [
    {
      prefix: "hotel",
      buttonId: "dropdownBtn",
      menuId: "dropdownContent",
      confirmId: "confirmBtn",
      adultosId: "adultosCount",
      criancasId: "criancasCount",
      bebesId: null,
      quartosId: "quartosCount",
      childAgeInputsId: "childAgeInputs",
      childAgesSectionId: "childAges",
      passengerNoteId: null
    }
  ];

  formsConfig.forEach((config) => {
    const pessoasBtn = document.getElementById(config.buttonId);
    const pessoasMenu = document.getElementById(config.menuId);
    const concluirBtn = document.getElementById(config.confirmId);
    const adultosCount = document.getElementById(config.adultosId);
    const criancasCount = document.getElementById(config.criancasId);
    const bebesCount = config.bebesId ? document.getElementById(config.bebesId) : null;
    const quartosCount = config.quartosId ? document.getElementById(config.quartosId) : null;
    const childAgeInputs = config.childAgeInputsId ? document.getElementById(config.childAgeInputsId) : null;
    const childAgesSection = config.childAgesSectionId ? document.getElementById(config.childAgesSectionId) : null;
    const passengerNote = config.passengerNoteId ? document.getElementById(config.passengerNoteId) : null;

    if (!pessoasBtn || !pessoasMenu || !concluirBtn || !adultosCount || !criancasCount) {
      console.error(`Elementos não encontrados para o formulário ${config.prefix}:`, {
        pessoasBtn,
        pessoasMenu,
        concluirBtn,
        adultosCount,
        criancasCount,
      });
      return;
    }

    const countMap = {
      adultos: parseInt(adultosCount.textContent) || (config.prefix === "hotel" ? 1 : 2),
      criancas: parseInt(criancasCount.textContent) || 0,
      bebes: bebesCount ? parseInt(bebesCount.textContent) || 0 : undefined,
      quartos: quartosCount ? parseInt(quartosCount.textContent) || 1 : undefined,
    };

    const updateChildAgeInputs = () => {
      if (!childAgeInputs || !childAgesSection) return;

      const existingAges = [];
      document.querySelectorAll(`#${config.menuId} .child-age`).forEach((select) => {
        existingAges.push(parseInt(select.value) || 0);
      });

      const criancas = countMap.criancas;
      childAgeInputs.innerHTML = "";

      if (criancas > 0) {
        for (let i = 0; i < criancas; i++) {
          const div = document.createElement("div");
          div.classList.add("child-age-group");
          const selectedAge = i < existingAges.length ? existingAges[i] : 0;
          div.innerHTML = `
            <label for="child-age-${i}">Criança ${i + 1}:</label>
            <select id="child-age-${i}" class="child-age" data-child="${i}">
              ${Array.from({ length: 18 }, (_, age) => `<option value="${age}" ${age === selectedAge ? 'selected' : ''}>${age} anos</option>`).join("")}
            </select>
          `;
          childAgeInputs.appendChild(div);
        }
        childAgesSection.style.display = "block";
      } else {
        childAgesSection.style.display = "none";
      }
    };

    const updateButtonText = () => {
      let texto = `${countMap.adultos} Adulto${countMap.adultos !== 1 ? "s" : ""}`;
      if (countMap.criancas > 0) texto += `, ${countMap.criancas} Criança${countMap.criancas !== 1 ? "s" : ""}`;
      if (countMap.bebes > 0) texto += `, ${countMap.bebes} Bebé${countMap.bebes !== 1 ? "s" : ""}`;
      if (countMap.quartos !== undefined) texto += `, ${countMap.quartos} Quarto${countMap.quartos !== 1 ? "s" : ""}`;
      pessoasBtn.innerHTML = texto || "1 Adulto";
      pessoasBtn.title = texto;

      if (passengerNote) {
        passengerNote.style.display = (countMap.criancas > 0 || countMap.bebes > 0) ? "block" : "none";
      }
    };

    const getPassengerType = (dataType) => {
      if (dataType.includes("-")) {
        return dataType.split("-")[1];
      }
      return dataType;
    };

    const updateButtonStates = () => {
      document.querySelectorAll(`#${config.menuId} .counter button.decrement`).forEach((btn) => {
        const type = getPassengerType(btn.getAttribute("data-type"));
        btn.disabled = countMap[type] <= (type === "quartos" || type === "adultos" ? 1 : 0);
      });
      document.querySelectorAll(`#${config.menuId} .counter button.increment`).forEach((btn) => {
        const type = getPassengerType(btn.getAttribute("data-type"));
        btn.disabled = countMap[type] >= 9;
        if (type === "criancas" && config.prefix === "hotel" && countMap.quartos) {
          btn.disabled = countMap.criancas >= countMap.quartos;
        }
      });
    };

    pessoasBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = pessoasMenu.style.display === "block";
      pessoasMenu.style.display = isOpen ? "none" : "block";
      pessoasBtn.setAttribute("aria-expanded", !isOpen);
      if (!isOpen) pessoasMenu.querySelector(".counter button").focus();
    });

    document.querySelectorAll(`#${config.menuId} .counter button`).forEach((btn) => {
      btn.addEventListener("click", () => {
        const type = getPassengerType(btn.getAttribute("data-type"));
        let value = countMap[type] || 0;

        if (btn.classList.contains("increment")) {
          if (type === "criancas" && config.prefix === "hotel" && countMap.quartos && value >= countMap.quartos) {
            alert("Cada quarto pode ter no máximo 1 criança até 17 anos. Adicione um quarto para mais crianças.");
            return;
          }
          value = Math.min(value + 1, 9);
        } else if (btn.classList.contains("decrement")) {
          if (type === "adultos" || type === "quartos") {
            value = Math.max(1, value - 1);
          } else {
            value = Math.max(0, value - 1);
          }
        }

        countMap[type] = value;
        let countElement;
        if (type === "adultos") countElement = document.getElementById(config.adultosId);
        else if (type === "criancas") countElement = document.getElementById(config.criancasId);
        else if (type === "bebes") countElement = bebesCount;
        else if (type === "quartos") countElement = quartosCount;

        if (countElement) {
          countElement.textContent = value;
        } else {
          console.error(`Elemento de contagem para ${type} não encontrado para ${config.prefix}`);
        }

        if (type === "criancas" && config.prefix === "hotel") updateChildAgeInputs();
        updateButtonText();
        updateButtonStates();
      });
    });

    concluirBtn.addEventListener("click", () => {
      if (config.prefix === "hotel") {
        const adultos = countMap.adultos;
        const criancas = countMap.criancas;
        let quartos = countMap.quartos;

        const childAges = [];
        document.querySelectorAll(`#${config.menuId} .child-age`).forEach((select) => {
          childAges.push(parseInt(select.value) || 0);
        });

        let effectiveAdults = adultos;
        let effectiveChildren = 0;
        childAges.forEach((age) => {
          if (age > 12) effectiveAdults++;
          else effectiveChildren++;
        });

        const recommendedRoomsForAdults = Math.ceil(effectiveAdults / 2);
        const requiredRoomsForChildren = criancas;
        const minimumRequiredRooms = Math.max(recommendedRoomsForAdults, requiredRoomsForChildren || 0);

        if (quartos < minimumRequiredRooms) {
          quartos = minimumRequiredRooms;
          countMap.quartos = quartos;
          if (quartosCount) quartosCount.textContent = quartos;
          if (criancas > 0 && quartos < criancas + 1) {
            alert(`O número de quartos foi ajustado para ${quartos} para acomodar ${adultos} adulto${adultos > 1 ? "s" : ""} e ${criancas} criança${criancas > 1 ? "s" : ""} (máximo 1 criança até 12 anos por quarto).`);
          } else {
            alert(`O número de quartos foi ajustado para ${quartos} para acomodar ${adultos} adulto${adultos > 1 ? "s" : ""} e ${criancas} criança${criancas > 1 ? "s" : ""} (recomendado máximo de 2 adultos e 1 criança até 12 anos por quarto).`);
          }
        }
        if (quartos > minimumRequiredRooms && (effectiveAdults > 0 || effectiveChildren > 0)) {
          alert(`Selecionou ${quartos} quarto${quartos > 1 ? "s" : ""}, mas a ocupação (${adultos} adulto${adultos > 1 ? "s" : ""} e ${criancas} criança${criancas > 1 ? "s" : ""}) pode ser acomodada em ${minimumRequiredRooms} quarto${minimumRequiredRooms > 1 ? "s" : ""}. Pode ajustar se desejar.`);
        }

        updatePriceRangeLimit();
        updateButtonStates();
      }
      updateButtonText();
      pessoasMenu.style.display = "none";
      pessoasBtn.setAttribute("aria-expanded", "false");
      pessoasBtn.focus();
    });

    document.addEventListener("click", (e) => {
      if (!pessoasBtn.contains(e.target) && !pessoasMenu.contains(e.target)) {
        pessoasMenu.style.display = "none";
        pessoasBtn.setAttribute("aria-expanded", "false");
      }
    });

    pessoasMenu.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        pessoasMenu.style.display = "none";
        pessoasBtn.setAttribute("aria-expanded", "false");
        pessoasBtn.focus();
      }
    });

    updateButtonText();
    updateButtonStates();
    if (config.prefix === "hotel") updateChildAgeInputs();
  });

  // Amenities Dropdown
  amenitiesDropdownBtn.addEventListener('click', () => {
    amenitiesDropdownContent.style.display = amenitiesDropdownContent.style.display === 'block' ? 'none' : 'block';
  });

  amenitiesConfirmBtn.addEventListener('click', () => {
    amenitiesDropdownContent.style.display = 'none';
    const selectedAmenities = Array.from(document.querySelectorAll('input[name="amenities"]:checked')).map(cb => cb.value);
    amenitiesDropdownBtn.textContent = selectedAmenities.length > 0
      ? selectedAmenities.join(', ')
      : 'Selecionar Comodidades';
    applyFiltersAndSort();
  });

  document.addEventListener('click', (e) => {
    if (!amenitiesDropdownBtn.contains(e.target) && !amenitiesDropdownContent.contains(e.target)) {
      amenitiesDropdownContent.style.display = 'none';
    }
  });

  document.querySelectorAll('.checkbox-text').forEach(span => {
    span.addEventListener('click', () => {
      const checkboxId = span.getAttribute('data-for');
      const checkbox = document.getElementById(checkboxId);
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        applyFiltersAndSort();
      }
    });
  });

  // Autocomplete para nome do hotel
  nameFilter.addEventListener('input', () => {
    const query = nameFilter.value.toLowerCase();
    suggestionsList.innerHTML = '';

    if (query) {
      const matches = hotels
        .filter(hotel => hotel.name.toLowerCase().includes(query))
        .slice(0, 5);

      if (matches.length > 0) {
        matches.forEach(hotel => {
          const div = document.createElement('div');
          div.textContent = hotel.name;
          div.classList.add('autocomplete-item');
          div.addEventListener('click', () => {
            nameFilter.value = hotel.name;
            suggestionsList.innerHTML = '';
            applyFiltersAndSort();
          });
          suggestionsList.appendChild(div);
        });
        suggestionsList.style.display = 'block';
      } else {
        suggestionsList.style.display = 'none';
      }
    } else {
      suggestionsList.style.display = 'none';
    }
  });

  document.addEventListener('click', (e) => {
    if (!nameFilter.contains(e.target) && !suggestionsList.contains(e.target)) {
      suggestionsList.style.display = 'none';
    }
  });

  // Carregar mais hotéis
  loadMoreBtn.addEventListener('click', async () => {
    loadMoreBtn.classList.add('loading');
    loadMoreBtn.disabled = true;
    
    // Simular delay de carregamento
    await new Promise(resolve => setTimeout(resolve, 800));
    
    displayedHotels += hotelsPerLoad;
    applyFiltersAndSort();
    loadMoreBtn.classList.remove('loading');
    loadMoreBtn.disabled = false;
  });

  // Limpar filtros
  clearFiltersBtn.addEventListener('click', () => {
    try {
      destinationFilter.value = '';
      checkInDateFilter.value = '';
      checkOutDateFilter.value = '';
      nameFilter.value = '';
      suggestionsList.innerHTML = '';
      suggestionsList.style.display = 'none';
      typeFilter.value = '';
      priceFilter.value = baseMaxPrice;
      priceValue.textContent = `Até ${baseMaxPrice}€`;
      distanceFilter.value = 20;
      distanceValue.textContent = 'Até 20km';
      freeCancellationFilter.checked = false;
      amenitiesFilter.value = '0';

      // Limpar mensagens de validação
      [destinationFilter, checkInDateFilter, checkOutDateFilter].forEach(input => {
        if (input) {
          input.setCustomValidity('');
          input.reportValidity();
        }
      });

      const amenityCheckboxes = document.querySelectorAll('input[name="amenities"]');
      amenityCheckboxes.forEach(cb => {
        cb.checked = false;
      });
      amenitiesDropdownBtn.textContent = 'Selecionar Comodidades';
      amenitiesDropdownContent.style.display = 'none';

      adultosCount.textContent = '1';
      criancasCount.textContent = '0';
      quartosCount.textContent = '1';
      dropdownBtn.textContent = '1 Adulto, 1 Quarto';
      dropdownContent.style.display = 'none';

      const childAgeInputs = document.getElementById('childAgeInputs');
      const childAgesSection = document.getElementById('childAges');
      childAgeInputs.innerHTML = '';
      childAgesSection.style.display = 'none';

      sortBy.value = 'price-asc';
      displayedHotels = 4;

      hotels.forEach(hotel => {
        hotel.price = hotel.basePrice;
      });

      baseMaxPrice = Math.ceil(Math.max(...hotels.map(hotel => hotel.basePrice)) * 1.1);
      priceFilter.max = baseMaxPrice;
      priceFilter.value = baseMaxPrice;
      priceValue.textContent = `Até ${baseMaxPrice}€`;

      const inputEvent = new Event('input', { bubbles: true });
      const changeEvent = new Event('change', { bubbles: true });

      priceFilter.dispatchEvent(inputEvent);
      distanceFilter.dispatchEvent(inputEvent);
      typeFilter.dispatchEvent(changeEvent);
      amenitiesFilter.dispatchEvent(changeEvent);
      freeCancellationFilter.dispatchEvent(changeEvent);
      amenityCheckboxes.forEach(cb => cb.dispatchEvent(changeEvent));

      updateChildAgeInputs();
      updatePriceRangeLimit();
      applyFiltersAndSort();
    } catch (error) {
      console.error('Erro ao limpar filtros:', error);
    }
  });

  // Eventos
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateSearchForm()) {
      displayedHotels = 4;
      applyFiltersAndSort();
    }
  });

  typeFilter.addEventListener('change', applyFiltersAndSort);
  freeCancellationFilter.addEventListener('change', applyFiltersAndSort);
  sortBy.addEventListener('change', applyFiltersAndSort);
  amenitiesFilter.addEventListener('change', applyFiltersAndSort);
  document.querySelectorAll('input[name="amenities"]').forEach(cb => {
    cb.addEventListener('change', applyFiltersAndSort);
  });

  // Inicializar
  priceValue.textContent = `Até ${priceFilter.value}€`;
  distanceValue.textContent = `Até ${distanceFilter.value}km`;
  updatePriceRangeLimit();
  applyFiltersAndSort();
});

// Lista de destinos para a aba "Hotéis"
const hotelDestinations = [
  'Lisboa, Portugal',
  'Margem do Rio Tejo, Portugal',
  'Alfama, Portugal',
  'Serra da Estrela, Portugal',
  'Nova Iorque, EUA',
  'Shinjuku, Tóquio',
  'Paris, França',
  'Phuket, Tailândia'
];

const destinationInput = document.getElementById('destination');
autocompleteHotel(destinationInput, hotelDestinations);

// Função de autocompletar para a aba de hotéis
function autocompleteHotel(input, arr) {
  let currentFocus;

  input.addEventListener('input', function () {
    const val = this.value.toLowerCase();
    closeAllLists();
    if (!val) return false;
    currentFocus = -1;

    const div = document.createElement('div');
    div.setAttribute('class', 'autocomplete-items');
    this.parentNode.appendChild(div);

    arr.forEach(item => {
      if (item.toLowerCase().includes(val)) {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `<strong>${item}</strong>`;
        itemDiv.innerHTML += `<input type='hidden' value='${item}'>`;
        itemDiv.addEventListener('click', () => {
          input.value = itemDiv.getElementsByTagName('input')[0].value;
          closeAllLists();
        });
        div.appendChild(itemDiv);
      }
    });
  });

  input.addEventListener('keydown', function (e) {
    let items = document.getElementsByClassName('autocomplete-items')[0]?.children;
    if (!items) return;

    if (e.key === 'ArrowDown') {
      currentFocus++;
      addActive(items);
    } else if (e.key === 'ArrowUp') {
      currentFocus--;
      addActive(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentFocus > -1 && items[currentFocus]) {
        items[currentFocus].click();
      }
    }
  });

  function addActive(items) {
    if (!items) return;
    removeActive(items);
    if (currentFocus >= items.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = items.length - 1;
    items[currentFocus].classList.add('autocomplete-active');
  }

  function removeActive(items) {
    for (let item of items) {
      item.classList.remove('autocomplete-active');
    }
  }

  function closeAllLists(elmnt) {
    const items = document.getElementsByClassName('autocomplete-items');
    for (let i = items.length - 1; i >= 0; i--) {
      if (elmnt !== items[i] && elmnt !== input) {
        items[i].parentNode.removeChild(items[i]);
      }
    }
  }

  document.addEventListener('click', (e) => closeAllLists(e.target));
}

// Update toggleFavorite function
function toggleFavorite(hotelCard) {
  const user = JSON.parse(sessionStorage.getItem('activeUser'));
  if (!user) {
    showMessage('Por favor, faz login para adicionar hotéis aos favoritos.', 'error');
    return;
  }

  const hotelId = parseInt(hotelCard.dataset.hotelId);
  const favoriteButton = hotelCard.querySelector('.favorite-button');

  user.favoriteHotels = user.favoriteHotels || [];
  const isFavorited = user.favoriteHotels.includes(hotelId);

  if (isFavorited) {
    user.favoriteHotels = user.favoriteHotels.filter(id => id !== hotelId);
    showMessage('Hotel removido dos favoritos!');
    favoriteButton.classList.remove('active');
  } else {
    user.favoriteHotels.push(hotelId);
    showMessage('Hotel adicionado aos favoritos!');
    favoriteButton.classList.add('active');
  }

  // Atualizar sessionStorage e localStorage
  sessionStorage.setItem('activeUser', JSON.stringify(user));
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userIndex = users.findIndex(u => u.email === user.email);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], favoriteHotels: user.favoriteHotels };
    localStorage.setItem('users', JSON.stringify(users));
  }
}

function showMessage(message, type = 'success') {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message message-${type}`;
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);
  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}