document.addEventListener('DOMContentLoaded', () => {
  // Função para sanitizar HTML (reutilizando a lógica existente)
  const sanitizeHTML = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  // Verificar e atualizar o nome no cabeçalho
  const updateUserNameInHeader = () => {
    const activeUser = JSON.parse(sessionStorage.getItem('activeUser')) || {};
    const userDisplayName = document.getElementById('user-display-name');

    if (userDisplayName) {
      const fullName = `${sanitizeHTML(activeUser.firstName || '')} ${sanitizeHTML(activeUser.lastName || '')}`.trim();
      userDisplayName.textContent = fullName || 'Área de Cliente'; // Fallback
    }
  };

  // Chamar a função ao carregar a página
  updateUserNameInHeader();
});