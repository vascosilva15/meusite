document.addEventListener("DOMContentLoaded", () => {
  const feedbackForm = document.getElementById("feedback-form");
  const feedbackMessage = document.getElementById("feedback-message");
  const feedbacksContainer = document.getElementById("feedbacks-container");
  const activeUser = JSON.parse(sessionStorage.getItem("activeUser"));

  // Feedbacks iniciais (como base)
  const initialFeedbacks = [
    { id: 1, firstName: "Tiago", lastName: "Silva", comment: "A organização foi impecável! Tudo correu como planeado.", rating: 5, destination: "Barcelona", date: new Date().toISOString() },
    { id: 2, firstName: "Sara", lastName: "Ferreira", comment: "Adorei o destino sugerido, foi uma experiência incrível!", rating: 5, destination: "Roma", date: new Date().toISOString() },
    { id: 3, firstName: "David", lastName: "Costa", comment: "Equipa super profissional e simpática. Recomendo!", rating: 5, destination: "Berlim", date: new Date().toISOString() },
    { id: 4, firstName: "Mariana", lastName: "Santos", comment: "Fui ao Brasil com tudo tratado. Que viagem inesquecível!", rating: 5, destination: "Rio de Janeiro", date: new Date().toISOString() },
    { id: 5, firstName: "Ricardo", lastName: "Almeida", comment: "Gostei da facilidade em reservar e das sugestões dadas.", rating: 5, destination: "Paris", date: new Date().toISOString() },
    { id: 6, firstName: "Inês", lastName: "Pereira", comment: "Viagem de sonho com um preço acessível. Obrigada!", rating: 5, destination: "Madrid", date: new Date().toISOString() },
    { id: 7, firstName: "João", lastName: "Mendes", comment: "A assistência durante a viagem foi essencial. Excelente apoio!", rating: 5, destination: "Tóquio", date: new Date().toISOString() },
    { id: 8, firstName: "Ana", lastName: "Rodrigues", comment: "Senti-me segura e bem acompanhada em todo o processo.", rating: 5, destination: "Nova Iorque", date: new Date().toISOString() },
    { id: 9, firstName: "Luís", lastName: "Oliveira", comment: "Muito profissionais. Já marquei a próxima viagem com eles!", rating: 5, destination: "Milão", date: new Date().toISOString() },
    { id: 10, firstName: "Beatriz", lastName: "Lopes", comment: "Tudo organizado ao detalhe. Só tive de aproveitar!", rating: 5, destination: "Londres", date: new Date().toISOString() },
    { id: 11, firstName: "Pedro", lastName: "Martins", comment: "Muito mais barato do que noutras agências. Excelente escolha.", rating: 5, destination: "Amesterdão", date: new Date().toISOString() },
    { id: 12, firstName: "Filipa", lastName: "Sousa", comment: "Tudo correu de forma perfeita do início ao fim.", rating: 5, destination: "Dubai", date: new Date().toISOString() }
  ];

  // Garantir que os feedbacks iniciais existam no localStorage
  let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
  if (feedbacks.length === 0) {
    feedbacks = initialFeedbacks;
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
  } else {
    const initialIds = initialFeedbacks.map(f => f.id);
    const hasInitialFeedbacks = initialFeedbacks.every(initial =>
      feedbacks.some(f => f.id === initial.id)
    );
    if (!hasInitialFeedbacks) {
      initialFeedbacks.forEach(initial => {
        if (!feedbacks.some(f => f.id === initial.id)) {
          feedbacks.push(initial);
        }
      });
      localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
    }
  }

  // Log para depuração
  console.log("Feedbacks carregados do localStorage:", feedbacks);

  // Função para mostrar mensagens
  const showMessage = (message, type = "error") => {
    feedbackMessage.textContent = message;
    feedbackMessage.className = `form-message ${type === "error" ? "error-message" : "success-message"}`;
    feedbackMessage.style.display = "block";
    setTimeout(() => {
      feedbackMessage.style.display = "none";
    }, 3000);
  };

  // Função para renderizar feedbacks
  const renderFeedbacks = () => {
    feedbacksContainer.innerHTML = ""; // Limpar feedbacks existentes

    feedbacks.forEach(feedback => {
      const feedbackCard = document.createElement("div");
      feedbackCard.className = "feedback-card";
      feedbackCard.innerHTML = `
        <p>"${feedback.comment}"</p>
        <div class="stars visual-stars">${'<i class="fa-solid fa-star"></i>'.repeat(feedback.rating)}</div>
        <h3>${feedback.firstName} ${feedback.lastName}</h3>
        <h4 class="destination">${feedback.destination}</h4>
      `;
      console.log(`Renderizando feedback: ${feedback.firstName} ${feedback.lastName}, Rating: ${feedback.rating}`);
      feedbacksContainer.appendChild(feedbackCard);
    });
  };

  // Verificar autenticação e configurar o formulário
  if (!activeUser) {
    feedbackForm.style.display = "none";
    feedbackMessage.textContent = "Por favor, faça login para deixar um feedback.";
    feedbackMessage.className = "form-message error-message";
    feedbackMessage.style.display = "block";
  } else {
    // Preencher os campos de nome
    const firstNameInput = document.createElement("div");
    firstNameInput.className = "form-group";
    firstNameInput.innerHTML = `
      <label for="feedback-first-name">Primeiro Nome:</label>
      <input type="text" id="feedback-first-name" name="first-name" value="${activeUser.firstName}" readonly />
    `;
    feedbackForm.insertBefore(firstNameInput, feedbackForm.querySelector(".form-group"));

    const lastNameInput = document.createElement("div");
    lastNameInput.className = "form-group";
    lastNameInput.innerHTML = `
      <label for="feedback-last-name">Último Nome:</label>
      <input type="text" id="feedback-last-name" name="last-name" value="${activeUser.lastName}" readonly />
    `;
    feedbackForm.insertBefore(lastNameInput, feedbackForm.querySelector(".form-group"));

    // Manipular submissão do formulário
    feedbackForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const comment = document.getElementById("feedback-comment").value.trim();
      const rating = document.querySelector("input[name='rating']:checked")?.value;
      const destination = document.getElementById("feedback-destination").value;

      // Depuração do rating
      console.log("Rating selecionado:", rating);

      if (!comment || !rating || !destination) {
        showMessage("Por favor, preencha todos os campos.");
        return;
      }

      // Criar objeto de feedback
      const feedback = {
        id: Date.now(),
        firstName: activeUser.firstName,
        lastName: activeUser.lastName,
        comment,
        rating: parseInt(rating), // Converter para número
        destination,
        date: new Date().toISOString()
      };

      // Depuração do feedback salvo
      console.log("Feedback salvo:", feedback);

      // Salvar no localStorage, mantendo os feedbacks iniciais
      feedbacks.push(feedback);
      localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

      // Limpar formulário
      feedbackForm.reset();

      // Mostrar mensagem de sucesso
      showMessage("Feedback submetido com sucesso!", "success");

      // Atualizar a lista de feedbacks
      renderFeedbacks();
    });
  }

  // Renderizar feedbacks ao carregar a página
  renderFeedbacks();
});