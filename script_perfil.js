document.addEventListener('DOMContentLoaded', () => {
  // Retrieve data from localStorage and sessionStorage
  const users = JSON.parse(localStorage.getItem('users')) || [];
  let sessionUser = JSON.parse(sessionStorage.getItem('activeUser')) || {};

  // Find user in localStorage by email
  const localUser = users.find(u => u.email === sessionUser.email) || {};

  // Merge localStorage and sessionStorage, prioritizing sessionStorage for dynamic data
  let activeUser = {
    email: sessionUser.email || localUser.email || '',
    firstName: sessionUser.firstName || localUser.firstName || '',
    lastName: sessionUser.lastName || localUser.lastName || '',
    dataNascimento: sessionUser.dataNascimento || localUser.dataNascimento || '',
    telefone: sessionUser.telefone || localUser.telefone || '',
    morada: sessionUser.morada || localUser.morada || '',
    codigoPostal: sessionUser.codigoPostal || localUser.codigoPostal || '',
    localidade: sessionUser.localidade || localUser.localidade || '',
    nif: sessionUser.nif || localUser.nif || '',
    cc: sessionUser.cc || localUser.cc || '',
    passaporte: sessionUser.passaporte || localUser.passaporte || '',
    password: sessionUser.password || localUser.password || '',
    reservations: sessionUser.reservations || localUser.reservations || [],
    favorites: sessionUser.favorites || localUser.favorites || [],
    passengers: sessionUser.passengers || localUser.passengers || [],
    nomeFaturacao: sessionUser.nomeFaturacao || localUser.nomeFaturacao || '',
    emailFaturacao: sessionUser.emailFaturacao || localUser.emailFaturacao || '',
    telefoneFaturacao: sessionUser.telefoneFaturacao || localUser.telefoneFaturacao || '',
    moradaFaturacao: sessionUser.moradaFaturacao || localUser.moradaFaturacao || '',
    codigoPostalFaturacao: sessionUser.codigoPostalFaturacao || localUser.codigoPostalFaturacao || '',
    localidadeFaturacao: sessionUser.localidadeFaturacao || localUser.localidadeFaturacao || '',
    nifFaturacao: sessionUser.nifFaturacao || localUser.nifFaturacao || '',
    favoriteHotels: sessionUser.favoriteHotels || localUser.favoriteHotels || []
  };

  if (!activeUser.email) {
    window.location.href = 'login.html';
    return;
  }

  const sanitizeHTML = (str) => {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  };

  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDateFromDDMMYYYY = (dateString) => {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  const showMessage = (message, type = 'success') => {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message message-${type}`;
    messageContainer.textContent = message;
    document.body.appendChild(messageContainer);
    setTimeout(() => messageContainer.remove(), 3000);
  };

  const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];
  const saveUsers = (users) => localStorage.setItem('users', JSON.stringify(users));

  const updateUserData = (data) => {
    let users = getUsers();
    const userIndex = users.findIndex(u => u.email === activeUser.email);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...data };
      saveUsers(users);
    } else {
      users.push(data);
      saveUsers(users);
    }
    activeUser = { ...activeUser, ...data };
    sessionStorage.setItem('activeUser', JSON.stringify(activeUser));
  };

  const clearErrorMessages = (form) => {
    form.querySelectorAll('.error-message').forEach(span => span.style.display = 'none');
  };

  // Carregar nome na barra lateral
  document.getElementById('user-name').textContent = `Olá ${sanitizeHTML(activeUser.firstName)}!`;

  // Carregar dados pessoais
  const personalDataForm = document.getElementById('personal-data-form');
  const loadPersonalData = () => {
    document.getElementById('nome').value = activeUser.firstName || '';
    document.getElementById('apelido').value = activeUser.lastName || '';
    document.getElementById('email').value = activeUser.email || '';
    document.getElementById('data-nascimento').value = activeUser.dataNascimento || '';
    document.getElementById('telefone').value = activeUser.telefone || '';
    document.getElementById('morada').value = activeUser.morada || '';
    document.getElementById('codigo-postal').value = activeUser.codigoPostal || '';
    document.getElementById('localidade').value = activeUser.localidade || '';
    document.getElementById('nif').value = activeUser.nif || '';
    document.getElementById('cc').value = activeUser.cc || '';
    document.getElementById('passaporte').value = activeUser.passaporte || '';
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
    clearErrorMessages(personalDataForm);
  };
  loadPersonalData();

  // Carregar dados de faturação
  const billingForm = document.getElementById('faturacao-form');
  const loadBillingData = () => {
    document.getElementById('nome-faturacao').value = activeUser.nomeFaturacao || '';
    document.getElementById('email-faturacao').value = activeUser.emailFaturacao || '';
    document.getElementById('telefone-faturacao').value = activeUser.telefoneFaturacao || '';
    document.getElementById('morada-faturacao').value = activeUser.moradaFaturacao || '';
    document.getElementById('codigo-postal-faturacao').value = activeUser.codigoPostalFaturacao || '';
    document.getElementById('localidade-faturacao').value = activeUser.localidadeFaturacao || '';
    document.getElementById('nif-faturacao').value = activeUser.nifFaturacao || '';
    clearErrorMessages(billingForm);
  };
  loadBillingData();

  // Carregar viagens e favoritos
  const loadTripsAndFavorites = () => {
    const upcomingTripsList = document.getElementById('upcoming-trips-list');
    const pastTripsList = document.getElementById('past-trips-list');
    const flightFavoritesList = document.getElementById('flight-favorites');
    const hotelFavoritesList = document.getElementById('hotel-favorites');

    const today = new Date();
    const upcoming = activeUser.reservations.filter(r => new Date(r.date) >= today);
    const past = activeUser.reservations.filter(r => new Date(r.date) < today);

    upcomingTripsList.innerHTML = upcoming.length
      ? upcoming.map(r => `
          <div class="trip-item">
            <span>${sanitizeHTML(r.type)} para ${sanitizeHTML(r.destination)}</span>
            <span>Data: ${sanitizeHTML(r.date)}</span>
            <button class="btn btn-danger" data-action="cancel" data-id="${r.id}" aria-label="Cancelar reserva para ${sanitizeHTML(r.destination)}">Cancelar</button>
          </div>
        `).join('')
      : '<p>Nenhuma viagem encontrada. <a href="index.html">Planeie a sua próxima aventura!</a></p>';

    pastTripsList.innerHTML = past.length
      ? past.map(r => `
          <div class="trip-item">
            <span>${sanitizeHTML(r.type)} para ${sanitizeHTML(r.destination)}</span>
            <span>Data: ${sanitizeHTML(r.date)}</span>
          </div>
        `).join('')
      : '<p>Nenhuma viagem realizada encontrada. <a href="index.html">Comece a explorar hoje!</a></p>';

    // Handle flight favorites
    const flightFavorites = activeUser.favorites || [];
    flightFavoritesList.innerHTML = flightFavorites.length
      ? flightFavorites.map(f => `
          <div class="favorite-item">
            <div class="favorite-content">
              <button class="favorite-remove" data-action="remove-flight-favorite" 
                      data-origin="${sanitizeHTML(f.origin)}" 
                      data-destination="${sanitizeHTML(f.destination)}"
                      data-date="${sanitizeHTML(f.departureDate)}"
                      data-airline="${sanitizeHTML(f.airline)}"
                      aria-label="Remover voo dos favoritos">
                <i class="fas fa-trash"></i>
              </button>
              <div class="favorite-main">
                <div class="favorite-title">
                  <i class="fas fa-plane"></i>
                  <span>${sanitizeHTML(f.origin)} → ${sanitizeHTML(f.destination)}</span>
                </div>
                <div class="favorite-info">
                  <span><i class="fas fa-calendar"></i> ${sanitizeHTML(f.departureDate)}</span>
                  <span><i class="fas fa-plane-departure"></i> ${sanitizeHTML(f.airline)}</span>
                </div>
                <div class="favorite-bottom">
                  <span class="price-value"><i class="fas fa-tag"></i> ${f.price}€</span>
                  <a href="voos.html?origem=${encodeURIComponent(f.origin)}&destino=${encodeURIComponent(f.destination)}&dataIda=${encodeURIComponent(f.departureDate)}&dataVolta=${encodeURIComponent(f.returnDate)}&adultos=1" class="btn-view">Ver voo</a>
                </div>
              </div>
            </div>
          </div>
        `).join('')
      : `<div class="no-favorites">
          <i class="fas fa-plane"></i>
          <h4>Nenhum voo favorito</h4>
          <p>Ainda não adicionou nenhum voo aos seus favoritos.</p>
          <p class="suggestion">Explore nossos voos e marque seus favoritos para acompanhar preços e disponibilidade!</p>
          <a href="voos.html" class="btn">Explorar Voos</a>
         </div>`;

    // Handle hotel favorites
    const hotelFavorites = activeUser.favoriteHotels || [];
    const hotels = JSON.parse(localStorage.getItem('hotels')) || [];
    hotelFavoritesList.innerHTML = hotelFavorites.length
      ? hotelFavorites.map(hotelId => {
          const hotel = hotels.find(h => h.id === hotelId);
          if (!hotel) return '';
          return `
            <div class="favorite-item">
              <div class="favorite-content">
                <button class="favorite-remove" data-action="remove-hotel-favorite" 
                        data-hotel-id="${hotel.id}"
                        aria-label="Remover hotel dos favoritos">
                  <i class="fas fa-trash"></i>
                </button>
                <div class="favorite-main">
                  <div class="favorite-title">
                    <i class="fas fa-hotel"></i>
                    <span>${sanitizeHTML(hotel.name)}</span>
                  </div>
                  <div class="favorite-info">
                    <span><i class="fas fa-map-marker-alt"></i> ${sanitizeHTML(hotel.location)}</span>
                    <span><i class="fas fa-star"></i> ${hotel.rating}/10 (${hotel.reviews} avaliações)</span>
                  </div>
                  <div class="favorite-bottom">
                    <span class="price-value"><i class="fas fa-tag"></i> A partir de ${hotel.price}€</span>
                    <a href="detalhes_hotel.html?id=${hotel.id}" class="btn-view">Ver hotel</a>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('')
      : `<div class="no-favorites">
          <i class="fas fa-hotel"></i>
          <h4>Nenhum hotel favorito</h4>
          <p>Ainda não adicionou nenhum hotel aos seus favoritos.</p>
          <p class="suggestion">Descubra hotéis incríveis e marque seus favoritos para futuras viagens!</p>
          <a href="hotel.html" class="btn">Explorar Hotéis</a>
         </div>`;
  };

  document.getElementById('flight-favorites').addEventListener('click', (e) => {
    const button = e.target.closest('[data-action="remove-flight-favorite"]');
    if (button) {
      const origin = button.dataset.origin;
      const destination = button.dataset.destination;
      const departureDate = button.dataset.date;
      const airline = button.dataset.airline;
  
      showCustomConfirm(
        'Remover Voo dos Favoritos',
        'Tem certeza que deseja remover este voo dos seus favoritos?',
        () => {
          activeUser.favorites = activeUser.favorites.filter(f =>
            !(f.origin === origin &&
              f.destination === destination &&
              f.departureDate === departureDate &&
              f.airline === airline)
          );
          updateUserData(activeUser);
          loadTripsAndFavorites();
          showMessage('Voo removido dos favoritos!');
        }
      );
    }
  });
  
  document.getElementById('hotel-favorites').addEventListener('click', (e) => {
    const button = e.target.closest('[data-action="remove-hotel-favorite"]');
    if (button) {
      const hotelId = parseInt(button.dataset.hotelId);
  
      showCustomConfirm(
        'Remover Hotel dos Favoritos',
        'Tem certeza que deseja remover este hotel dos seus favoritos?',
        () => {
          activeUser.favoriteHotels = activeUser.favoriteHotels.filter(id => id !== hotelId);
          updateUserData(activeUser);
          loadTripsAndFavorites();
          showMessage('Hotel removido dos favoritos!');
        }
      );
    }
  });
  
  // Formatar código postal
  const formatPostalCode = (input) => {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 4) value = `${value.substring(0, 4)}-${value.substring(4, 7)}`;
    else if (value.length === 4) value += '-';
    input.value = value.substring(0, 8);
  };
  ['codigo-postal', 'codigo-postal-faturacao'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', (e) => formatPostalCode(e.target));
    }
  });

  // Formatar NIF
  ['nif', 'nif-faturacao'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 9);
      });
    }
  });

  // Alternar visibilidade da palavra-passe
  document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', () => {
      const input = button.previousElementSibling;
      const icon = button.querySelector('i');
      input.type = input.type === 'password' ? 'text' : 'password';
      icon.classList.toggle('fa-eye', input.type === 'password');
      icon.classList.toggle('fa-eye-slash', input.type !== 'password');
    });
  });

  // Inicializar passageiros
  if (!activeUser.passengers.length) {
    activeUser.passengers = [{
      title: 'Sr.',
      firstName: activeUser.firstName || '',
      lastName: activeUser.lastName || '',
      dob: activeUser.dataNascimento || '',
      email: activeUser.email || '',
      phone: activeUser.telefone || '',
      idNumber: '',
      passportNumber: '',
      nif: activeUser.nif || ''
    }];
    updateUserData(activeUser);
  } else {
    activeUser.passengers[0] = {
      ...activeUser.passengers[0],
      firstName: activeUser.firstName || '',
      lastName: activeUser.lastName || '',
      email: activeUser.email || '',
      phone: activeUser.telefone || '',
      dob: activeUser.dataNascimento || '',
      nif: activeUser.nif || ''
    };
    updateUserData(activeUser);
  }

  const renderPassengerTable = () => {
    const tableBody = document.getElementById('passenger-table-body');
    tableBody.innerHTML = '';
    activeUser.passengers.forEach((passenger, index) => {
      const row = document.createElement('div');
      row.className = 'passenger-table-row';
      row.dataset.index = index;
      row.innerHTML = `
        <span>${sanitizeHTML(passenger.title)}</span>
        <span>${sanitizeHTML(passenger.firstName)}</span>
        <span>${sanitizeHTML(passenger.lastName)}</span>
        <span>${formatDateToDDMMYYYY(passenger.dob)}</span>
        <span>${sanitizeHTML(passenger.email)}</span>
        <span class="actions">
          <button class="btn btn-primary edit-passenger" data-index="${index}" aria-label="Editar passageiro ${index + 1}">Editar</button>
          <button class="btn btn-danger remove-passenger" data-index="${index}" aria-label="${index === 0 ? 'Limpar dados do primeiro passageiro' : 'Remover passageiro'}">${index === 0 ? 'Limpar' : 'Remover'}</button>
        </span>
      `;
      tableBody.appendChild(row);
    });
  };
  renderPassengerTable();

  // Delegação de eventos para passageiros
  document.getElementById('passenger-table-body').addEventListener('click', (e) => {
    const index = parseInt(e.target.dataset.index);
    if (e.target.classList.contains('edit-passenger')) openEditModal(index);
    else if (e.target.classList.contains('remove-passenger')) removePassenger(index);
  });

  const createPassengerForm = (passenger, index) => {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', `modal-title-${index}`);
    modal.innerHTML = `
      <div class="modal-content">
        <button class="close-modal" aria-label="Fechar modal">×</button>
        <h3 id="modal-title-${index}">${index === -1 ? 'Adicionar Passageiro' : 'Editar Passageiro'}</h3>
        <form class="passenger-form" data-index="${index}">
          <div class="form-group">
            <label for="title-${index}">Título</label>
            <select id="title-${index}" name="title">
              <option value="Sr." ${passenger.title === 'Sr.' ? 'selected' : ''}>Sr.</option>
              <option value="Sra." ${passenger.title === 'Sra.' ? 'selected' : ''}>Sra.</option>
            </select>
          </div>
          <div class="form-group">
            <label for="firstName-${index}">Nome</label>
            <input type="text" id="firstName-${index}" name="firstName" value="${sanitizeHTML(passenger.firstName || '')}" required aria-describedby="firstName-${index}-error" />
            <span id="firstName-${index}-error" class="error-message" style="display: none;">Nome é obrigatório</span>
          </div>
          <div class="form-group">
            <label for="lastName-${index}">Apelido</label>
            <input type="text" id="lastName-${index}" name="lastName" value="${sanitizeHTML(passenger.lastName || '')}" required aria-describedby="lastName-${index}-error" />
            <span id="lastName-${index}-error" class="error-message" style="display: none;">Apelido é obrigatório</span>
          </div>
          <div class="form-group">
            <label for="dob-${index}">Data de Nascimento</label>
            <input type="text" id="dob-${index}" name="dob" value="${formatDateToDDMMYYYY(passenger.dob)}" placeholder="dd/mm/aaaa" aria-describedby="dob-${index}-error" />
            <span id="dob-${index}-error" class="error-message" style="display: none;">Data deve ser no passado</span>
          </div>
          <div class="form-group">
            <label for="email-${index}">Email</label>
            <input type="email" id="email-${index}" name="email" value="${sanitizeHTML(passenger.email || '')}" aria-describedby="email-${index}-error" />
            <span id="email-${index}-error" class="error-message" style="display: none;">Email inválido</span>
          </div>
          <div class="form-group">
            <label for="phone-${index}">Telefone (Opcional)</label>
            <input type="text" id="phone-${index}" name="phone" value="${sanitizeHTML(passenger.phone || '')}" />
          </div>
          <div class="form-group">
            <label for="idNumber-${index}">Número de B.I.</label>
            <input type="text" id="idNumber-${index}" name="idNumber" value="${sanitizeHTML(passenger.idNumber || '')}" pattern="[0-9]{8}" maxlength="8" aria-describedby="idNumber-${index}-error" />
            <span id="idNumber-${index}-error" class="error-message" style="display: none;">CC deve ter 8 dígitos</span>
          </div>
          <div class="form-group">
            <label for="passportNumber-${index}">Número de Passaporte</label>
            <input type="text" id="passportNumber-${index}" name="passportNumber" value="${sanitizeHTML(passenger.passaportNumber || '')}" pattern="[A-Z]{2}[0-9]{6}" maxlength="9" aria-describedby="passportNumber-${index}-error" />
            <span id="passportNumber-${index}-error" class="error-message" style="display: none;">Passaporte inválido (ex.: AB123456)</span>
          </div>
          <div class="form-group">
            <label for="nif-${index}">NIF</label>
            <input type="text" id="nif-${index}" name="nif" value="${sanitizeHTML(passenger.nif || '')}" pattern="[0-9]{9}" maxlength="9" aria-describedby="nif-${index}-error" />
            <span id="nif-${index}-error" class="error-message" style="display: none;">NIF deve ter 9 dígitos</span>
          </div>
          <div class="form-actions">
            ${index === -1 ? '<button type="button" class="btn btn-secondary fill-with-my-data">Preencher com Meus Dados</button>' : ''}
            <button type="submit" class="btn btn-primary">Guardar <span class="loading-spinner" style="display: none;"></span></button>
            <button type="button" class="btn btn-secondary cancel-passenger">Cancelar</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // Focus management for accessibility
    const focusableElements = modal.querySelectorAll('button, input, select');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    firstFocusable.focus();

    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') modal.remove();
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    });

    const nifInput = modal.querySelector(`#nif-${index}`);
    nifInput.addEventListener('input', () => {
      nifInput.value = nifInput.value.replace(/[^0-9]/g, '').substring(0, 9);
    });

    const dobInput = modal.querySelector(`#dob-${index}`);
    dobInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 2 && value.length <= 4) value = `${value.substring(0, 2)}/${value.substring(2)}`;
      else if (value.length > 4) value = `${value.substring(0, 2)}/${value.substring(2, 4)}/${value.substring(4, 8)}`;
      e.target.value = value.substring(0, 10);
    });

    modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
    modal.querySelector('.cancel-passenger').addEventListener('click', () => modal.remove());

    if (index === -1) {
      modal.querySelector('.fill-with-my-data').addEventListener('click', () => {
        modal.querySelector(`#firstName-${index}`).value = activeUser.firstName || '';
        modal.querySelector(`#lastName-${index}`).value = activeUser.lastName || '';
        modal.querySelector(`#email-${index}`).value = activeUser.email || '';
        modal.querySelector(`#phone-${index}`).value = activeUser.telefone || '';
        modal.querySelector(`#dob-${index}`).value = formatDateToDDMMYYYY(activeUser.dataNascimento) || '';
        modal.querySelector(`#nif-${index}`).value = activeUser.nif || '';
      });
    }

    modal.querySelector('.passenger-form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (!confirm('Deseja guardar as alterações do passageiro?')) return;

      const form = e.target;
      const errors = [];
      const firstName = form.querySelector('[name="firstName"]').value.trim();
      const lastName = form.querySelector('[name="lastName"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const dob = form.querySelector('[name="dob"]').value.trim();
      const idNumber = form.querySelector('[name="idNumber"]').value.trim();
      const passportNumber = form.querySelector('[name="passportNumber"]').value.trim();
      const nif = form.querySelector('[name="nif"]').value.trim();

      if (!firstName) errors.push({ field: 'firstName', message: 'Nome é obrigatório' });
      if (!lastName) errors.push({ field: 'lastName', message: 'Apelido é obrigatório' });
      if (email && !form.querySelector('[name="email"]').checkValidity()) {
        errors.push({ field: 'email', message: 'Email inválido' });
      }
      if (dob && !/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) {
        errors.push({ field: 'dob', message: 'Formato: dd/mm/aaaa' });
      } else if (dob) {
        const parsedDate = new Date(parseDateFromDDMMYYYY(dob));
        if (parsedDate >= new Date()) {
          errors.push({ field: 'dob', message: 'Data deve ser no passado' });
        }
      }
      if (idNumber && !/^[0-9]{8}$/.test(idNumber)) {
        errors.push({ field: 'idNumber', message: 'CC deve ter 8 dígitos' });
      }
      if (passportNumber && !/^[A-Z]{2}[0-9]{6}$/.test(passportNumber)) {
        errors.push({ field: 'passportNumber', message: 'Passaporte inválido (ex.: AB123456)' });
      }
      if (nif && !/^[0-9]{9}$/.test(nif)) {
        errors.push({ field: 'nif', message: 'NIF deve ter 9 dígitos' });
      }

      clearErrorMessages(form);
      if (errors.length > 0) {
        errors.forEach(error => {
          const errorMessage = form.querySelector(`[name="${error.field}"]`).nextElementSibling;
          errorMessage.textContent = error.message;
          errorMessage.style.display = 'block';
        });
        return;
      }

      const passengerData = {
        title: form.querySelector('[name="title"]').value,
        firstName,
        lastName,
        dob: parseDateFromDDMMYYYY(dob),
        email,
        phone: form.querySelector('[name="phone"]').value.trim(),
        idNumber,
        passportNumber,
        nif
      };

      const submitButton = form.querySelector('.btn-primary');
      const spinner = submitButton.querySelector('.loading-spinner');
      spinner.style.display = 'inline-block';
      submitButton.disabled = true;

      setTimeout(() => {
        const formIndex = parseInt(form.dataset.index);
        if (formIndex === -1) {
          activeUser.passengers.push(passengerData);
        } else {
          activeUser.passengers[formIndex] = passengerData;
          if (formIndex === 0) {
            activeUser.firstName = passengerData.firstName;
            activeUser.lastName = passengerData.lastName;
            activeUser.email = passengerData.email;
            activeUser.telefone = passengerData.phone;
            activeUser.dataNascimento = passengerData.dob;
            activeUser.nif = passengerData.nif;
            loadPersonalData();
          }
        }
        updateUserData(activeUser);
        showMessage(formIndex === -1 ? 'Passageiro adicionado com sucesso!' : 'Passageiro atualizado com sucesso!');
        modal.remove();
        renderPassengerTable();
        spinner.style.display = 'none';
        submitButton.disabled = false;
      }, 500);
    });
  };

  const openEditModal = (index) => createPassengerForm(activeUser.passengers[index], index);

  const removePassenger = (index) => {
    if (index === 0) {
      if (confirm('Deseja limpar os dados do primeiro passageiro?')) {
        activeUser.passengers[0] = {
          title: 'Sr.',
          firstName: activeUser.firstName || '',
          lastName: activeUser.lastName || '',
          dob: activeUser.dataNascimento || '',
          email: activeUser.email || '',
          phone: activeUser.telefone || '',
          idNumber: '',
          passportNumber: '',
          nif: activeUser.nif || ''
        };
        showMessage('Dados do primeiro passageiro limpos!');
      }
    } else if (confirm('Deseja remover este passageiro?')) {
      activeUser.passengers.splice(index, 1);
      showMessage('Passageiro removido com sucesso!');
    }
    updateUserData(activeUser);
    renderPassengerTable();
  };

  document.querySelector('[data-action="add-passenger"]').addEventListener('click', () => {
    createPassengerForm({
      title: '',
      firstName: '',
      lastName: '',
      dob: '',
      email: '',
      phone: '',
      idNumber: '',
      passportNumber: '',
      nif: ''
    }, -1);
  });

  // Event listener for personal data form cancel button
  personalDataForm.querySelector('.btn-secondary').addEventListener('click', () => {
    loadPersonalData();
    showMessage('Alterações canceladas. Dados originais restaurados.');
  });

  // Event listener for billing form cancel button
  billingForm.querySelector('.btn-secondary').addEventListener('click', () => {
    loadBillingData();
    showMessage('Alterações canceladas. Dados de faturação restaurados.');
  });

  personalDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!confirm('Deseja guardar as alterações dos dados pessoais?')) return;

    const errors = [];
    const firstName = document.getElementById('nome').value.trim();
    const lastName = document.getElementById('apelido').value.trim();
    const email = document.getElementById('email').value.trim();
    const dataNascimento = document.getElementById('data-nascimento').value;
    const codigoPostal = document.getElementById('codigo-postal').value.trim();
    const nif = document.getElementById('nif').value.trim();
    const cc = document.getElementById('cc').value.trim();
    const passaporte = document.getElementById('passaporte').value.trim();
    const currentPassword = document.getElementById('current-password').value.trim();
    const newPassword = document.getElementById('new-password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    // Verificar email duplicado
    const users = getUsers();
    if (users.some(u => u.email === email && u.email !== activeUser.email)) {
      errors.push({ field: 'email', message: 'Este email já está registado' });
    }

    if (!firstName) errors.push({ field: 'nome', message: 'Nome é obrigatório' });
    if (!lastName) errors.push({ field: 'apelido', message: 'Apelido é obrigatório' });
    if (!email) errors.push({ field: 'email', message: 'Email é obrigatório' });
    else if (!personalDataForm.querySelector('#email').checkValidity()) {
      errors.push({ field: 'email', message: 'Email inválido' });
    }
    if (dataNascimento && new Date(dataNascimento) >= new Date()) {
      errors.push({ field: 'data-nascimento', message: 'Data deve ser no passado' });
    }
    if (codigoPostal && !/^\d{4}-\d{3}$/.test(codigoPostal)) {
      errors.push({ field: 'codigo-postal', message: 'Formato: 3300-123' });
    }
    if (nif && !/^[0-9]{9}$/.test(nif)) {
      errors.push({ field: 'nif', message: 'NIF deve ter 9 dígitos' });
    }
    if (cc && !/^[0-9]{8}$/.test(cc)) {
      errors.push({ field: 'cc', message: 'CC deve ter 8 dígitos' });
    }
    if (passaporte && !/^[A-Z]{2}[0-9]{6}$/.test(passaporte)) {
      errors.push({ field: 'passaporte', message: 'Passaporte inválido (ex.: AB123456)' });
    }
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) {
        errors.push({ field: 'current-password', message: 'Palavra-passe atual é obrigatória para alteração' });
      } else if (currentPassword !== activeUser.password) {
        errors.push({ field: 'current-password', message: 'Palavra-passe incorreta' });
      }
      if (newPassword && newPassword.length < 6) {
        errors.push({ field: 'new-password', message: 'Mínimo 6 caracteres' });
      }
      if (newPassword && newPassword !== confirmPassword) {
        errors.push({ field: 'confirm-password', message: 'Palavras-passe não coincidem' });
      }
    }

    clearErrorMessages(personalDataForm);
    if (errors.length > 0) {
      errors.forEach(error => {
        const errorMessage = personalDataForm.querySelector(`#${error.field}`).nextElementSibling;
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
      });
      return;
    }

    const data = {
      firstName,
      lastName,
      email,
      dataNascimento,
      telefone: document.getElementById('telefone').value.trim(),
      morada: document.getElementById('morada').value.trim(),
      codigoPostal,
      localidade: document.getElementById('localidade').value.trim(),
      nif,
      cc,
      passaporte,
      password: newPassword || activeUser.password,
      reservations: activeUser.reservations,
      favorites: activeUser.favorites,
      passengers: activeUser.passengers,
      nomeFaturacao: activeUser.nomeFaturacao,
      emailFaturacao: activeUser.emailFaturacao,
      telefoneFaturacao: activeUser.telefoneFaturacao,
      moradaFaturacao: activeUser.moradaFaturacao,
      codigoPostalFaturacao: activeUser.codigoPostalFaturacao,
      localidadeFaturacao: activeUser.localidadeFaturacao,
      nifFaturacao: activeUser.nifFaturacao
    };

    const submitButton = personalDataForm.querySelector('.btn-primary');
    const spinner = submitButton.querySelector('.loading-spinner');
    spinner.style.display = 'inline-block';
    submitButton.disabled = true;

    setTimeout(() => {
      if (activeUser.passengers.length) {
        activeUser.passengers[0] = {
          ...activeUser.passengers[0],
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.telefone,
          dob: data.dataNascimento,
          nif: data.nif
        };
      }
      updateUserData(data);
      showMessage('Dados pessoais guardados com sucesso!');
      loadPersonalData();
      renderPassengerTable();
      spinner.style.display = 'none';
      submitButton.disabled = false;
    }, 500);
  });

  billingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!confirm('Deseja guardar os dados de faturação?')) return;

    const errors = [];
    const nomeFaturacao = document.getElementById('nome-faturacao').value.trim();
    const emailFaturacao = document.getElementById('email-faturacao').value.trim();
    const moradaFaturacao = document.getElementById('morada-faturacao').value.trim();
    const codigoPostalFaturacao = document.getElementById('codigo-postal-faturacao').value.trim();
    const localidadeFaturacao = document.getElementById('localidade-faturacao').value.trim();
    const nifFaturacao = document.getElementById('nif-faturacao').value.trim();

    if (!nomeFaturacao) errors.push({ field: 'nome-faturacao', message: 'Nome é obrigatório' });
    if (!emailFaturacao) errors.push({ field: 'email-faturacao', message: 'Email é obrigatório' });
    else if (!billingForm.querySelector('#email-faturacao').checkValidity()) {
      errors.push({ field: 'email-faturacao', message: 'Email inválido' });
    }
    if (codigoPostalFaturacao && !/^\d{4}-\d{3}$/.test(codigoPostalFaturacao)) {
      errors.push({ field: 'codigo-postal-faturacao', message: 'Formato: 3300-123' });
    }
    if (nifFaturacao && !/^[0-9]{9}$/.test(nifFaturacao)) {
      errors.push({ field: 'nif-faturacao', message: 'NIF deve ter 9 dígitos' });
    }

    clearErrorMessages(billingForm);
    if (errors.length > 0) {
      errors.forEach(error => {
        const errorMessage = billingForm.querySelector(`#${error.field}`).nextElementSibling;
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
      });
      return;
    }

    const data = {
      nomeFaturacao,
      emailFaturacao,
      telefoneFaturacao: document.getElementById('telefone-faturacao').value.trim(),
      moradaFaturacao,
      codigoPostalFaturacao,
      localidadeFaturacao,
      nifFaturacao,
      firstName: activeUser.firstName,
      lastName: activeUser.lastName,
      email: activeUser.email,
      dataNascimento: activeUser.dataNascimento,
      telefone: activeUser.telefone,
      morada: activeUser.morada,
      codigoPostal: activeUser.codigoPostal,
      localidade: activeUser.localidade,
      nif: activeUser.nif,
      cc: activeUser.cc,
      passaporte: activeUser.passaporte,
      password: activeUser.password,
      reservations: activeUser.reservations,
      favorites: activeUser.favorites,
      passengers: activeUser.passengers
    };

    const submitButton = billingForm.querySelector('.btn-primary');
    const spinner = submitButton.querySelector('.loading-spinner');
    spinner.style.display = 'inline-block';
    submitButton.disabled = true;

    setTimeout(() => {
      updateUserData(data);
      showMessage('Dados de faturação guardados com sucesso!');
      loadBillingData();
      spinner.style.display = 'none';
      submitButton.disabled = false;
    }, 500);
  });

  document.querySelectorAll('.tab-link').forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.tab-link').forEach(t => {
        t.classList.remove('active');
        t.removeAttribute('aria-current');
      });
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-current', 'page');
      const targetPane = document.getElementById(tab.getAttribute('data-tab'));
      if (targetPane) {
        targetPane.classList.add('active');
      }
      if (tab.getAttribute('data-tab') === 'favorites') {
        loadTripsAndFavorites();
      }
    });
  });

  document.querySelectorAll('.group-title:not(.no-collapse)').forEach(title => {
    title.addEventListener('click', () => {
      const content = title.nextElementSibling;
      const isOpen = content.classList.contains('open');
      content.classList.toggle('open');
      title.classList.toggle('open');
    });
  });

  document.querySelector('.sidebar-header').addEventListener('click', () => {
    document.querySelector('.sidebar-nav').classList.add('active');
  });

  document.querySelector('[data-action="logout"]').addEventListener('click', () => {
    if (confirm('Deseja sair da conta?')) {
      sessionStorage.removeItem('activeUser');
      showMessage('Sessão terminada! Redirecionando...');
      setTimeout(() => window.location.replace('login.html'), 1000);
    }
  });
});

const showCustomConfirm = (title, message, onConfirm) => {
  const dialog = document.createElement('div');
  dialog.className = 'custom-confirm';
  dialog.innerHTML = `
    <div class="confirm-content">
      <h3>${title}</h3>
      <p>${message}</p>
      <div class="confirm-buttons">
        <button class="confirm-yes">Sim</button>
        <button class="confirm-no">Não</button>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);

  // Add active class after a small delay to trigger animation
  setTimeout(() => dialog.classList.add('active'), 10);

  const closeDialog = (result) => {
    dialog.classList.remove('active');
    setTimeout(() => {
      dialog.remove();
      if (result && onConfirm) {
        onConfirm();
      }
    }, 300);
  };

  dialog.querySelector('.confirm-yes').addEventListener('click', () => closeDialog(true));
  dialog.querySelector('.confirm-no').addEventListener('click', () => closeDialog(false));

  // Adicionar listener para fechar com ESC
  document.addEventListener('keydown', function closeOnEsc(e) {
    if (e.key === 'Escape') {
      document.removeEventListener('keydown', closeOnEsc);
      closeDialog(false);
    }
  });
};