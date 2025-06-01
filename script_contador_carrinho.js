// Função para atualizar o contador do carrinho
function atualizarContadorCarrinho() {
    try {
        // Tentar obter itens do carrinho de ambas as chaves possíveis
        let carrinho = [];
        const carrinhoItens = localStorage.getItem('carrinhoItens');
        const cart = localStorage.getItem('cart');

        if (carrinhoItens) {
            carrinho = JSON.parse(carrinhoItens);
        } else if (cart) {
            carrinho = JSON.parse(cart);
        }

        // Garantir que carrinho é um array
        if (!Array.isArray(carrinho)) {
            carrinho = [];
        }

        // Atualizar todos os contadores na página
        const contadores = document.querySelectorAll('.carrinho-contador');
        contadores.forEach(contador => {
            contador.textContent = carrinho.length;
            
            // Mostrar/esconder contador baseado no número de itens
            if (carrinho.length > 0) {
                contador.style.display = 'block';
            } else {
                contador.style.display = 'none';
            }
        });

    } catch (error) {
        console.error('Erro ao atualizar contador:', error);
        // Em caso de erro, tentar resetar o contador para 0
        const contadores = document.querySelectorAll('.carrinho-contador');
        contadores.forEach(contador => {
            contador.textContent = '0';
            contador.style.display = 'none';
        });
    }
}

// Função para inicializar o contador
function inicializarContador() {
    // Atualizar contador imediatamente
    atualizarContadorCarrinho();

    // Observar mudanças no localStorage
    window.addEventListener('storage', (e) => {
        if (e.key === 'carrinhoItens' || e.key === 'cart') {
            atualizarContadorCarrinho();
        }
    });

    // Criar um observador customizado para mudanças no carrinho
    const carrinhoObserver = new MutationObserver(() => {
        atualizarContadorCarrinho();
    });

    // Observar mudanças no DOM que possam afetar o carrinho
    const carrinhoContainer = document.querySelector('.itens-carrinho');
    if (carrinhoContainer) {
        carrinhoObserver.observe(carrinhoContainer, { 
            childList: true, 
            subtree: true 
        });
    }

    // Adicionar listener para eventos customizados de atualização do carrinho
    document.addEventListener('carrinhoAtualizado', atualizarContadorCarrinho);

    // Atualizar a cada 2 segundos como fallback
    setInterval(atualizarContadorCarrinho, 2000);
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarContador);
} else {
    inicializarContador();
} 