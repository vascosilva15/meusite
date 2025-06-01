document.addEventListener("DOMContentLoaded", () => {
  // Lista de aeroportos para as abas "Voos" e "Voo+Hotel"
  const airports = [
    { name: 'Lisboa', code: 'LIS', city: 'Portugal' },
    { name: 'Adolfo Suárez Madrid-Barajas', code: 'MAD', city: 'Espanha' },
    { name: 'Porto', code: 'OPO', city: 'Portugal' },
    { name: 'Paris', code: 'CDG', city: 'França' },
    { name: 'Londres', code: 'LHR', city: 'Reino Unido' },
    { name: 'Berlim', code: 'BER', city: 'Alemanha' },
    { name: 'Nova Iorque', code: 'JFK', city: 'EUA' },
    { name: 'Tóquio', code: 'NRT', city: 'Japão' },
    { name: 'Faro', code: 'FAO', city: 'Portugal' },
    { name: 'Barcelona', code: 'BCN', city: 'Espanha' }
  ];

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

  // Função para remover acentos de uma string
  function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

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
            let otherInput;
            if (input.id === 'origem') otherInput = document.getElementById('destino');
            else if (input.id === 'destino') otherInput = document.getElementById('origem');
            else if (input.id === 'partida') otherInput = document.getElementById('destino-vh');
            else if (input.id === 'destino-vh') otherInput = document.getElementById('partida');
            if (otherInput && otherInput.value.toLowerCase() === input.value.toLowerCase()) {
              otherInput.value = '';
            }
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

  // Definir data mínima para todos os campos de data
  const today = new Date();
  document.querySelectorAll('input[type="date"]').forEach(field => {
    field.min = today.toISOString().split('T')[0];
  });

  // Validação dinâmica de datas (ida / volta) para todas as abas
  const mappings = [
    { dep: 'data-ida', ret: 'data-volta', form: 'voo-form' },
    { dep: 'partida-vh', ret: 'volta-vh', form: 'voo-hotel-form' },
    { dep: 'checkin', ret: 'checkout', form: 'hotel-form' }
  ];

  mappings.forEach(({ dep, ret, form: formId }) => {
    const departure = document.getElementById(dep);
    const returnInput = document.getElementById(ret);
    const form = document.getElementById(formId);
    if (!departure || !returnInput || !form) return;

    function checkDates() {
      returnInput.setCustomValidity('');
      if (departure.value && returnInput.value) {
        const depDate = new Date(departure.value);
        const retDate = new Date(returnInput.value);
        if (retDate < depDate) {
          const customMsg = formId === 'hotel-form'
            ? 'A data de check-out não pode ser anterior à data de check-in.'
            : 'A data de volta não pode ser anterior à data de ida.';
          returnInput.setCustomValidity(customMsg);
        }
      }
    }

    // Validação ao mudar as datas
    departure.addEventListener('change', () => {
      checkDates();
      departure.reportValidity();
    });
    returnInput.addEventListener('change', () => {
      checkDates();
      returnInput.reportValidity();
    });

    // Validação no submit
    form.addEventListener('submit', (e) => {
      checkDates();
      if (!form.checkValidity()) {
        e.preventDefault();
        form.reportValidity();
      }
    });
  });

  // Troca de abas na área de pesquisa
  const tabButtons = document.querySelectorAll(".tabs .tab");
  const forms = document.querySelectorAll(".tab-content .form");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      forms.forEach((f) => {
        f.classList.remove("active");
        f.style.display = "none";
      });

      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      const formId = btn.getAttribute("data-tab");
      const selectedForm = document.getElementById(formId);
      if (selectedForm) {
        selectedForm.classList.add("active");
        selectedForm.style.display = "flex";
      } else {
        console.error(`Formulário com ID ${formId} não encontrado.`);
      }
    });
  });

  // Submissão da newsletter com feedback
  const newsletterForm = document.getElementById("form-newsletter");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("newsletter-email");
      if (email) {
        alert("Obrigado por subscrever! Verifique o seu email: " + email.value);
        newsletterForm.reset();
      } else {
        console.error("Campo de email da newsletter não encontrado.");
      }
    });
  }

  // Configuração unificada dos dropdowns para todas as abas
  const formsConfig = [
    {
      prefix: "voo",
      buttonId: "dropdownBtn",
      menuId: "dropdownContent",
      confirmId: "confirmBtn",
      adultosId: "adultosCount",
      criancasId: "criancasCount",
      bebesId: "bebesCount",
      quartosId: null,
      childAgeInputsId: null,
      childAgesSectionId: null,
      passengerNoteId: "passenger-note",
    },
    {
      prefix: "hotel",
      buttonId: "hotel-dropdownBtn",
      menuId: "hotel-dropdownContent",
      confirmId: "hotel-confirmBtn",
      adultosId: "hotel-adultosCount",
      criancasId: "hotel-criancasCount",
      bebesId: null,
      quartosId: "hotel-quartosCount",
      childAgeInputsId: "hotel-childAgeInputs",
      childAgesSectionId: "hotel-childAges",
      passengerNoteId: null,
    },
    {
      prefix: "vh",
      buttonId: "vh-dropdownBtn",
      menuId: "vh-dropdownContent",
      confirmId: "vh-confirmBtn",
      adultosId: "vh-adultosCount",
      criancasId: "vh-criancasCount",
      bebesId: "vh-bebesCount",
      quartosId: null,
      childAgeInputsId: null,
      childAgesSectionId: null,
      passengerNoteId: "vh-passenger-note",
    },
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
      if (!childAgeInputs || !childAgesSection || config.prefix !== "hotel") return;

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
          
          // Add event listener for age changes
          const select = div.querySelector('select');
          select.addEventListener('change', () => {
            const childAges = Array.from(document.querySelectorAll(`#${config.menuId} .child-age`))
              .map(s => parseInt(s.value) || 0);
            
            let effectiveAdults = countMap.adultos;
            let effectiveChildren = 0;
            childAges.forEach((age) => {
              if (age > 12) effectiveAdults++;
              else effectiveChildren++;
            });

            const recommendedRoomsForAdults = Math.ceil(effectiveAdults / 2);
            const requiredRoomsForChildren = effectiveChildren;
            const minimumRequiredRooms = Math.max(recommendedRoomsForAdults, requiredRoomsForChildren || 0);

            if (countMap.quartos < minimumRequiredRooms) {
              countMap.quartos = minimumRequiredRooms;
              if (quartosCount) quartosCount.textContent = minimumRequiredRooms;
              alert(`O número de quartos foi ajustado para ${minimumRequiredRooms} devido à idade da criança (crianças acima de 12 anos requerem um quarto adicional).`);
              updateButtonText();
            }
            updateButtonStates();
          });
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
          // Get the number of children under 12
          const childAges = Array.from(document.querySelectorAll(`#${config.menuId} .child-age`))
            .map(select => parseInt(select.value) || 0)
            .filter(age => age <= 12);
          const childrenUnder12 = childAges.length;
          btn.disabled = childrenUnder12 >= countMap.quartos;
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
            alert("Cada quarto pode ter no máximo 1 criança até 12 anos. Adicione um quarto para mais crianças.");
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
        const requiredRoomsForChildren = effectiveChildren;
        const minimumRequiredRooms = Math.max(recommendedRoomsForAdults, requiredRoomsForChildren || 0);

        if (quartos < minimumRequiredRooms) {
          quartos = minimumRequiredRooms;
          countMap.quartos = quartos;
          if (quartosCount) quartosCount.textContent = quartos;
          if (effectiveChildren > 0 && quartos < effectiveChildren + 1) {
            alert(`O número de quartos foi ajustado para ${quartos} para acomodar ${adultos} adulto${adultos > 1 ? "s" : ""} e ${criancas} criança${criancas > 1 ? "s" : ""} (máximo 1 criança até 12 anos por quarto).`);
          } else {
            alert(`O número de quartos foi ajustado para ${quartos} para acomodar ${adultos} adulto${adultos > 1 ? "s" : ""} e ${criancas} criança${criancas > 1 ? "s" : ""} (recomendado máximo de 2 adultos e 1 criança até 12 anos por quarto).`);
          }
        }
        if (quartos > minimumRequiredRooms && (effectiveAdults > 0 || effectiveChildren > 0)) {
          alert(`Selecionou ${quartos} quarto${quartos > 1 ? "s" : ""}, mas a ocupação (${adultos} adulto${adultos > 1 ? "s" : ""} e ${criancas} criança${criancas > 1 ? "s" : ""}) pode ser acomodada em ${minimumRequiredRooms} quarto${minimumRequiredRooms > 1 ? "s" : ""}. Pode ajustar se desejar.`);
        }

        updateButtonStates();
      } else if (config.prefix === "vh" || config.prefix === "voo") {
        const adultos = countMap.adultos;
        const criancas = countMap.criancas;
        const bebes = countMap.bebes || 0;

        if (adultos === 0 && criancas === 0 && bebes === 0) {
          countMap.adultos = 1;
          if (adultosCount) adultosCount.textContent = "1";
        }
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

  // Adicionar validação de formulário ao enviar
  document.querySelectorAll("form").forEach(form => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let departureInput, returnInput, errorContainer;

      if (form.id === "voo-form") {
        const origem = document.getElementById("origem")?.value;
        const destino = document.getElementById("destino")?.value;
        
        // Obter elementos de data
        const dataIdaInput = document.getElementById("data-ida");
        const dataVoltaInput = document.getElementById("data-volta");
        
        // Formatar datas para YYYY-MM-DD
        const formatDate = (input) => {
          if (!input || !input.value) return '';
          const date = new Date(input.value);
          if (isNaN(date.getTime())) return '';
          return date.toISOString().split('T')[0];
        };

        const dataIda = formatDate(dataIdaInput);
        const dataVolta = formatDate(dataVoltaInput);
        
        const adultos = document.getElementById("adultosCount")?.textContent || "1";
        const criancas = document.getElementById("criancasCount")?.textContent || "0";
        const bebes = document.getElementById("bebesCount")?.textContent || "0";

        console.log('Datas formatadas:', { dataIda, dataVolta });

        // Criar URL com parâmetros
        const params = new URLSearchParams({
          origem,
          destino,
          dataIda,
          dataVolta,
          adultos,
          criancas,
          bebes
        });

        // Redirecionar para a página de voos
        window.location.href = `voos.html?${params.toString()}`;
        return;
      } else if (form.id === "voo-hotel-form") {
        const origem = document.getElementById("partida")?.value;
        const destino = document.getElementById("destino-vh")?.value;
        
        // Obter elementos de data
        const dataIdaInput = document.getElementById("partida-vh");
        const dataVoltaInput = document.getElementById("volta-vh");
        
        // Formatar datas para YYYY-MM-DD
        const formatDate = (input) => {
          if (!input || !input.value) return '';
          const date = new Date(input.value);
          if (isNaN(date.getTime())) return '';
          return date.toISOString().split('T')[0];
        };

        const dataIda = formatDate(dataIdaInput);
        const dataVolta = formatDate(dataVoltaInput);
        
        const adultos = document.getElementById("vh-adultosCount")?.textContent || "1";
        const criancas = document.getElementById("vh-criancasCount")?.textContent || "0";
        const bebes = document.getElementById("vh-bebesCount")?.textContent || "0";

        // Criar URL com parâmetros
        const params = new URLSearchParams({
          origin: origem,
          destination: destino,
          'departure-date': dataIda,
          'return-date': dataVolta,
          adultos,
          criancas,
          bebes
        });

        // Redirecionar para a página de pacotes
        window.location.href = `pacotes.html?${params.toString()}`;
        return;
      } else if (form.id === "hotel-form") {
        departureInput = document.getElementById("hotel-ida");
        returnInput = document.getElementById("hotel-volta");
        errorContainer = document.getElementById("hotel-error-messages") || document.createElement("div");
        errorContainer.id = "hotel-error-messages";
        form.appendChild(errorContainer);
      }

      if (departureInput && returnInput && !validateDates(departureInput, returnInput, errorContainer)) {
        return; // Impede a submissão se as datas forem inválidas
      }

      const dropdown = form.querySelector(".dropdown");
      if (!dropdown) return;

      const prefix = form.id === "voo-form" ? "voo" : form.id === "voo-hotel-form" ? "vh" : "hotel";
      const adultosId = prefix === "hotel" ? "hotel-adultosCount" : prefix === "vh" ? "vh-adultosCount" : "adultosCount";
      const criancasId = prefix === "hotel" ? "hotel-criancasCount" : prefix === "vh" ? "vh-criancasCount" : "criancasCount";
      const bebesId = prefix === "hotel" ? null : prefix === "vh" ? "vh-bebesCount" : "bebesCount";

      const adultos = dropdown.querySelector(`#${adultosId}`)?.textContent || "1";
      const criancas = dropdown.querySelector(`#${criancasId}`)?.textContent || "0";
      const bebes = bebesId ? dropdown.querySelector(`#${bebesId}`)?.textContent || "0" : "0";

      const createHidden = (name, value) => {
        let input = form.querySelector(`input[name="${name}"]`);
        if (!input) {
          input = document.createElement("input");
          input.type = "hidden";
          input.name = name;
          form.appendChild(input);
        }
        input.value = value;
      };

      createHidden("adultos", adultos);
      createHidden("criancas", criancas);
      createHidden("bebes", bebes);
      form.submit();
    });
  });

  // Aplicar autocompletar para todos os campos
  const originInput = document.getElementById("origem");
  const destinationInput = document.getElementById("destino");
  const vhOriginInput = document.getElementById("partida");
  const vhDestinationInput = document.getElementById("destino-vh");
  const hotelDestinationInput = document.getElementById("hotel-destino");

  if (originInput) {
    autocomplete(originInput, airports);
  } else {
    console.error("Campo 'origem' não encontrado para a aba Voos.");
  }

  if (destinationInput) {
    autocomplete(destinationInput, airports);
  } else {
    console.error("Campo 'destino' não encontrado para a aba Voos.");
  }

  if (vhOriginInput) {
    autocomplete(vhOriginInput, airports);
  } else {
    console.error("Campo 'partida' não encontrado para a aba Voo+Hotel.");
  }

  if (vhDestinationInput) {
    autocomplete(vhDestinationInput, airports);
  } else {
    console.error("Campo 'destino-vh' não encontrado para a aba Voo+Hotel.");
  }

  if (hotelDestinationInput) {
    autocomplete(hotelDestinationInput, hotelDestinations);
  } else {
    console.error("Campo 'hotel-destino' não encontrado para a aba Hotéis.");
  }
});
