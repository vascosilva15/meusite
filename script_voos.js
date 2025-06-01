document.addEventListener('DOMContentLoaded', () => {
  // Lista de voos (base de dados simulada com preço base para hand-only)
  const flightsData = [
    // Lisboa (LIS) → Madrid (MAD)
    {
      origin: 'Lisboa (LIS), Portugal',
      destination: 'Adolfo Suárez Madrid-Barajas (MAD), Espanha',
      departureDate: '2025-06-10',
      returnDate: '2025-06-11',
      airline: 'ae',
      departureTime: '20:05',
      arrivalTime: '22:20',
      returnDepartureTime: '16:20',
      returnArrivalTime: '16:45',
      durationOutbound: '1h 15m',
      durationReturn: '1h 25m',
      isDirect: true,
      price: 411.41,
      class: 'economy',
      flightNumber: 'UX1160'
    },
    // Porto (OPO) → Londres (LHR)
    {
      origin: 'Porto (OPO), Portugal',
      destination: 'Berlim (BER), Alemanha',
      departureDate: '2025-06-10',
      returnDate: '2025-06-10',
      airline: 'tap',
      departureTime: '09:15',
      arrivalTime: '13:45',
      returnDepartureTime: '07:00',
      returnArrivalTime: '11:30',
      durationOutbound: '3h 30m',
      durationReturn: '3h 30m',
      isDirect: true,
      price: 230.90, // Preço base (hand-only)
      class: 'business',
      flightNumber: 'TP1366'
    },
    // Lisboa (LIS) → Londres (LHR)
    {
      origin: 'Lisboa (LIS), Portugal',
      destination: 'Londres (LHR), Reino Unido',
      departureDate: '2025-06-10',
      returnDate: '2025-06-10',
      airline: 'ae',
      departureTime: '12:00',
      arrivalTime: '14:40',
      returnDepartureTime: '09:00',
      returnArrivalTime: '11:40',
      durationOutbound: '2h 40m',
      durationReturn: '2h 40m',
      isDirect: true,
      price: 390.20, // Preço base (hand-only)
      class: 'economy',
      flightNumber: 'UX1015'
    },
    {
      origin: 'Porto (OPO), Portugal',
      destination: 'Paris (CDG), França',
      departureDate: '2025-06-10',
      returnDate: '2025-06-11',
      airline: 'tap',
      departureTime: '10:00',
      arrivalTime: '14:30',
      returnDepartureTime: '15:00',
      returnArrivalTime: '19:30',
      durationOutbound: '4h 30m',
      durationReturn: '4h 30m',
      isDirect: false,
      price: 200.00,
      class: 'first',
      flightNumber: 'TP432'
    },
  // Novo voo 1: Ryanair, voo direto mais barato
  {
    origin: 'Porto (OPO), Portugal',
    destination: 'Londres (LHR), Reino Unido',
    departureDate: '2025-06-10',
    returnDate: '2025-06-11',
    airline: 'ryanair',
    departureTime: '14:30',
    arrivalTime: '17:00',
    returnDepartureTime: '11:00',
    returnArrivalTime: '13:30',
    durationOutbound: '2h 30m',
    durationReturn: '2h 30m',
    isDirect: true,
    price: 75.50,
    class: 'economy',
    flightNumber: 'FR1234'
  },
  // Novo voo 2: TAP, voo com escalas, preço médio
  {
    origin: 'Lisboa (LIS), Portugal',
    destination: 'Nova Iorque (JFK), EUA',
    departureDate: '2025-06-10',
    returnDate: '2025-06-11',
    airline: 'tap',
    departureTime: '09:15',
    arrivalTime: '16:45',
    returnDepartureTime: '17:30',
    returnArrivalTime: '08:00',
    durationOutbound: '7h 30m',
    durationReturn: '14h 30m',
    isDirect: false,
    price: 550.00,
    class: 'business',
    flightNumber: 'TP205'
  },
  // Novo voo 3: Air Europa, voo direto, duração média
  {
    origin: 'Faro (FAO), Portugal',
    destination: 'Barcelona (BCN), Espanha',
    departureDate: '2025-06-10',
    returnDate: '2025-06-11',
    airline: 'ae',
    departureTime: '13:00',
    arrivalTime: '15:10',
    returnDepartureTime: '10:30',
    returnArrivalTime: '12:40',
    durationOutbound: '2h 10m',
    durationReturn: '2h 10m',
    isDirect: true,
    price: 120.75,
    class: 'economy',
    flightNumber: 'UX3401'
  },
  // Novo voo 4: Ryanair, voo com escalas, preço alto
  {
    origin: 'Porto (OPO), Portugal',
    destination: 'Roma (FCO), Itália',
    departureDate: '2025-06-10',
    returnDate: '2025-06-11',
    airline: 'ryanair',
    departureTime: '06:45',
    arrivalTime: '12:15',
    returnDepartureTime: '14:00',
    returnArrivalTime: '20:30',
    durationOutbound: '5h 30m',
    durationReturn: '6h 30m',
    isDirect: false,
    price: 250.00,
    class: 'first',
    flightNumber: 'FR5678'
  },
];

  console.log('Available flights:', flightsData.map(flight => ({
    route: `${flight.origin} → ${flight.destination}`,
    dates: {
      departure: flight.departureDate,
      return: flight.returnDate
    }
  })));

  const tripTypeFilter = document.getElementById('trip-type-filter');
  const airlineFilter = document.getElementById('airline-filter');
  const classFilter = document.getElementById('class-filter');
  const baggageFilter = document.getElementById('baggage-filter');
  const directFlightsCheckbox = document.getElementById('direct-flights');
  const returnDateInput = document.getElementById('return-date');
  const returnDateContainer = document.getElementById('return-date-container');
  const departureDateInput = document.getElementById('departure-date');
  const clearFiltersButton = document.querySelector('.clear-filters');
  const sortSelect = document.getElementById('sort');
  const searchForm = document.getElementById('search-form');
  const flightResults = document.querySelector('.flight-results');
  const flightCount = document.getElementById('flight-count');
  const sidebar = document.getElementById('detalhes-voo');
  const sidebarContent = document.getElementById('conteudo-voo');
  const closeSidebar = document.getElementById('fechar-detalhes');
  const passengerNote = document.getElementById('passenger-note');
  const dropdownBtn = document.getElementById('dropdownBtn');
  const dropdownContent = document.getElementById('dropdownContent');
  const confirmBtn = document.getElementById('confirmBtn');
  const priceRange = document.getElementById('price-range');
  const priceValue = document.getElementById('price-value');
  const precoFinal = document.getElementById('preco-final');

  const urlParams = new URLSearchParams(window.location.search);
  const origemParam = urlParams.get("origem");
  const destinoParam = urlParams.get("destino");
  const dataIdaParam = urlParams.get("dataIda");
  const dataVoltaParam = urlParams.get("dataVolta");
  const adultosParam = urlParams.get("adultos");
  const criancasParam = urlParams.get("criancas");
  const bebesParam = urlParams.get("bebes");

  console.log('URL parameters received:', {
    origem: origemParam,
    destino: destinoParam,
    dataIda: dataIdaParam,
    dataVolta: dataVoltaParam,
    adultos: adultosParam,
    criancas: criancasParam,
    bebes: bebesParam
  });

  // Preencher campos com valores da URL
  if (origemParam) document.getElementById("origin").value = origemParam;
  if (destinoParam) document.getElementById("destination").value = destinoParam;

  console.log('Date input elements:', {
    departureDateInput: document.getElementById("departure-date") ? 'found' : 'not found',
    returnDateInput: document.getElementById("return-date") ? 'found' : 'not found'
  });

  // Função para garantir que a data está no formato correto YYYY-MM-DD
  function formatDateParam(dateStr) {
    if (!dateStr) return '';
    // Se a data já estiver no formato correto, retorna como está
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    
    // Tenta converter a data para o formato correto
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString().split('T')[0];
  }

  // Aplicar as datas com um pequeno delay para garantir que os elementos estão carregados
  setTimeout(() => {
    if (document.getElementById("departure-date") && dataIdaParam) {
      const formattedDate = formatDateParam(dataIdaParam);
      if (formattedDate) {
        const departureInput = document.getElementById("departure-date");
        departureInput.value = formattedDate;
        console.log('Set departure date:', formattedDate);
        // Disparar eventos para garantir que a mudança é detectada
        departureInput.dispatchEvent(new Event('input', { bubbles: true }));
        departureInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    if (document.getElementById("return-date") && dataVoltaParam) {
      const formattedDate = formatDateParam(dataVoltaParam);
      if (formattedDate) {
        const returnInput = document.getElementById("return-date");
        returnInput.value = formattedDate;
        console.log('Set return date:', formattedDate);
        // Disparar eventos para garantir que a mudança é detectada
        returnInput.dispatchEvent(new Event('input', { bubbles: true }));
        returnInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    // Verificar se temos todos os parâmetros necessários para fazer a busca
    if (origemParam && destinoParam && dataIdaParam) {
      filterFlights();
    }
  }, 100);

  console.log('Form values after setting:', {
    origin: document.getElementById("origin")?.value,
    destination: document.getElementById("destination")?.value,
    departureDate: document.getElementById("departure-date")?.value,
    returnDate: document.getElementById("return-date")?.value
  });

  // Contadores de passageiros
  let counts = {
    adultos: 1,
    criancas: 0,
    bebes: 0
  };

  if (adultosParam || criancasParam || bebesParam) {
    counts.adultos = parseInt(adultosParam) || 1;
    counts.criancas = parseInt(criancasParam) || 0;
    counts.bebes = parseInt(bebesParam) || 0;
    document.getElementById("adultosCount").textContent = counts.adultos;
    document.getElementById("criancasCount").textContent = counts.criancas;
    document.getElementById("bebesCount").textContent = counts.bebes;
    updatePassengerText();
    updateReturnDateVisibility();
    updatePriceRangeMax();
  }

  if (origemParam || destinoParam || dataIdaParam || dataVoltaParam) {
    filterFlights();
  }

  // Variáveis de estado
  let displayedFlightsCount = 0;
  const flightsPerPage = 5;
  let filteredFlights = flightsData.map(flight => ({ ...flight })); // Criar cópias dos voos
  let priceRangeTimeout;

  // Data atual para validação
  const today = new Date('2025-05-28T11:05:00');

  // Inicializar com todos os voos ao carregar a página
  displayFlights(filteredFlights);

  // Função para alternar o dropdown
  function toggleDropdown() {
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
  }

  // Adicionar evento ao botão do dropdown, incluindo suporte a teclado
  dropdownBtn.addEventListener('click', toggleDropdown);
  dropdownBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdown();
    }
  });

  // Função para atualizar contadores
  function changeCount(type, change) {
    counts[type] = Math.max(0, counts[type] + change);
    if (counts[type] > 9) counts[type] = 9; // Limite de 9 por tipo
    document.getElementById(`${type}Count`).textContent = counts[type];
    updatePassengerText();
    updateReturnDateVisibility();
    updatePriceRangeMax();
  }

  // Adicionar eventos aos botões de incremento e decremento
  document.querySelectorAll('.increment, .decrement').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault(); // Prevenir comportamento padrão
      const type = button.getAttribute('data-type');
      const change = button.classList.contains('increment') ? 1 : -1;
      changeCount(type, change);
    });
  });

  // Função para atualizar o texto do botão de passageiros
  function updatePassengerText() {
    let parts = [];
    if (counts.adultos > 0) parts.push(`${counts.adultos} Adulto${counts.adultos > 1 ? 's' : ''}`);
    if (counts.criancas > 0) parts.push(`${counts.criancas} Criança${counts.criancas > 1 ? 's' : ''}`);
    if (counts.bebes > 0) parts.push(`${counts.bebes} Bebé${counts.bebes > 1 ? 's' : ''}`);

    let text = parts.join(', ');
    dropdownBtn.textContent = text || '1 Adulto';
    dropdownBtn.title = text; // Adiciona tooltip para texto completo
  }

  // Função para confirmar a seleção de passageiros
  function confirmSelection() {
    updatePassengerText();
    dropdownContent.style.display = 'none';
    filterFlights(); // Atualizar preços apenas ao confirmar
  }

  // Adicionar evento ao botão de confirmação
  confirmBtn.addEventListener('click', confirmSelection);

  // Remover os event listeners que causam filtragem automática
  departureDateInput.removeEventListener('change', filterFlights);
  returnDateInput.removeEventListener('change', filterFlights);

  // Configurar restrições de datas
  departureDateInput.min = today.toISOString().split('T')[0];
  returnDateInput.min = today.toISOString().split('T')[0];

  // Função para formatar data para YYYY-MM-DD
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  }

  // Adicionar validação de data aos inputs (sem filtrar automaticamente)
  departureDateInput.addEventListener('change', function() {
    this.setCustomValidity('');
    if (returnDateInput.value) {
      checkDates();
    }
    this.reportValidity();
  });
  
  returnDateInput.addEventListener('change', function() {
    this.setCustomValidity('');
    if (departureDateInput.value) {
      checkDates();
    }
    this.reportValidity();
  });

  // Evento de envio do formulário (para pesquisa com campos obrigatórios)
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateSearchForm()) {
      displayedFlightsCount = 0;
      filterFlights();
    }
  });

  // Inicializar os campos de data com placeholder
  departureDateInput.value = '';
  returnDateInput.value = '';

  // Mostrar todos os voos inicialmente
  displayFlights(filteredFlights);

  function updatePriceRangeMax() {
    if (!priceRange || !priceValue) return;

    // Calcular todos os preços possíveis para os voos com a configuração atual
    const allPrices = flightsData.map(flight => {
      const baggageType = baggageFilter.value === 'any' ? 'hand-only' : baggageFilter.value;
      const classType = classFilter.value === 'any' ? flight.class : classFilter.value;
      const basePrice = tripTypeFilter.value === 'one-way' ? flight.price * 0.6 : flight.price;
      return calculateTotalPrice(basePrice, baggageType, classType);
    });

    // Ordenar os preços em ordem crescente
    const sortedPrices = allPrices.sort((a, b) => a - b);

    // Usar o preço mais alto como máximo
    const maxPrice = Math.max(...sortedPrices);

    // Arredondar para a centena superior mais próxima
    const roundedMax = Math.ceil(maxPrice / 100) * 100;

    // Atualizar o slider e o texto
    priceRange.max = roundedMax;
    
    // Se o valor atual for maior que o novo máximo, ajustar para o novo máximo
    if (parseFloat(priceRange.value) > roundedMax) {
      priceRange.value = roundedMax;
    }

    // Atualizar o texto com formatação portuguesa
    priceValue.textContent = `Até ${parseFloat(priceRange.value).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}`;
    
    // Atualizar atributos ARIA
    priceRange.setAttribute('aria-valuemax', roundedMax);
    priceRange.setAttribute('aria-valuenow', priceRange.value);
  }

  // Atualizar o event listener do priceRange
  priceRange.addEventListener('input', () => {
    // Atualizar o texto imediatamente com a formatação portuguesa
    priceValue.textContent = `Até ${parseFloat(priceRange.value).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}`;
    priceRange.setAttribute('aria-valuenow', priceRange.value);
    
    // Aplicar o filtro imediatamente
    performFilter();
  });

  // Controlar visibilidade do campo de data de volta e nota
  function updateReturnDateVisibility() {
    if (tripTypeFilter.value === 'one-way') {
      returnDateContainer.style.display = 'none';
      returnDateInput.value = '';
      passengerNote.style.display = 'none';
    } else {
      returnDateContainer.style.display = 'block';
      passengerNote.style.display = (counts.criancas > 0 || counts.bebes > 0) ? 'block' : 'none';
    }
    updatePriceRangeMax();
  }

  // Inicializar visibilidade e faixa de preço
  updateReturnDateVisibility();
  updatePriceRangeMax();

  // Atualizar visibilidade e faixa de preço ao mudar o tipo de viagem
  tripTypeFilter.addEventListener('change', () => {
    updateReturnDateVisibility();
    filterFlights();
  });

  // Inicializar faixa de preço
  if (priceRange && priceValue) {
    // Definir valor inicial como 900
    priceRange.max = 900;
    priceRange.value = 900;
    priceRange.style.width = '150px'; // Reduzir a largura do slider
    priceRange.style.height = '6px';  // Reduzir a altura do slider
    priceValue.textContent = `Até ${parseFloat(priceRange.value).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}`;
    priceRange.setAttribute('aria-valuemax', 900);
    priceRange.setAttribute('aria-valuenow', priceRange.value);
  }

  // Limpar filtros
  clearFiltersButton.addEventListener('click', () => {
    tripTypeFilter.value = 'round-trip';
    airlineFilter.value = 'any';
    classFilter.value = 'any';
    baggageFilter.value = 'any';
    directFlightsCheckbox.checked = false;
    
    const origin = document.getElementById('origin');
    const destination = document.getElementById('destination');
    
    origin.value = '';
    destination.value = '';
    departureDateInput.value = '';
    returnDateInput.value = '';
    
    // Limpar mensagens de validação
    [origin, destination, departureDateInput, returnDateInput].forEach(input => {
      if (input) {
        input.setCustomValidity('');
        input.reportValidity();
      }
    });

    counts = { adultos: 1, criancas: 0, bebes: 0 };
    document.getElementById('adultosCount').textContent = '1';
    document.getElementById('criancasCount').textContent = '0';
    document.getElementById('bebesCount').textContent = '0';
    sortSelect.value = 'cheapest';

    // Resetar a faixa de preço para 900
    if (priceRange) {
      priceRange.max = 900;
      priceRange.value = 900;
      priceValue.textContent = `Até ${parseFloat(priceRange.value).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}`;
      priceRange.setAttribute('aria-valuemax', 900);
      priceRange.setAttribute('aria-valuenow', priceRange.value);
      priceRange.removeAttribute('data-initialized');
    }

    updatePassengerText();
    updateReturnDateVisibility();
    filteredFlights = flightsData.map(flight => ({ ...flight }));
    displayFlights(filteredFlights);
  });

  // Lista de aeroportos para autocomplete
  const airports = [
    { name: 'Lisboa', code: 'LIS', city: 'Portugal' },
    { name: 'Adolfo Suárez Madrid-Barajas', code: 'MAD', city: 'Espanha' },
    { name: 'Porto', code: 'OPO', city: 'Portugal' },
    { name: 'Paris', code: 'CDG', city: 'França' },
    { name: 'Londres', code: 'LHR', city: 'Reino Unido' },
    { name: 'Berlim', code: 'BER', city: 'Alemanha' },
    { name: 'Faro', code: 'FAO', city: 'Portugal' },
    { name: 'Barcelona', code: 'BCN', city: 'Espanha' }
  ];

  // Função de autocompletar
  function autocomplete(input, arr) {
    let currentFocus;

    input.addEventListener('input', function () {
      const val = this.value.toLowerCase();
      closeAllLists();
      if (!val) return false;
      currentFocus = -1;

      const div = document.createElement('div');
      div.setAttribute('class', 'autocomplete-items');
      this.parentNode.appendChild(div);

      arr.forEach(airport => {
        const searchableText = `${airport.name} (${airport.code}), ${airport.city}`.toLowerCase();
        if (searchableText.includes(val)) {
          const item = document.createElement('div');
          // Formato consistente com a base de dados: Nome (CÓDIGO), País
          const formattedValue = `${airport.name} (${airport.code}), ${airport.city}`;
          item.innerHTML = `<strong>${airport.name} (${airport.code})</strong>, ${airport.city}`;
          item.innerHTML += `<input type='hidden' value='${formattedValue}'>`;
          item.addEventListener('click', () => {
            input.value = formattedValue;
            const otherInput = input.id === 'origin' ? document.getElementById('destination') : document.getElementById('origin');
            if (otherInput.value.toLowerCase() === input.value.toLowerCase()) {
              otherInput.value = '';
            }
            closeAllLists();
            // Disparar o evento de input para atualizar os filtros
            input.dispatchEvent(new Event('input'));
          });
          div.appendChild(item);
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

  // Aplicar autocompletar
  autocomplete(document.getElementById('origin'), airports);
  autocomplete(document.getElementById('destination'), airports);

function createFlightCard(flight, type) {
  const airlineLogos = {
    'ae': 'media/aireuropa.jpg',
    'tap': 'media/tap.jpg',
    'ryanair': 'media/ryanair.jpg'
  };

  // Só aplicar classes especiais se houver mais de um voo
  const cardClass = filteredFlights.length > 1 ? 
    (type === 'cheapest' ? 'cheapest' : type === 'suggestion' ? 'suggestion' : '') 
    : '';
  // Só mostrar o título se houver mais de um voo nos resultados filtrados
  const title = filteredFlights.length > 1 ? 
    (type === 'cheapest' ? 'A opção mais económica' : type === 'suggestion' ? 'A nossa sugestão de voo' : '') 
    : '';

  const baggageType = baggageFilter.value === 'any' ? 'hand-only' : baggageFilter.value;
  const classType = classFilter.value === 'any' ? flight.class : classFilter.value;
  const basePrice = tripTypeFilter.value === 'one-way' ? flight.price * 0.6 : flight.price;
  const totalPrice = calculateTotalPrice(basePrice, baggageType, classType);
  const displayPrice = totalPrice.toFixed(2);

  // Verificar se o voo está nos favoritos usando sessionStorage
  const activeUser = JSON.parse(sessionStorage.getItem('activeUser'));
  const isFavorite = activeUser && activeUser.favorites ? activeUser.favorites.some(fav => 
    fav.origin === flight.origin && 
    fav.destination === flight.destination && 
    fav.departureDate === flight.departureDate &&
    fav.airline === flight.airline
  ) : false;

  return `
    <div class="flight ${type === 'cheapest' ? 'flight-cheapest' : type === 'suggestion' ? 'flight-suggestion' : ''}" 
         data-origin="${flight.origin}" 
         data-destination="${flight.destination}" 
         data-departure-date="${flight.departureDate}" 
         data-return-date="${flight.returnDate}"
         data-airline="${flight.airline}"
         data-departure-time="${flight.departureTime}"
         data-arrival-time="${flight.arrivalTime}"
         data-return-departure-time="${flight.returnDepartureTime}"
         data-return-arrival-time="${flight.returnArrivalTime}"
         data-duration-outbound="${flight.durationOutbound}"
         data-duration-return="${flight.durationReturn}"
         data-is-direct="${flight.isDirect}"
         data-price="${displayPrice}"
         data-baggage="${baggageType}"
         data-class="${classType}">
      ${title ? `<h2>${title}</h2>` : ''}
      <div class="flight-card ${cardClass}" style="background-color: #fff; border-radius: 8px; padding: 10px; margin-bottom: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); min-height: 140px; max-height: 180px; overflow: hidden; display: flex; align-items: stretch; gap: 10px;">
        <div class="flight-section departure-section">
          <h4 style="font-size: 1rem; font-weight: 600; color: #005b96; margin-bottom: 5px;"><strong>Ida</strong></h4>
          <div class="flight-card-content" style="display: flex; align-items: center; gap: 6px; margin-left: 40px;">
            <img src="${airlineLogos[flight.airline]}" alt="${flight.airline} Logo" class="airline-logo">
            <div class="time-block left" style="display: flex; flex-direction: column; align-items: flex-start; min-width: 90px;">
              <span class="date" style="font-size: 11px; color: #888;">${new Date(flight.departureDate).toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
              <span class="time" style="font-size: 16px; font-weight: bold; color: #333;">${flight.departureTime}</span>
              <span class="location" style="font-size: 12px; color: #666;"><strong>${flight.origin.match(/\(([^)]+)\)/)[1]}</strong> <strong>${flight.origin.split(', ')[1]}</strong></span>
            </div>
            <div class="flight-duration" style="background: #e0e0e0; border-radius: 6px; padding: 2px 6px; font-size: 11px; color: #555; display: inline-flex; align-items: center; gap: 3px; flex-shrink: 0;">
              <span>${flight.durationOutbound}</span>
              <span>${flight.isDirect ? 'Direto' : 'com escalas'}</span>
            </div>
            <div class="time-block right" style="display: flex; flex-direction: column; align-items: flex-start;">
              <span class="date" style="font-size: 11px; color: #888;">${new Date(flight.departureDate).toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
              <span class="time" style="font-size: 16px; font-weight: bold; color: #333;">${flight.arrivalTime}</span>
              <span class="location" style="font-size: 12px; color: #666;"><strong>${flight.destination.match(/\(([^)]+)\)/)[1]}</strong> <strong>${flight.destination.split(', ')[1]}</strong></span>
            </div>
          </div>
        </div>
        ${tripTypeFilter.value === 'round-trip' ? `
          <div class="vertical-divider"></div>
          <div class="flight-section return-section">
            <h4 style="font-size: 1rem; font-weight: 600; color: #005b96; margin-bottom: 5px;"><strong>Volta</strong></h4>
            <div class="flight-card-content" style="display: flex; align-items: center; gap: 6px; margin-left: 40px;">
              <img src="${airlineLogos[flight.airline]}" alt="${flight.airline} Logo" class="airline-logo">
              <div class="time-block left" style="display: flex; flex-direction: column; align-items: flex-start; min-width: 90px;">
                <span class="date" style="font-size: 11px; color: #888;">${new Date(flight.returnDate).toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
                <span class="time" style="font-size: 16px; font-weight: bold; color: #333;">${flight.returnDepartureTime}</span>
                <span class="location" style="font-size: 12px; color: #666;"><strong>${flight.destination.match(/\(([^)]+)\)/)[1]}</strong> <strong>${flight.destination.split(', ')[1]}</strong></span>
              </div>
              <div class="flight-duration" style="background: #e0e0e0; border-radius: 6px; padding: 2px 6px; font-size: 11px; color: #555; display: inline-flex; align-items: center; gap: 3px; flex-shrink: 0;">
                <span>${flight.durationReturn}</span>
                <span>${flight.isDirect ? 'Direto' : 'com escalas'}</span>
              </div>
              <div class="time-block right" style="display: flex; flex-direction: column; align-items: flex-start;">
                <span class="date" style="font-size: 11px; color: #888;">${new Date(flight.returnDate).toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
                <span class="time" style="font-size: 16px; font-weight: bold; color: #333;">${flight.returnArrivalTime}</span>
                <span class="location" style="font-size: 12px; color: #666;"><strong>${flight.origin.match(/\(([^)]+)\)/)[1]}</strong> <strong>${flight.origin.split(', ')[1]}</strong></span>
              </div>
            </div>
          </div>
        ` : ''}
        <div class="vertical-divider"></div>
        <div class="flight-price-actions" style="display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; min-height: 100%;">
          <div class="price-favorite">
            <span>${displayPrice.replace('.', ',')}€</span>
            <button class="favorite-button ${isFavorite ? 'active' : ''}" aria-label="Adicionar aos favoritos">
              <i class="fas fa-heart"></i>
            </button>
          </div>
            <button class="select-button" style="background-color: #28a745; color: #fff; border: none; padding: 6px 14px; border-radius: 5px; cursor: pointer; font-size: 0.85rem; margin-bottom: 5px; display: flex; align-items: center; justify-content: center; gap: 8px;">
              Adicionar ao carrinho
            </button>
              <button class="details-button" style="background: #e0e0e0; color: #333; border: none; padding: 6px 14px; border-radius: 5px; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 8px;">
                Ver Detalhes
              </button>
        </div>
      </div>
    </div>
  `;
}

  function calculateTotalPrice(basePricePerAdult, baggageType, classType) {
    // Ajustar preço com base na classe
    let adjustedBasePrice = basePricePerAdult;
    if (classType === 'business') {
      adjustedBasePrice *= 1.5; // Aumento de 50% para business
    } else if (classType === 'first') {
      adjustedBasePrice *= 2.0; // Aumento de 100% para first class
    }

    // Calcular preço por tipo de passageiro
    const adultPrice = adjustedBasePrice * counts.adultos;
    const childPrice = (adjustedBasePrice * 0.8) * counts.criancas; // 80% para crianças
    const babyPrice = (adjustedBasePrice * 0.3) * counts.bebes;     // 30% para bebês

    // Calcular custo adicional de bagagem despachada
    const baggageCost = baggageType === 'checked-included'
      ? (50 * counts.adultos + 40 * counts.criancas + 20 * counts.bebes)
      : 0;

    // Retornar o preço total
    const totalPrice = adultPrice + childPrice + babyPrice + baggageCost;

    // Arredondar para duas casas decimais
    return Math.round(totalPrice * 100) / 100;
  }

function showFlightDetails(flight) {
  // Usar o preço total diretamente do cartão (data-price)
  const displayPrice = parseFloat(flight.price);

  // Obter o tipo de bagagem e classe do cartão
  const baggageType = flight.baggage || 'hand-only';
  const classType = flight.class || 'economy';

  // Calcular custos de bagagem
  const baggageCostAdult = baggageType === 'checked-included' ? 50 : 0;
  const baggageCostChild = baggageType === 'checked-included' ? 40 : 0;
  const baggageCostBaby = baggageType === 'checked-included' ? 20 : 0;

  // Calcular o preço base total (excluindo bagagem)
  const totalBaggageCost = (baggageCostAdult * counts.adultos) + (baggageCostChild * counts.criancas) + (baggageCostBaby * counts.bebes);
  const totalBasePrice = displayPrice - totalBaggageCost;

  // Distribuir o preço base proporcionalmente entre adultos, crianças e bebês
  const totalPassengerWeight = counts.adultos + (0.8 * counts.criancas) + (0.3 * counts.bebes);
  const basePricePerAdultEquivalent = totalPassengerWeight > 0 ? totalBasePrice / totalPassengerWeight : totalBasePrice;

  // Calcular preços por tipo de passageiro (antes de tarifas, taxas e emissão)
  const adultBasePrice = basePricePerAdultEquivalent * counts.adultos;
  const childBasePrice = basePricePerAdultEquivalent * 0.8 * counts.criancas;
  const babyBasePrice = basePricePerAdultEquivalent * 0.3 * counts.bebes;

  // Calcular componentes (tarifa: 78%, taxas: 18%, emissão: 4%) por passageiro
  const tariffAdult = (adultBasePrice / counts.adultos * 0.78).toFixed(2) || '0.00';
  const taxesAdult = (adultBasePrice / counts.adultos * 0.18).toFixed(2) || '0.00';
  const emissionAdult = (adultBasePrice / counts.adultos * 0.04).toFixed(2) || '0.00';
  const totalPerAdult = (parseFloat(tariffAdult) + parseFloat(taxesAdult) + parseFloat(emissionAdult) + baggageCostAdult).toFixed(2);

  const tariffChild = counts.criancas > 0 ? (childBasePrice / counts.criancas * 0.78).toFixed(2) : '0.00';
  const taxesChild = counts.criancas > 0 ? (childBasePrice / counts.criancas * 0.18).toFixed(2) : '0.00';
  const emissionChild = counts.criancas > 0 ? (childBasePrice / counts.criancas * 0.04).toFixed(2) : '0.00';
  const totalPerChild = counts.criancas > 0 ? (parseFloat(tariffChild) + parseFloat(taxesChild) + parseFloat(emissionChild) + baggageCostChild).toFixed(2) : '0.00';

  const tariffBaby = counts.bebes > 0 ? (babyBasePrice / counts.bebes * 0.78).toFixed(2) : '0.00';
  const taxesBaby = counts.bebes > 0 ? (babyBasePrice / counts.bebes * 0.18).toFixed(2) : '0.00';
  const emissionBaby = counts.bebes > 0 ? (babyBasePrice / counts.bebes * 0.04).toFixed(2) : '0.00';
  const totalPerBaby = counts.bebes > 0 ? (parseFloat(tariffBaby) + parseFloat(taxesBaby) + parseFloat(emissionBaby) + baggageCostBaby).toFixed(2) : '0.00';

  // Calcular totais por tipo de passageiro
  const totalAdult = (totalPerAdult * counts.adultos).toFixed(2);
  const totalChild = counts.criancas > 0 ? (totalPerChild * counts.criancas).toFixed(2) : '0.00';
  const totalBaby = counts.bebes > 0 ? (totalPerBaby * counts.bebes).toFixed(2) : '0.00';

  // Validar que a soma dos totais corresponde ao displayPrice
  const calculatedTotal = (parseFloat(totalAdult) + parseFloat(totalChild) + parseFloat(totalBaby)).toFixed(2);
  if (Math.abs(parseFloat(calculatedTotal) - displayPrice) > 0.01) {
    console.warn(`Discrepância no preço total: Calculado=${calculatedTotal}, Esperado=${displayPrice}`);
    // Ajustar os totais proporcionalmente para corresponder ao displayPrice
    const adjustmentFactor = displayPrice / parseFloat(calculatedTotal);
    const adjustedTotalAdult = (parseFloat(totalAdult) * adjustmentFactor).toFixed(2);
    const adjustedTotalChild = counts.criancas > 0 ? (parseFloat(totalChild) * adjustmentFactor).toFixed(2) : '0.00';
    const adjustedTotalBaby = counts.bebes > 0 ? (parseFloat(totalBaby) * adjustmentFactor).toFixed(2) : '0.00';

    // Recalcular preços por passageiro com base nos totais ajustados
    const adjustedPerAdult = counts.adultos > 0 ? (parseFloat(adjustedTotalAdult) / counts.adultos).toFixed(2) : '0.00';
    const adjustedPerChild = counts.criancas > 0 ? (parseFloat(adjustedTotalChild) / counts.criancas).toFixed(2) : '0.00';
    const adjustedPerBaby = counts.bebes > 0 ? (parseFloat(adjustedTotalBaby) / counts.bebes).toFixed(2) : '0.00';

    // Atualizar valores para a tabela
    const adjustedTariffAdult = (parseFloat(adjustedPerAdult) * 0.78 / (0.78 + 0.18 + 0.04)).toFixed(2);
    const adjustedTaxesAdult = (parseFloat(adjustedPerAdult) * 0.18 / (0.78 + 0.18 + 0.04)).toFixed(2);
    const adjustedEmissionAdult = (parseFloat(adjustedPerAdult) * 0.04 / (0.78 + 0.18 + 0.04)).toFixed(2);

    const adjustedTariffChild = counts.criancas > 0 ? (parseFloat(adjustedPerChild) * 0.78 / (0.78 + 0.18 + 0.04)).toFixed(2) : '0.00';
    const adjustedTaxesChild = counts.criancas > 0 ? (parseFloat(adjustedPerChild) * 0.18 / (0.78 + 0.18 + 0.04)).toFixed(2) : '0.00';
    const adjustedEmissionChild = counts.criancas > 0 ? (parseFloat(adjustedPerChild) * 0.04 / (0.78 + 0.18 + 0.04)).toFixed(2) : '0.00';

    const adjustedTariffBaby = counts.bebes > 0 ? (parseFloat(adjustedPerBaby) * 0.78 / (0.78 + 0.18 + 0.04)).toFixed(2) : '0.00';
    const adjustedTaxesBaby = counts.bebes > 0 ? (parseFloat(adjustedPerBaby) * 0.18 / (0.78 + 0.18 + 0.04)).toFixed(2) : '0.00';
    const adjustedEmissionBaby = counts.bebes > 0 ? (parseFloat(adjustedPerBaby) * 0.04 / (0.78 + 0.18 + 0.04)).toFixed(2) : '0.00';

    // Atualizar valores para uso na tabela
    tariffAdult = adjustedTariffAdult;
    taxesAdult = adjustedTaxesAdult;
    emissionAdult = adjustedEmissionAdult;
    totalPerAdult = adjustedPerAdult;
    totalAdult = adjustedTotalAdult;

    tariffChild = adjustedTariffChild;
    taxesChild = adjustedTaxesChild;
    emissionChild = adjustedEmissionChild;
    totalPerChild = adjustedPerChild;
    totalChild = adjustedTotalChild;

    tariffBaby = adjustedTariffBaby;
    taxesBaby = adjustedTaxesBaby;
    emissionBaby = adjustedEmissionBaby;
    totalPerBaby = adjustedPerBaby;
    totalBaby = adjustedTotalBaby;
  }

  const baggageIcons = {
    'hand-only': `
      <div class="icon"><i class="fas fa-suitcase"></i> Inclui mala de mão x1</div>
      <div class="icon"><i class="fas fa-suitcase"></i> Bagagem de cabine x1</div>
      <div class="icon"><i class="fas fa-times"></i> Bagagem de porão não incluída</div>
    `,
    'checked-included': `
      <div class="icon"><i class="fas fa-suitcase"></i> Inclui mala de mão x1</div>
      <div class="icon"><i class="fas fa-suitcase"></i> Bagagem de cabine x1</div>
      <div class="icon"><i class="fas fa-check"></i> Bagagem de porão incluída (+${totalBaggageCost.toFixed(2).replace('.', ',')}€)</div>
    `
  };

  // Função para converter a classe para português
  function getClasseEmPortugues(classe) {
    const classes = {
      'economy': 'económica',
      'business': 'executiva',
      'first': 'primeira classe'
    };
    return classes[classe] || classe;
  }

  const flightClass = getClasseEmPortugues(classType);

  sidebarContent.innerHTML = `
    <h2>Os seus voos</h2>
    <div class="flight-segment">
      <h3>Ida</h3>
      <div class="flight-route">
        <div class="airport departure">
          <span class="code">${flight.origin.match(/\(([^)]+)\)/)[1]}</span>
          <span class="city">${flight.origin.split(', ')[1]}</span>
        </div>
        <div class="route-connector">
          <i class="fas fa-plane-departure"></i>
          <div class="curved-line"></div>
        </div>
        <div class="flight-details">
          <span class="time">${flight.departureTime}</span>
          <span class="date">${new Date(flight.departureDate).toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          <span class="airline">${flight.airline.toUpperCase()} ${flight.flightNumber || ''}</span>
        </div>
        <div class="route-connector">
          <div class="curved-line"></div>
          <i class="fas fa-plane-arrival"></i>
        </div>
        <div class="airport arrival">
          <span class="code">${flight.destination.match(/\(([^)]+)\)/)[1]}</span>
          <span class="city">${flight.destination.split(', ')[1]}</span>
        </div>
      </div>
      <div class="flight-info">
        ${flight.durationOutbound} ${flightClass}
      </div>
      <div class="baggage-info">
        ${baggageIcons[baggageType] || baggageIcons['hand-only']}
      </div>
    </div>
    ${tripTypeFilter.value === 'round-trip' ? `
      <div class="flight-segment">
        <h3>Volta</h3>
        <div class="flight-route">
          <div class="airport departure">
            <span class="code">${flight.destination.match(/\(([^)]+)\)/)[1]}</span>
            <span class="city">${flight.destination.split(', ')[1]}</span>
          </div>
          <div class="route-connector">
            <i class="fas fa-plane-departure"></i>
            <div class="curved-line"></div>
          </div>
          <div class="flight-details">
            <span class="time">${flight.returnDepartureTime}</span>
            <span class="date">${new Date(flight.returnDate).toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
            <span class="airline">${flight.airline.toUpperCase()} ${flight.flightNumber || 'TP015'}</span>
          </div>
          <div class="route-connector">
            <div class="curved-line"></div>
            <i class="fas fa-plane-arrival"></i>
          </div>
          <div class="airport arrival">
            <span class="code">${flight.origin.match(/\(([^)]+)\)/)[1]}</span>
            <span class="city">${flight.origin.split(', ')[1]}</span>
          </div>
        </div>
        <div class="flight-info">
          ${flight.durationReturn} ${flightClass}
        </div>
        <div class="baggage-info">
          ${baggageIcons[baggageType] || baggageIcons['hand-only']}
        </div>
      </div>
    ` : ''}
    <div class="price-table">
      <table>
        <tr>
          <th>Descrição</th>
          <th>Tarifa</th>
          <th>Taxas</th>
          <th>Car. Emissão</th>
          <th>Bagagem</th>
          <th>Preço</th>
          <th>Quantidade</th>
          <th>Total</th>
        </tr>
        <tr>
          <td>Adulto</td>
          <td>${tariffAdult.replace('.', ',')}€</td>
          <td>${taxesAdult.replace('.', ',')}€</td>
          <td>${emissionAdult.replace('.', ',')}€</td>
          <td>${baggageCostAdult.toFixed(2).replace('.', ',')}€</td>
          <td>${totalPerAdult.replace('.', ',')}€</td>
          <td>x${counts.adultos}</td>
          <td class="total">${totalAdult.replace('.', ',')}€</td>
        </tr>
        ${counts.criancas > 0 ? `
          <tr>
            <td>Criança</td>
            <td>${tariffChild.replace('.', ',')}€</td>
            <td>${taxesChild.replace('.', ',')}€</td>
            <td>${emissionChild.replace('.', ',')}€</td>
            <td>${baggageCostChild.toFixed(2).replace('.', ',')}€</td>
            <td>${totalPerChild.replace('.', ',')}€</td>
            <td>x${counts.criancas}</td>
            <td class="total">${totalChild.replace('.', ',')}€</td>
          </tr>
        ` : ''}
        ${counts.bebes > 0 ? `
          <tr>
            <td>Bebé</td>
            <td>${tariffBaby.replace('.', ',')}€</td>
            <td>${taxesBaby.replace('.', ',')}€</td>
            <td>${emissionBaby.replace('.', ',')}€</td>
            <td>${baggageCostBaby.toFixed(2).replace('.', ',')}€</td>
            <td>${totalPerBaby.replace('.', ',')}€</td>
            <td>x${counts.bebes}</td>
            <td class="total">${totalBaby.replace('.', ',')}€</td>
          </tr>
        ` : ''}
      </table>
    </div>
    <div class="preco-final">
      ${displayPrice.toFixed(2).replace('.', ',')}€ Inclui voos, taxas, custos de emissão, bagagem...
    </div>
  `;

  sidebar.classList.add('ativo');
}

function displayFlights(flights, append = false) {
  console.log('Displaying flights:', {
    totalFlights: flights.length,
    append: append,
    displayedFlightsCount: displayedFlightsCount
  });
  
  // Criar um container para os cartões de voo se não existir
  let flightCardsContainer = document.getElementById('flight-cards-container');
  if (!flightCardsContainer) {
    flightCardsContainer = document.createElement('div');
    flightCardsContainer.id = 'flight-cards-container';
    flightResults.appendChild(flightCardsContainer);
  }

  if (!append) {
    flightCardsContainer.innerHTML = ''; // Limpar apenas os cartões
    displayedFlightsCount = 0; // Resetar contagem ao exibir novos resultados
  }

  if (flights.length === 0) {
    flightCount.textContent = '0 Voos Disponíveis';
    flightCardsContainer.innerHTML = `
      <div class="no-results">
        <p>Nenhum voo encontrado com os filtros selecionados.</p>
        <p>Tente ajustar os seus filtros ou datas de viagem.</p>
      </div>
    `;
    document.getElementById('no-hotels').style.display = 'none';
    document.getElementById('load-more').style.display = 'none';
    return;
  }

  const sortBy = sortSelect.value;
  let sortedFlights = [...flights];

  function getFlightDuration(duration) {
    const [hours, minutes] = duration.split('h ').map((part, index) => parseInt(index === 0 ? part : part.replace('m', '')));
    return hours * 60 + minutes;
  }

  // Criar cartões temporariamente para obter os preços calculados
  sortedFlights = sortedFlights.map(flight => {
    const baggageType = baggageFilter.value === 'any' ? 'hand-only' : baggageFilter.value;
    const classType = classFilter.value === 'any' ? flight.class : classFilter.value;
    const basePrice = tripTypeFilter.value === 'one-way' ? flight.price * 0.6 : flight.price;
    const totalPrice = calculateTotalPrice(basePrice, baggageType, classType);
    return { ...flight, calculatedPrice: totalPrice };
  });

  if (sortBy === 'cheapest') {
    sortedFlights.sort((a, b) => a.calculatedPrice - b.calculatedPrice);
  } else if (sortBy === 'most-expensive') {
    sortedFlights.sort((a, b) => b.calculatedPrice - a.calculatedPrice);
  } else if (sortBy === 'fastest') {
    sortedFlights.sort((a, b) => {
      const durationA = getFlightDuration(a.durationOutbound) + (tripTypeFilter.value === 'round-trip' ? getFlightDuration(a.durationReturn) : 0);
      const durationB = getFlightDuration(b.durationOutbound) + (tripTypeFilter.value === 'round-trip' ? getFlightDuration(b.durationReturn) : 0);
      return durationA - durationB;
    });
  } else if (sortBy === 'fewer-stops') {
    sortedFlights.sort((a, b) => {
      const stopsA = a.isDirect ? 0 : 1;
      const stopsB = b.isDirect ? 0 : 1;
      return stopsA - stopsB;
    });
  }

  console.log('Sorted flights:', {
    totalSorted: sortedFlights.length,
    flights: sortedFlights.map(f => `${f.origin} → ${f.destination}`)
  });

  // Exibir apenas uma fatia dos voos
  const startIndex = displayedFlightsCount;
  const endIndex = Math.min(startIndex + flightsPerPage, sortedFlights.length);
  const flightsToShow = sortedFlights.slice(startIndex, endIndex);

  console.log('Flights to show:', {
    startIndex,
    endIndex,
    count: flightsToShow.length,
    flights: flightsToShow.map(f => `${f.origin} → ${f.destination}`)
  });

  flightsToShow.forEach(flight => {
    const isCheapest = flight === sortedFlights[0] && sortBy === 'cheapest';
    const isFastest = flight === sortedFlights[0] && sortBy === 'fastest';
    flightCardsContainer.innerHTML += createFlightCard(flight, isCheapest ? 'cheapest' : isFastest ? 'suggestion' : 'normal');
  });

  displayedFlightsCount = endIndex;
  flightCount.textContent = `${sortedFlights.length} Voos Disponíveis`;

  // Remover botão existente se houver
  const existingButton = document.querySelector('.load-more-button');
  if (existingButton) {
    existingButton.remove();
  }

  // Adicionar botão "Carregar Mais" se houver mais voos
  if (displayedFlightsCount < sortedFlights.length) {
    const loadMoreButton = document.createElement('button');
    loadMoreButton.className = 'load-more-button';
    loadMoreButton.textContent = 'Carregar Mais Voos';
    loadMoreButton.addEventListener('click', async () => {
      loadMoreButton.classList.add('loading');
      loadMoreButton.disabled = true;
      
      // Simular delay de carregamento
      await new Promise(resolve => setTimeout(resolve, 800));
      
      displayFlights(sortedFlights, true);
    });
    flightCardsContainer.after(loadMoreButton);
  }

  // Adicionar event listeners para os botões
  const detailButtons = document.querySelectorAll('.details-button');
  const selectButtons = document.querySelectorAll('.select-button');
  const favoriteButtons = document.querySelectorAll('.favorite-button');

  detailButtons.forEach(button => {
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    newButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const flightCard = newButton.closest('.flight');
      const flight = {
        origin: flightCard.dataset.origin,
        destination: flightCard.dataset.destination,
        departureDate: flightCard.dataset.departureDate,
        returnDate: flightCard.dataset.returnDate,
        airline: flightCard.dataset.airline,
        departureTime: flightCard.dataset.departureTime,
        arrivalTime: flightCard.dataset.arrivalTime,
        returnDepartureTime: flightCard.dataset.returnDepartureTime,
        returnArrivalTime: flightCard.dataset.returnArrivalTime,
        durationOutbound: flightCard.dataset.durationOutbound,
        durationReturn: flightCard.dataset.durationReturn,
        isDirect: flightCard.dataset.isDirect === 'true',
        price: parseFloat(flightCard.dataset.price),
        class: flightCard.dataset.class,
        baggage: flightCard.dataset.baggage,
        flightNumber: flightsData.find(f => f.origin === flightCard.dataset.origin && f.destination === flightCard.dataset.destination && f.airline === flightCard.dataset.airline).flightNumber
      };
      sidebar.classList.remove('ativo');
      setTimeout(() => showFlightDetails(flight), 100);
    });
  });

  // Adicionar função para adicionar ao carrinho
  function adicionarAoCarrinho(flight, button) {
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
      
      // Verificar se o voo já está no carrinho
      const itemExistente = carrinhoItens.find(item => 
        item.tipo === 'voo' && 
        item.origem === flight.origin &&
        item.destino === flight.destination &&
        item.dataIda === flight.departureDate &&
        item.dataVolta === flight.returnDate &&
        item.classe === flight.class &&
        item.bagagem === flight.baggage
      );

      if (itemExistente) {
        showCustomAlert('Este voo já está no seu carrinho!', 'info');
        return;
      }

      // Criar novo item
      const novoItem = {
        id: Date.now(),
        tipo: 'voo',
        origem: flight.origin,
        destino: flight.destination,
        dataIda: flight.departureDate,
        dataVolta: flight.returnDate,
        adultos: counts.adultos,
        criancas: counts.criancas,
        bebes: counts.bebes,
        preco: parseFloat(flight.price),
        imagem: flight.airline === 'ae' ? 'media/aireuropa.jpg' : `media/${flight.airline}.jpg`,
        quantidade: 1,
        classe: flight.class,
        bagagem: flight.baggage,
        airline: flight.airline,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        returnDepartureTime: flight.returnDepartureTime,
        returnArrivalTime: flight.returnArrivalTime,
        durationOutbound: flight.durationOutbound,
        durationReturn: flight.durationReturn,
        isDirect: flight.isDirect
      };

      // Adicionar ao carrinho
      carrinhoItens.push(novoItem);
      
      // Salvar no localStorage
      localStorage.setItem("carrinhoItens", JSON.stringify(carrinhoItens));
      
      // Atualizar o botão
      button.innerHTML = '<i class="fas fa-check"></i> Adicionado ao Carrinho';
      button.classList.add('adicionado');
      button.disabled = true;
      
      // Mostrar mensagem de sucesso
      showCustomAlert('Voo adicionado ao carrinho com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      showCustomAlert('Erro ao adicionar ao carrinho. Tente novamente.', 'error');
    }
  }

  // Atualizar o event listener do botão de adicionar ao carrinho
  selectButtons.forEach(button => {
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    newButton.addEventListener('click', () => {
      const flightCard = newButton.closest('.flight');
      const flight = {
        origin: flightCard.dataset.origin,
        destination: flightCard.dataset.destination,
        departureDate: flightCard.dataset.departureDate,
        returnDate: flightCard.dataset.returnDate,
        airline: flightCard.dataset.airline,
        price: flightCard.dataset.price,
        class: flightCard.dataset.class,
        baggage: flightCard.dataset.baggage,
        departureTime: flightCard.dataset.departureTime,
        arrivalTime: flightCard.dataset.arrivalTime,
        returnDepartureTime: flightCard.dataset.returnDepartureTime,
        returnArrivalTime: flightCard.dataset.returnArrivalTime,
        durationOutbound: flightCard.dataset.durationOutbound,
        durationReturn: flightCard.dataset.durationReturn,
        isDirect: flightCard.dataset.isDirect === 'true'
      };
      adicionarAoCarrinho(flight, newButton);
    });
  });

  favoriteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const flightCard = button.closest('.flight');
      toggleFavorite(flightCard);
    });
  });
}

  // Fechar painel lateral
  closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('ativo');
  });

  // Função para normalizar strings
  function normalizeString(str) {
    if (!str) return '';
    return str
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ');
  }

  function filterFlights() {
    // Atualizar o preço máximo primeiro
    updatePriceRangeMax();
    
    // Aplicar o filtro imediatamente
    performFilter();
  }
  
  function performFilter() {
    const origin = normalizeString(document.getElementById('origin').value);
    const destination = normalizeString(document.getElementById('destination').value);
    const departureDate = document.getElementById('departure-date').value;
    const returnDate = tripTypeFilter.value === 'round-trip' ? document.getElementById('return-date').value : null;
    const airline = airlineFilter.value;
    const flightClass = classFilter.value;
    const baggage = baggageFilter.value;
    const directFlights = directFlightsCheckbox.checked;
    const maxPrice = priceRange ? parseFloat(priceRange.value) : Infinity;
  
    console.log('Total flights before filtering:', flightsData.length);
    console.log('Current filters:', {
      origin,
      destination,
      departureDate,
      returnDate,
      airline,
      flightClass,
      baggage,
      directFlights,
      maxPrice
    });
  
    // Filtrar voos
    const newFilteredFlights = flightsData.filter(flight => {
      // Calcular o preço total para o filtro de preço primeiro
      const baggageType = baggage === 'any' ? 'hand-only' : baggage;
      const classType = flightClass === 'any' ? flight.class : flightClass;
      const basePrice = tripTypeFilter.value === 'one-way' ? flight.price * 0.6 : flight.price;
      const totalPrice = calculateTotalPrice(basePrice, baggageType, classType);
  
      // Aplicar todos os filtros
      const priceMatch = totalPrice <= maxPrice;
      const airlineMatch = airline === 'any' || flight.airline === airline;
      const directMatch = !directFlights || flight.isDirect;
      const classMatch = flightClass === 'any' || flight.class === flightClass;
  
      // Verificar campos obrigatórios
      const flightOrigin = normalizeString(flight.origin);
      const flightDestination = normalizeString(flight.destination);
  
      // Verificar se é uma busca específica de favorito
      const isFromFavorites = origin && destination && departureDate;
      
      let originMatch, destinationMatch, departureDateMatch, returnDateMatch;
      
      if (isFromFavorites) {
        // Correspondência exata para favoritos
        originMatch = flightOrigin === origin;
        destinationMatch = flightDestination === destination;
        departureDateMatch = flight.departureDate === departureDate;
        returnDateMatch = !returnDate || flight.returnDate === returnDate;
      } else {
        // Correspondência parcial para busca normal
        originMatch = !origin || flightOrigin.includes(origin) || origin.includes(flightOrigin);
        destinationMatch = !destination || flightDestination.includes(destination) || destination.includes(flightDestination);
        departureDateMatch = !departureDate || flight.departureDate === departureDate;
        returnDateMatch = tripTypeFilter.value !== 'round-trip' || !returnDate || flight.returnDate === returnDate;
      }

      // Debug logs para datas
      if (departureDate && !departureDateMatch) {
        console.log('Date mismatch:', {
          expected: departureDate,
          got: flight.departureDate,
          flight: `${flight.origin} → ${flight.destination}`
        });
      }
      if (returnDate && !returnDateMatch) {
        console.log('Return date mismatch:', {
          expected: returnDate,
          got: flight.returnDate,
          flight: `${flight.origin} → ${flight.destination}`
        });
      }
  
      const shouldInclude = priceMatch && airlineMatch && directMatch && classMatch &&
                           originMatch && destinationMatch && departureDateMatch && returnDateMatch;
  
      if (!shouldInclude) {
        console.log('Flight excluded:', {
          flight: `${flight.origin} → ${flight.destination}`,
          reason: {
            price: !priceMatch ? 'Price too high' : null,
            airline: !airlineMatch ? 'Wrong airline' : null,
            direct: !directMatch ? 'Not direct flight' : null,
            class: !classMatch ? 'Wrong class' : null,
            origin: !originMatch ? 'Wrong origin' : null,
            destination: !destinationMatch ? 'Wrong destination' : null,
            departureDate: !departureDateMatch ? `Expected ${departureDate}, got ${flight.departureDate}` : null,
            returnDate: !returnDateMatch ? `Expected ${returnDate}, got ${flight.returnDate}` : null
          }
        });
      }
  
      return shouldInclude;
    });
    // Atualizar a variável global filteredFlights
    filteredFlights = newFilteredFlights;
  
    displayFlights(filteredFlights);
  }

  // Event listeners para filtros avançados
  airlineFilter.addEventListener('change', filterFlights);
  classFilter.addEventListener('change', filterFlights);
  baggageFilter.addEventListener('change', filterFlights);
  directFlightsCheckbox.addEventListener('change', filterFlights);
  sortSelect.addEventListener('change', filterFlights);

  // Debounce para o slider de preço
  priceRange.addEventListener('input', () => {
    // Atualizar o texto imediatamente com a formatação portuguesa
    priceValue.textContent = `Até ${parseFloat(priceRange.value).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}`;
    priceRange.setAttribute('aria-valuenow', priceRange.value);
    
    // Aplicar o filtro imediatamente
    performFilter();
  });

  // Fechar dropdown ao clicar fora
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown') && !e.target.closest('.dropdown-btn')) {
      dropdownContent.style.display = 'none';
    }
  });

  // Adicionar validação dinâmica de datas
  function checkDates() {
    const departure = document.getElementById('departure-date');
    const returnInput = document.getElementById('return-date');
    
    if (!departure || !returnInput) return;

    returnInput.setCustomValidity('');
    if (departure.value && returnInput.value) {
      const depDate = new Date(departure.value);
      const retDate = new Date(returnInput.value);
      if (retDate < depDate) {
        returnInput.setCustomValidity('A data de volta não pode ser anterior à data de ida.');
      }
    }
  }

  // Validação ao mudar as datas
  departureDateInput.addEventListener('change', function() {
    this.setCustomValidity('');
    checkDates();
    this.reportValidity();
  });

  returnDateInput.addEventListener('change', function() {
    this.setCustomValidity('');
    checkDates();
    this.reportValidity();
  });

  // Atualizar a função validateSearchForm para usar o novo sistema de validação
  function validateSearchForm() {
      const origin = document.getElementById('origin');
      const destination = document.getElementById('destination');
      const departureDateInput = document.getElementById('departure-date');
      const returnDateInput = document.getElementById('return-date');

      // Resetar todas as mensagens de erro
      [origin, destination, departureDateInput, returnDateInput].forEach(input => {
        if (input) input.setCustomValidity('');
      });

      // Validar origem
      if (!origin.value.trim()) {
        origin.setCustomValidity('Por favor, insira a origem.');
        origin.reportValidity();
        return false;
      }

      // Validar destino
      if (!destination.value.trim()) {
        destination.setCustomValidity('Por favor, insira o destino.');
        destination.reportValidity();
        return false;
      }

      // Validar se origem e destino são diferentes
      if (origin.value.toLowerCase() === destination.value.toLowerCase()) {
        destination.setCustomValidity('A origem e o destino não podem ser iguais.');
        destination.reportValidity();
        return false;
      }

      // Validar data de ida
      if (!departureDateInput.value) {
        departureDateInput.setCustomValidity('Por favor, insira a data de ida.');
        departureDateInput.reportValidity();
        return false;
      }

      // Validar se a data de ida não é no passado
      const departure = new Date(departureDateInput.value);
      if (departure < today) {
        departureDateInput.setCustomValidity('A data de ida não pode ser no passado.');
        departureDateInput.reportValidity();
        return false;
      }

      // Validar data de volta apenas para viagens de ida e volta
      if (tripTypeFilter.value === 'round-trip') {
        if (!returnDateInput.value) {
          returnDateInput.setCustomValidity('Por favor, insira a data de volta.');
          returnDateInput.reportValidity();
          return false;
        }

        // Usar a função checkDates para validação consistente
        checkDates();
        if (returnDateInput.validity.customError) {
          returnDateInput.reportValidity();
          return false;
        }
      }

      return true;
  }

  // Atualizar o clearFiltersButton para resetar as validações
  clearFiltersButton.addEventListener('click', () => {
    tripTypeFilter.value = 'round-trip';
    airlineFilter.value = 'any';
    classFilter.value = 'any';
    baggageFilter.value = 'any';
    directFlightsCheckbox.checked = false;
    
    const origin = document.getElementById('origin');
    const destination = document.getElementById('destination');
    
    origin.value = '';
    destination.value = '';
    departureDateInput.value = '';
    returnDateInput.value = '';
    
    // Limpar mensagens de validação
    [origin, destination, departureDateInput, returnDateInput].forEach(input => {
      if (input) {
        input.setCustomValidity('');
        input.reportValidity();
      }
    });

    counts = { adultos: 1, criancas: 0, bebes: 0 };
    document.getElementById('adultosCount').textContent = '1';
    document.getElementById('criancasCount').textContent = '0';
    document.getElementById('bebesCount').textContent = '0';
    sortSelect.value = 'cheapest';

    // Resetar a faixa de preço para 900
    if (priceRange) {
      priceRange.max = 900;
      priceRange.value = 900;
      priceValue.textContent = `Até ${parseFloat(priceRange.value).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}`;
      priceRange.setAttribute('aria-valuemax', 900);
      priceRange.setAttribute('aria-valuenow', priceRange.value);
      priceRange.removeAttribute('data-initialized');
    }

    updatePassengerText();
    updateReturnDateVisibility();
    filteredFlights = flightsData.map(flight => ({ ...flight }));
    displayFlights(filteredFlights);
  });

  // Adicionar CSS para as mensagens de erro
  const style = document.createElement('style');
  style.textContent = `
    .form-error-messages {
      color: #dc3545;
      margin: 15px 0;
    }
  `;
  document.head.appendChild(style);

  // Função para mostrar mensagens bonitas
  function showMessage(message, type = 'success') {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message message-${type}`;
    messageContainer.style.position = 'fixed';
    messageContainer.style.top = '20px';
    messageContainer.style.right = '20px';
    messageContainer.style.backgroundColor = type === 'success' ? '#28a745' : '#dc3545';
    messageContainer.style.color = '#fff';
    messageContainer.style.padding = '15px 25px';
    messageContainer.style.borderRadius = '5px';
    messageContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    messageContainer.style.zIndex = '9999';
    messageContainer.style.animation = 'slideIn 0.5s ease-out';
    messageContainer.textContent = message;

    // Adicionar estilos de animação
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(messageContainer);
    setTimeout(() => {
      messageContainer.style.animation = 'slideIn 0.5s ease-out reverse';
      setTimeout(() => messageContainer.remove(), 500);
    }, 3000);
  }

  function toggleFavorite(flightCard) {
    // Verificar se há um usuário logado usando sessionStorage
    const activeUser = JSON.parse(sessionStorage.getItem('activeUser'));
    if (!activeUser || !activeUser.email) {
      showMessage('Por favor, faz login para adicionar voos aos favoritos.', 'error');
      return;
    }

    // Buscar o usuário nos dados salvos
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === activeUser.email);
    
    if (!user) {
      showMessage('Erro ao encontrar utilizador. Por favor, faz login novamente.', 'error');
      return;
    }

    const flight = {
      origin: flightCard.dataset.origin,
      destination: flightCard.dataset.destination,
      departureDate: flightCard.dataset.departureDate,
      returnDate: flightCard.dataset.returnDate,
      airline: flightCard.dataset.airline,
      price: flightCard.dataset.price,
      class: flightCard.dataset.class,
      baggage: flightCard.dataset.baggage
    };

    if (!user.favorites) {
      user.favorites = [];
    }

    const favoriteIndex = user.favorites.findIndex(fav => 
      fav.origin === flight.origin && 
      fav.destination === flight.destination && 
      fav.departureDate === flight.departureDate &&
      fav.airline === flight.airline
    );

    const favoriteButton = flightCard.querySelector('.favorite-button');

    if (favoriteIndex === -1) {
      user.favorites.push(flight);
      favoriteButton.classList.add('active');
      // Atualizar o activeUser no sessionStorage também
      activeUser.favorites = user.favorites;
      sessionStorage.setItem('activeUser', JSON.stringify(activeUser));
      showMessage('Voo adicionado aos favoritos!', 'success');
    } else {
      user.favorites.splice(favoriteIndex, 1);
      favoriteButton.classList.remove('active');
      // Atualizar o activeUser no sessionStorage também
      activeUser.favorites = user.favorites;
      sessionStorage.setItem('activeUser', JSON.stringify(activeUser));
      showMessage('Voo removido dos favoritos!', 'success');
    }

    // Atualizar o usuário no localStorage
    const userIndex = users.findIndex(u => u.email === activeUser.email);
    if (userIndex !== -1) {
      users[userIndex] = user;
      localStorage.setItem('users', JSON.stringify(users));
    }
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

  // Adicionar validação em tempo real para os campos
  document.getElementById('origin').addEventListener('input', function() {
    this.setCustomValidity('');
  });

  document.getElementById('destination').addEventListener('input', function() {
    this.setCustomValidity('');
  });

  departureDateInput.addEventListener('input', function() {
    this.setCustomValidity('');
  });

  returnDateInput.addEventListener('input', function() {
    this.setCustomValidity('');
  });

  // Função para verificar itens no carrinho ao carregar a página
  function verificarItensCarrinho() {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.loggedIn) return;

      const carrinhoItens = JSON.parse(localStorage.getItem("carrinhoItens")) || [];
      
      document.querySelectorAll('.flight').forEach(flightCard => {
        const flight = {
          origin: flightCard.dataset.origin,
          destination: flightCard.dataset.destination,
          departureDate: flightCard.dataset.departureDate,
          returnDate: flightCard.dataset.returnDate,
          class: flightCard.dataset.class,
          baggage: flightCard.dataset.baggage
        };

        const itemNoCarrinho = carrinhoItens.find(item => 
          item.tipo === 'voo' && 
          item.origem === flight.origin &&
          item.destino === flight.destination &&
          item.dataIda === flight.departureDate &&
          item.dataVolta === flight.returnDate &&
          item.classe === flight.class &&
          item.bagagem === flight.baggage
        );

        if (itemNoCarrinho) {
          const button = flightCard.querySelector('.select-button');
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