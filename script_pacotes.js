document.addEventListener('DOMContentLoaded', () => {
  // Array de pacotes
  const packages = [
    {
      id: 1,
      name: "Escapadinha em Lisboa",
      image: "media/pacote1.jpg",
      location: "Lisboa, Portugal",
      hotelRating: 9.2,
      hotelReviews: 456,
      hotelName: "Grande Hotel Lisboa",
      hotelType: "Hotel",
      hotelAmenities: ["Wifi", "Pequeno-almoço", "Restaurante"],
      flight: {
        outbound: {
          departure: "Porto (OPO)",
          arrival: "Lisboa (LIS)",
          departureTime: "08:00",
          arrivalTime: "09:00",
          duration: "1h",
          airline: "TAP Air Portugal"
        },
        return: {
          departure: "Lisboa (LIS)",
          arrival: "Porto (OPO)",
          departureTime: "18:00",
          arrivalTime: "19:00",
          duration: "1h",
          airline: "TAP Air Portugal"
        },
        class: "economy"
      },
      price: 299,
      basePrice: 299,
      duration: 3,
      unavailableDates: ["2025-05-25", "2025-05-26"]
    },
    {
      id: 2,
      name: "Paris Romântica",
      image: "media/pacote2.jpg",
      location: "Paris, França",
      hotelRating: 9.3,
      hotelReviews: 653,
      hotelName: "La Belle Vue",
      hotelType: "Hotel",
      hotelAmenities: ["Wifi", "Piscina", "SPA"],
      flight: {
        outbound: {
          departure: "Porto (OPO)",
          arrival: "Paris (CDG)",
          departureTime: "10:00",
          arrivalTime: "13:30",
          duration: "2h30",
          airline: "Air France"
        },
        return: {
          departure: "Paris (CDG)",
          arrival: "Porto (OPO)",
          departureTime: "14:30",
          arrivalTime: "16:00",
          duration: "2h30",
          airline: "Air France"
        },
        class: "business"
      },
      price: 799,
      basePrice: 799,
      duration: 7,
      unavailableDates: ["2025-05-25", "2025-05-26"]
    },
    {
      id: 3,
      name: "Aventura em Nova Iorque",
      image: "media/pacote3.jpg",
      location: "Nova Iorque, EUA",
      hotelRating: 8.9,
      hotelReviews: 1024,
      hotelName: "The Manhattan Grand",
      hotelType: "Hotel",
      hotelAmenities: ["Wifi", "Pequeno almoço", "Ginásio"],
      flight: {
        outbound: {
          departure: "Porto (OPO)",
          arrival: "Nova Iorque (JFK)",
          departureTime: "11:00",
          arrivalTime: "14:00",
          duration: "8h",
          airline: "United Airlines"
        },
        return: {
          departure: "Nova Iorque (JFK)",
          arrival: "Porto (OPO)",
          departureTime: "20:00",
          arrivalTime: "10:00",
          duration: "7h",
          airline: "United Airlines"
        },
        class: "economy"
      },
      price: 1299,
      basePrice: 1299,
      duration: 10,
      unavailableDates: []
    },
    {
      id: 4,
      name: "Experiência em Tóquio",
      image: "media/pacote4.jpg",
      location: "Tóquio, Japão",
      hotelRating: 9.1,
      hotelReviews: 874,
      hotelName: "Tokyo View Hotel",
      hotelType: "Hotel",
      hotelAmenities: ["Wifi", "Restaurante", "SPA"],
      flight: {
        outbound: {
          departure: "Porto (OPO)",
          arrival: "Tóquio (NRT)",
          departureTime: "10:00",
          arrivalTime: "06:00",
          duration: "14h",
          airline: "Japan Airlines"
        },
        return: {
          departure: "Tóquio (NRT)",
          arrival: "Porto (OPO)",
          departureTime: "10:00",
          arrivalTime: "15:00",
          duration: "13h",
          airline: "Japan Airlines"
        },
        class: "business"
      },
      price: 1899,
      basePrice: 1899,
      duration: 14,
      unavailableDates: ["2025-05-27"]
    }
  ];

  // Função para remover acentos de uma string
  function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  // Função para obter parâmetros da URL
  function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      origin: params.get('origin'),
      destination: params.get('destination'),
      departureDate: params.get('departure-date'),
      returnDate: params.get('return-date'),
      adultos: parseInt(params.get('adultos')) || 1,
      criancas: parseInt(params.get('criancas')) || 0,
      bebes: parseInt(params.get('bebes')) || 0
    };
  }

  // Função para preencher o formulário com os parâmetros da URL
  function fillFormFromUrl() {
    const params = getUrlParams();
    
    // Preencher campos de origem e destino
    if (params.origin) document.getElementById('origin').value = params.origin;
    if (params.destination) document.getElementById('destination').value = params.destination;
    
    // Preencher datas
    if (params.departureDate) document.getElementById('departure-date').value = params.departureDate;
    if (params.returnDate) document.getElementById('return-date').value = params.returnDate;
    
    // Atualizar contadores de passageiros
    document.getElementById('adultosCount').textContent = params.adultos.toString();
    document.getElementById('criancasCount').textContent = params.criancas.toString();
    document.getElementById('bebesCount').textContent = params.bebes.toString();
    
    // Atualizar texto do botão de passageiros
    let text = `${params.adultos} Adulto${params.adultos !== 1 ? 's' : ''}`;
    if (params.criancas > 0) text += `, ${params.criancas} Criança${params.criancas !== 1 ? 's' : ''}`;
    if (params.bebes > 0) text += `, ${params.bebes} Bebé${params.bebes !== 1 ? 's' : ''}`;
    document.getElementById('dropdownBtn').textContent = text;

    // Atualizar preços com base no número de passageiros
    updatePriceRangeLimit();
  }

  // Variáveis de paginação
  let displayedPackages = 4;
  const packagesPerLoad = 4;

  // Elementos do DOM
  const searchForm = document.getElementById('search-form');
  const packageList = document.getElementById('package-list');
  const packageCount = document.getElementById('package-count');
  const loadMoreBtn = document.getElementById('load-more');
  const loadingBar = document.getElementById('loading-bar');
  const originInput = document.getElementById('origin');
  const destinationInput = document.getElementById('destination');
  const departureDateInput = document.getElementById('departure-date');
  const returnDateInput = document.getElementById('return-date');
  const hotelTypeFilter = document.getElementById('hotel-type');
  const flightClassFilter = document.getElementById('flight-class');
  const ratingFilter = document.getElementById('rating-filter');
  const priceFilter = document.getElementById('price-range');
  const priceValue = document.getElementById('price-value');
  const clearFiltersBtn = document.getElementById('clear-filters');
  const sortBy = document.getElementById('sort');
  const dropdownBtn = document.getElementById('dropdownBtn');
  const dropdownContent = document.getElementById('dropdownContent');
  const confirmBtn = document.getElementById('confirmBtn');
  const adultosCount = document.getElementById('adultosCount');
  const criancasCount = document.getElementById('criancasCount');
  const bebesCount = document.getElementById('bebesCount');
  const amenitiesDropdownBtn = document.getElementById('amenitiesDropdownBtn');
  const amenitiesDropdownContent = document.getElementById('amenitiesDropdownContent');
  const amenitiesConfirmBtn = document.getElementById('amenitiesConfirmBtn');

  // Definir data mínima para os campos de data
  const today = new Date('2025-05-25');
  departureDateInput.min = today.toISOString().split('T')[0];
  returnDateInput.min = today.toISOString().split('T')[0];

  // Função para validar se a data é passada
  function isPastDate(dateStr) {
    const today = new Date('2025-05-25');
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateStr);
    return date < today;
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

    let currentDate = new Date(checkIn);
    while (currentDate <= checkOut) {
      stayDates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return !stayDates.some(date => unavailableDates.includes(date));
  }

  // Função para atualizar o preço dos pacotes com base no número de passageiros
  function updatePriceRangeLimit() {
    const adultos = parseInt(adultosCount.textContent);
    const criancas = parseInt(criancasCount.textContent);
    const bebes = parseInt(bebesCount.textContent);
    const departureDate = departureDateInput.value;
    const returnDate = returnDateInput.value;
    const nights = calculateNights(departureDate, returnDate) || 1;

    packages.forEach(pkg => {
      const adultPrice = pkg.basePrice;
      const childPrice = pkg.basePrice * 0.75;
      const infantPrice = pkg.basePrice * 0.1;

      pkg.price = Math.round(
        (adultPrice * adultos +
        childPrice * criancas +
        infantPrice * bebes) * nights
      );
    });

    // Calcular o valor máximo com base nos pacotes ajustados
    const highestPrice = Math.max(...packages.map(pkg => pkg.price));
    
    // Arredondar para a centena mais próxima se for maior que 1000
    // ou para a dezena mais próxima se for menor
    let maxPrice;
    if (highestPrice > 1000) {
      maxPrice = Math.ceil(highestPrice / 100) * 100;
    } else {
      maxPrice = Math.ceil(highestPrice / 10) * 10;
    }
    
    priceFilter.max = maxPrice;
    priceFilter.value = maxPrice;
    priceValue.textContent = `Até ${maxPrice}€`;

    applyFiltersAndSort();
  }

  function validateSearchForm() {
    const origin = originInput.value.trim();
    const destination = destinationInput.value.trim();
    const departureDate = departureDateInput.value;
    const returnDate = returnDateInput.value;

    let errors = [];

    // Validar campos obrigatórios apenas se algum deles estiver preenchido
    if (origin || destination || departureDate || returnDate) {
      const missingFields = [];
      if (!origin) missingFields.push('a origem');
      if (!destination) missingFields.push('o destino');
      if (!departureDate) missingFields.push('a data de ida');
      if (!returnDate) missingFields.push('a data de volta');

      if (missingFields.length > 0) {
        if (missingFields.length === 1) {
          errors.push(`Por favor, insira ${missingFields[0]}.`);
        } else if (missingFields.length === 2) {
          errors.push(`Por favor, insira ${missingFields[0]} e ${missingFields[1]}.`);
        } else {
          errors.push(`Por favor, insira ${missingFields.slice(0, -1).join(', ')} e ${missingFields.slice(-1)}.`);
        }
      }
    }

    // Validar datas apenas se ambas estiverem preenchidas
    if (departureDate && returnDate) {
      const departure = new Date(departureDate);
      const return_ = new Date(returnDate);
      if (departure >= return_) {
        errors.push('A data de volta deve ser posterior à data de ida.');
      }
      if (isPastDate(departureDate)) {
        errors.push('A data de ida não pode ser no passado.');
      }
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return false;
    }

    return true;
  }

  function renderPackages(packagesToRender, allFilteredPackages) {
    console.log('Inside renderPackages');
    console.log('Packages to render:', packagesToRender.length);
    console.log('All filtered packages:', allFilteredPackages.length);
    
    packageList.innerHTML = '';

    if (allFilteredPackages.length === 0) {
      packageList.innerHTML = `
        <div class="no-results">
          <p>Nenhum pacote encontrado com os filtros selecionados.</p>
          <p>Tente ajustar os seus filtros ou datas de viagem.</p>
        </div>
      `;
      packageCount.textContent = '0 Pacotes Encontrados';
      loadMoreBtn.style.display = 'none';
      return;
    }

    if (allFilteredPackages.length === 1) {
      packageCount.textContent = '1 Pacote Encontrado';
    } else {
      packageCount.textContent = `${allFilteredPackages.length} Pacotes Encontrados`;
    }

    const departureDate = departureDateInput.value;
    const returnDate = returnDateInput.value;
    const nights = calculateNights(departureDate, returnDate);
    const adultos = parseInt(adultosCount.textContent) || 1;
    const criancas = parseInt(criancasCount.textContent) || 0;
    const bebes = parseInt(bebesCount.textContent) || 0;

    // Carregar itens do carrinho para verificação
    const carrinhoItens = JSON.parse(localStorage.getItem("carrinhoItens")) || [];

    packagesToRender.forEach(pkg => {
      const isAvailable = checkAvailability(departureDate, returnDate, pkg.unavailableDates);

      // Verificar se o pacote já está no carrinho
      const itemNoCarrinho = carrinhoItens.find(item => 
        item.tipo === 'pacote' && 
        item.nome === pkg.name &&
        item.dataIda === departureDate &&
        item.dataVolta === returnDate
      );

      const buttonClass = itemNoCarrinho ? 'book-button adicionado' : 'book-button';
      const buttonText = itemNoCarrinho ? '<i class="fas fa-check"></i> Adicionado' : '<i class="fa-solid fa-cart-plus"></i> Adicionar ao Carrinho';
      const buttonDisabled = itemNoCarrinho ? 'disabled' : '';

      const packageCard = `
        <div class="package-card">
          <img src="${pkg.image}" alt="${pkg.name}" class="package-image" loading="lazy" />
          <div class="package-details">
            <div class="package-header">
              <h2>${pkg.name}</h2>
              <div class="package-location">${pkg.location}</div>
              <div class="package-rating">
                <span class="rating-box">${pkg.hotelRating} / 10</span>
                <span>${pkg.hotelReviews} avaliações</span>
              </div>
            </div>
            <div class="package-content">
              <div class="flight-info">
                <div class="info-title">Informações do Voo</div>
                <div class="info-details">
                  <p><strong>Ida:</strong> ${pkg.flight.outbound.departure} → ${pkg.flight.outbound.arrival}</p>
                  <p>${pkg.flight.outbound.departureTime} - ${pkg.flight.outbound.arrivalTime} (${pkg.flight.outbound.duration})</p>
                  <p><strong>Volta:</strong> ${pkg.flight.return.departure} → ${pkg.flight.return.arrival}</p>
                  <p>${pkg.flight.return.departureTime} - ${pkg.flight.return.arrivalTime} (${pkg.flight.return.duration})</p>
                  <p>Companhia: ${pkg.flight.outbound.airline}</p>
                  <p>Classe: ${pkg.flight.class === 'economy' ? 'Económica' : 'Executiva'}</p>
                </div>
              </div>
              <div class="hotel-info">
                <div class="info-title">Informações do Hotel</div>
                <div class="info-details">
                  <p><strong>${pkg.hotelName}</strong></p>
                  <p>Tipo: ${pkg.hotelType}</p>
                  <div class="package-amenities">
                    ${pkg.hotelAmenities.map(a => `<span class="amenity-tag">${a}</span>`).join('')}
                  </div>
                </div>
              </div>
            </div>
            <div class="package-price-actions">
              <div class="price-details">
                ${nights} noite${nights > 1 ? 's' : ''}, 
                ${adultos} adulto${adultos > 1 ? 's' : ''}
                ${criancas > 0 ? `, ${criancas} criança${criancas > 1 ? 's' : ''}` : ''}
                ${bebes > 0 ? `, ${bebes} bebé${bebes > 1 ? 's' : ''}` : ''}
              </div>
              <div class="package-price">
                <div class="price-amount">${pkg.price * nights}€</div>
              </div>
              <div class="package-actions">
                ${isAvailable ? `
                  <button class="${buttonClass}" onclick="adicionarAoCarrinho(${JSON.stringify(pkg).replace(/"/g, '&quot;')}, '${departureDate}', '${returnDate}', ${adultos}, ${criancas}, ${bebes}, ${nights})" ${buttonDisabled}>
                    ${buttonText}
                  </button>
                ` : `
                  <p style="color: red; font-weight: bold;">Indisponível para as datas selecionadas</p>
                `}
              </div>
            </div>
          </div>
        </div>
      `;
      packageList.insertAdjacentHTML('beforeend', packageCard);
    });

    loadMoreBtn.style.display = displayedPackages >= allFilteredPackages.length ? 'none' : 'block';
  }

  function applyFiltersAndSort() {
    console.log('Applying filters and sort');
    const origin = removeAccents(document.getElementById('origin').value.toLowerCase().trim());
    const destination = removeAccents(document.getElementById('destination').value.toLowerCase().trim());
    const departureDate = document.getElementById('departure-date').value;
    const returnDate = document.getElementById('return-date').value;
    const hotelType = hotelTypeFilter.value;
    const flightClass = flightClassFilter.value;
    const minRating = parseFloat(ratingFilter.value) || 0;
    const maxPrice = parseInt(priceFilter.value);
    const selectedAmenities = Array.from(document.querySelectorAll('input[name="amenities"]:checked')).map(cb => cb.value);
    const sort = sortBy.value;

    console.log('Filtering packages. Total packages before filter:', packages.length);
    console.log('Filter criteria:', { origin, destination, departureDate, returnDate });

    let filteredPackages = packages.filter(pkg => {
      // Função auxiliar para normalizar strings de aeroporto
      const normalizeAirportString = (str) => {
        return removeAccents(str.toLowerCase())
                 .replace(/[()]/g, '')  // Remove parênteses
                 .replace(/,.*$/, '')    // Remove tudo após a vírgula
                 .trim();               // Remove espaços extras
      };

      // Normalizar os valores para comparação
      const pkgOrigin = normalizeAirportString(pkg.flight.outbound.departure);
      const pkgDestination = normalizeAirportString(pkg.flight.outbound.arrival);
      const searchOrigin = normalizeAirportString(origin);
      const searchDestination = normalizeAirportString(destination);
      
      console.log(`Checking package: ${pkg.name}`);
      console.log(`Normalized values:`, {
        pkgOrigin,
        searchOrigin,
        pkgDestination,
        searchDestination
      });
      
      // Verificar correspondência exata após normalização
      const originMatch = !searchOrigin || pkgOrigin.includes(searchOrigin);
      const destinationMatch = !searchDestination || pkgDestination.includes(searchDestination);
      
      console.log(`Origin match for ${pkg.name}:`, originMatch);
      console.log(`Destination match for ${pkg.name}:`, destinationMatch);
      
      // Verificar disponibilidade de datas se foram fornecidas
      const dateMatch = !departureDate || !returnDate || checkAvailability(departureDate, returnDate, pkg.unavailableDates);
      
      const hotelTypeMatch = !hotelType || pkg.hotelType === hotelType;
      const flightClassMatch = flightClass === 'any' || pkg.flight.class === flightClass;
      const ratingMatch = pkg.hotelRating >= minRating;
      const priceMatch = pkg.price <= maxPrice;
      const amenitiesMatch = selectedAmenities.length === 0 || selectedAmenities.every(amenity => pkg.hotelAmenities.includes(amenity));

      const matches = originMatch && destinationMatch && dateMatch && 
                     hotelTypeMatch && flightClassMatch && ratingMatch && 
                     priceMatch && amenitiesMatch;

      console.log(`Package ${pkg.name} final match:`, matches);
      return matches;
    });

    console.log('Filtered packages:', filteredPackages.length);

    filteredPackages.sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating-desc':
          return b.hotelRating - a.hotelRating;
        default:
          return 0;
      }
    });

    console.log('Rendering packages...');
    renderPackages(filteredPackages.slice(0, displayedPackages), filteredPackages);
  }

  // Event Listeners
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Form submitted');
    console.log('Origin:', originInput.value);
    console.log('Destination:', destinationInput.value);
    console.log('Departure:', departureDateInput.value);
    console.log('Return:', returnDateInput.value);
    
    if (validateSearchForm()) {
      console.log('Form validation passed');
      displayedPackages = 4;
      
      // Resetar outros filtros ao pesquisar
      hotelTypeFilter.value = '';
      flightClassFilter.value = 'any';
      ratingFilter.value = '0';
      document.querySelectorAll('input[name="amenities"]').forEach(cb => {
        cb.checked = false;
      });
      amenitiesDropdownBtn.textContent = 'Selecionar Comodidades';
      
      applyFiltersAndSort();
    }
  });

  loadMoreBtn.addEventListener('click', () => {
    loadingBar.style.display = 'block';
    setTimeout(() => {
      displayedPackages += packagesPerLoad;
      applyFiltersAndSort();
      loadingBar.style.display = 'none';
    }, 500);
  });

  clearFiltersBtn.addEventListener('click', () => {
    originInput.value = '';
    destinationInput.value = '';
    departureDateInput.value = '';
    returnDateInput.value = '';
    hotelTypeFilter.value = '';
    flightClassFilter.value = 'any';
    ratingFilter.value = '0';
    
    document.querySelectorAll('input[name="amenities"]').forEach(cb => {
      cb.checked = false;
    });
    amenitiesDropdownBtn.textContent = 'Selecionar Comodidades';
    
    adultosCount.textContent = '1';
    criancasCount.textContent = '0';
    bebesCount.textContent = '0';
    dropdownBtn.textContent = '1 Adulto';
    
    packages.forEach(pkg => {
      pkg.price = pkg.basePrice;
    });
    
    // Calcular o valor máximo inicial com base nos preços base
    const highestBasePrice = Math.max(...packages.map(pkg => pkg.basePrice));
    let maxPrice;
    if (highestBasePrice > 1000) {
      maxPrice = Math.ceil(highestBasePrice / 100) * 100;
    } else {
      maxPrice = Math.ceil(highestBasePrice / 10) * 10;
    }
    
    priceFilter.max = maxPrice;
    priceFilter.value = maxPrice;
    priceValue.textContent = `Até ${maxPrice}€`;
    
    sortBy.value = 'price-asc';
    displayedPackages = 4;
    
    applyFiltersAndSort();
  });

  // Dropdown de passageiros
  dropdownBtn.addEventListener('click', () => {
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
  });

  document.querySelectorAll('.counter button').forEach(button => {
    button.addEventListener('click', () => {
      const type = button.getAttribute('data-type');
      const isIncrement = button.classList.contains('increment');
      const countElement = document.getElementById(`${type}Count`);
      let count = parseInt(countElement.textContent);

      if (isIncrement && count < 9) {
        count++;
      } else if (!isIncrement && count > (type === 'adultos' ? 1 : 0)) {
        count--;
      }

      countElement.textContent = count;
      updatePassengerText();
    });
  });

  function updatePassengerText() {
    const adultos = parseInt(adultosCount.textContent);
    const criancas = parseInt(criancasCount.textContent);
    const bebes = parseInt(bebesCount.textContent);

    let text = `${adultos} Adulto${adultos !== 1 ? 's' : ''}`;
    if (criancas > 0) text += `, ${criancas} Criança${criancas !== 1 ? 's' : ''}`;
    if (bebes > 0) text += `, ${bebes} Bebé${bebes !== 1 ? 's' : ''}`;

    dropdownBtn.textContent = text;
    updatePriceRangeLimit();
  }

  confirmBtn.addEventListener('click', () => {
    dropdownContent.style.display = 'none';
  });

  // Dropdown de comodidades
  amenitiesDropdownBtn.addEventListener('click', () => {
    amenitiesDropdownContent.style.display = amenitiesDropdownContent.style.display === 'block' ? 'none' : 'block';
  });

  amenitiesConfirmBtn.addEventListener('click', () => {
    const selectedAmenities = Array.from(document.querySelectorAll('input[name="amenities"]:checked')).map(cb => cb.value);
    amenitiesDropdownBtn.textContent = selectedAmenities.length > 0
      ? selectedAmenities.join(', ')
      : 'Selecionar Comodidades';
    amenitiesDropdownContent.style.display = 'none';
    applyFiltersAndSort();
  });

  document.addEventListener('click', (e) => {
    if (!dropdownBtn.contains(e.target) && !dropdownContent.contains(e.target)) {
      dropdownContent.style.display = 'none';
    }
    if (!amenitiesDropdownBtn.contains(e.target) && !amenitiesDropdownContent.contains(e.target)) {
      amenitiesDropdownContent.style.display = 'none';
    }
  });

  // Event listeners para filtros
  priceFilter.addEventListener('input', () => {
    priceValue.textContent = `Até ${parseInt(priceFilter.value).toLocaleString('pt-PT')}€`;
    applyFiltersAndSort();
  });

  [hotelTypeFilter, flightClassFilter, ratingFilter, sortBy].forEach(filter => {
    filter.addEventListener('change', applyFiltersAndSort);
  });

  document.querySelectorAll('input[name="amenities"]').forEach(checkbox => {
    checkbox.addEventListener('change', applyFiltersAndSort);
  });

  // Inicialização
  fillFormFromUrl(); // Preencher formulário com parâmetros da URL
  updatePriceRangeLimit();
  applyFiltersAndSort(); // Aplicar filtros automaticamente

  // Lista de aeroportos para autocomplete (extraída dos pacotes disponíveis)
  const airports = [
    // Lisboa
    { name: 'Lisboa', code: 'LIS', city: 'Lisboa, Portugal' },
    // Porto
    { name: 'Porto', code: 'OPO', city: 'Porto, Portugal' },
    // Paris
    { name: 'Paris', code: 'CDG', city: 'Paris, França' },
    // Nova Iorque
    { name: 'Nova Iorque', code: 'JFK', city: 'Nova Iorque, EUA' },
    // Tóquio
    { name: 'Tóquio', code: 'NRT', city: 'Tóquio, Japão' }
  ];

  // Função de autocompletar
  function autocomplete(input, arr) {
    let currentFocus;

    input.addEventListener('input', function () {
      const val = removeAccents(this.value.toLowerCase());
      closeAllLists();
      if (!val) return false;
      currentFocus = -1;

      const div = document.createElement('div');
      div.setAttribute('class', 'autocomplete-items');
      this.parentNode.appendChild(div);

      arr.forEach(item => {
        const displayText = typeof item === 'object' ? `${item.name} (${item.code}), ${item.city}` : item;
        if (removeAccents(displayText.toLowerCase()).includes(val)) {
          const itemDiv = document.createElement('div');
          itemDiv.innerHTML = `<strong>${displayText}</strong>`;
          itemDiv.innerHTML += `<input type='hidden' value='${displayText}'>`;
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

  // Aplicar autocompletar aos campos de origem e destino
  autocomplete(document.getElementById('origin'), airports);
  autocomplete(document.getElementById('destination'), airports);

  // Função para verificar itens no carrinho ao carregar a página
  function verificarItensCarrinho() {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.loggedIn) return;

      const carrinhoItens = JSON.parse(localStorage.getItem("carrinhoItens")) || [];
      const departureDate = departureDateInput.value;
      const returnDate = returnDateInput.value;
      
      document.querySelectorAll('.package-card').forEach(packageCard => {
        const packageName = packageCard.querySelector('h2').textContent;
        
        const itemNoCarrinho = carrinhoItens.find(item => 
          item.tipo === 'pacote' && 
          item.nome === packageName &&
          item.dataIda === departureDate &&
          item.dataVolta === returnDate
        );

        if (itemNoCarrinho) {
          const button = packageCard.querySelector('.book-button');
          if (button) {
            button.innerHTML = '<i class="fas fa-check"></i> Adicionado';
            button.classList.add('adicionado');
            button.disabled = true;
          }
        }
      });
    } catch (e) {
      console.error('Erro ao verificar carrinho:', e);
    }
  }

  // Chamar a verificação ao carregar a página e após aplicar filtros
  verificarItensCarrinho();
  document.getElementById('search-form').addEventListener('submit', () => {
    setTimeout(verificarItensCarrinho, 100);
  });
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

// Adicionar função para adicionar ao carrinho
function adicionarAoCarrinho(pacote, dataIda, dataVolta, adultos, criancas, bebes, nights) {
  try {
    // Verificar se o usuário está logado
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.loggedIn) {
      localStorage.setItem('lastPage', window.location.href);
      showCustomAlert('Faça login para adicionar itens ao carrinho.', 'error');
      window.location.href = 'login.html';
      return;
    }

    // Carregar itens existentes do carrinho
    let carrinhoItens = JSON.parse(localStorage.getItem("carrinhoItens")) || [];
    
    // Verificar se o pacote já está no carrinho
    const itemExistente = carrinhoItens.find(item => 
      item.tipo === 'pacote' && 
      item.nome === pacote.name &&
      item.dataIda === dataIda &&
      item.dataVolta === dataVolta
    );

    if (itemExistente) {
      showCustomAlert('Este pacote já está no seu carrinho!', 'info');
      return;
    }

    // Criar novo item
    const novoItem = {
      id: Date.now(),
      tipo: 'pacote',
      nome: pacote.name,
      hotelNome: pacote.hotelName,
      origem: pacote.flight.outbound.departure,
      destino: pacote.flight.outbound.arrival,
      dataIda: dataIda,
      dataVolta: dataVolta,
      adultos: adultos,
      criancas: criancas,
      bebes: bebes,
      preco: pacote.price * nights,
      imagem: pacote.image,
      quantidade: 1
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
    
    // Mostrar mensagem de sucesso
    showCustomAlert('Pacote adicionado ao carrinho com sucesso!', 'success');
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error);
    showCustomAlert('Erro ao adicionar ao carrinho. Tente novamente.', 'error');
  }
}
