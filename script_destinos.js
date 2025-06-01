function filtrarDestinos() {
  const selectedRegion = document.getElementById("region").value;
  const selectedType = document.getElementById("type").value;
  const selectedBudget = document.getElementById("budget").value;

  const cards = document.querySelectorAll("#destinations .card");

  cards.forEach(card => {
    const region = card.getAttribute("data-region");
    const type = card.getAttribute("data-type");
    const price = parseInt(card.getAttribute("data-price"), 10);

    let match = true;

    if (selectedRegion && selectedRegion !== region) match = false;
    if (selectedType && selectedType !== type) match = false;

    if (selectedBudget === "budget" && price > 300) match = false;
    else if (selectedBudget === "mid" && (price <= 300 || price > 600)) match = false;
    else if (selectedBudget === "luxury" && price <= 600) match = false;

    card.style.display = match ? "flex" : "none";
  });
}

// Função para mostrar alerta personalizado
function showCustomAlert(message) {
  // Remover alertas existentes
  const existingAlerts = document.querySelectorAll('.custom-alert');
  existingAlerts.forEach(alert => alert.remove());

  // Criar novo alerta
  const alert = document.createElement('div');
  alert.className = 'custom-alert';
  alert.innerHTML = `
    <i class="fas fa-info-circle"></i>
    <span class="message">${message}</span>
    <button class="close-btn" aria-label="Fechar">
      <i class="fas fa-times"></i>
    </button>
  `;

  // Adicionar ao corpo do documento
  document.body.appendChild(alert);

  // Mostrar o alerta com animação
  setTimeout(() => alert.classList.add('show'), 10);

  // Configurar o botão de fechar
  const closeBtn = alert.querySelector('.close-btn');
  closeBtn.addEventListener('click', () => {
    alert.classList.remove('show');
    setTimeout(() => alert.remove(), 300);
  });

  // Remover automaticamente após 5 segundos
  setTimeout(() => {
    alert.classList.remove('show');
    setTimeout(() => alert.remove(), 300);
  }, 5000);
}

// Função para redirecionar para a página de pacotes com o destino selecionado
function redirecionarParaPacote(destino) {
  const params = new URLSearchParams({
    destination: destino
  });
  window.location.href = `pacotes.html?${params.toString()}`;
}

// Adicionar event listeners aos botões
document.addEventListener('DOMContentLoaded', () => {
  // Event listener para o botão de filtro
  document.getElementById("filterBtn").addEventListener("click", filtrarDestinos);

  // Event listeners para os botões "Ver Pacotes"
  const cards = document.querySelectorAll("#destinations .card");
  cards.forEach(card => {
    const button = card.querySelector('button');
    const titulo = card.querySelector('h3').textContent;
    
    button.addEventListener('click', () => {
      if (titulo === 'Paris' || titulo === 'Nova Iorque' || titulo === 'Tóquio') {
        redirecionarParaPacote(titulo);
      } else {
        showCustomAlert('Desculpe, ainda não temos pacotes disponíveis para este destino. Fique atento às nossas novidades!');
      }
    });
  });
});
