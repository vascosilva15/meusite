// Dados das perguntas frequentes
const faqData = [
    {
        question: "Como faço para alterar minha reserva?",
        answer: "Para alterar sua reserva, acesse sua área de cliente e vá para 'As suas Reservas'. Lá você encontrará todas as opções de alteração disponíveis para sua viagem.",
        category: "reservas"
    },
    {
        question: "Quais são as formas de pagamento aceitas?",
        answer: `Aceitamos as seguintes formas de pagamento:
        - Cartões de crédito (Visa, MasterCard, American Express)
        - Cartões de débito
        - PayPal
        - MB Way`,
        category: "pagamentos"
    },
    {
        question: "Qual é a política de cancelamento?",
        answer: `Nossa política de cancelamento varia de acordo com o tipo de reserva:
        - Até 48h antes: reembolso total
        - 24-48h antes: reembolso de 50%
        - Menos de 24h: sem reembolso
        
        Algumas tarifas especiais podem ter regras diferentes.`,
        category: "cancelamentos"
    },
    {
        question: "Qual é o limite de bagagem permitido?",
        answer: `O limite de bagagem depende da companhia aérea e da classe da passagem. Em geral:
        - Bagagem de mão: 8-10kg
        - Bagagem despachada: 23-32kg
        
        Consulte os detalhes específicos na sua reserva.`,
        category: "bagagem"
    }
    // Adicione mais perguntas conforme necessário
];

// Elementos DOM
const faqList = document.getElementById('faqList');
const searchInput = document.getElementById('searchFaq');
const categoryButtons = document.querySelectorAll('.category-btn');

// Estado da aplicação
let currentCategory = 'all';

// Funções
function createFaqElement(faq) {
    const faqItem = document.createElement('div');
    faqItem.className = 'faq-item';
    faqItem.dataset.category = faq.category;
    
    faqItem.innerHTML = `
        <div class="faq-question">
            <h3>${faq.question}</h3>
            <i class="fas fa-chevron-down"></i>
        </div>
        <div class="faq-answer">
            <p>${faq.answer.replace(/\n/g, '<br>')}</p>
        </div>
    `;

    // Adicionar evento de clique
    const question = faqItem.querySelector('.faq-question');
    question.addEventListener('click', () => toggleFaq(faqItem));

    return faqItem;
}

function toggleFaq(faqItem) {
    const wasActive = faqItem.classList.contains('active');
    
    // Fechar todos os outros itens
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const answer = item.querySelector('.faq-answer');
        answer.style.maxHeight = null;
    });

    // Se o item clicado não estava ativo, abri-lo
    if (!wasActive) {
        faqItem.classList.add('active');
        const answer = faqItem.querySelector('.faq-answer');
        answer.style.maxHeight = answer.scrollHeight + "px";
    }
}

function filterFaqs() {
    const searchTerm = searchInput.value.toLowerCase();
    const visibleFaqs = [];

    faqList.innerHTML = '';

    faqData.forEach(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm) ||
                            faq.answer.toLowerCase().includes(searchTerm);
        const matchesCategory = currentCategory === 'all' || faq.category === currentCategory;

        if (matchesSearch && matchesCategory) {
            visibleFaqs.push(faq);
        }
    });

    if (visibleFaqs.length === 0) {
        faqList.innerHTML = `
            <div class="no-results">
                <p>Nenhuma pergunta encontrada. Tente uma busca diferente.</p>
            </div>
        `;
    } else {
        visibleFaqs.forEach(faq => {
            faqList.appendChild(createFaqElement(faq));
        });
    }
}

// Event Listeners
searchInput.addEventListener('input', debounce(filterFaqs, 300));

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentCategory = button.dataset.category;
        filterFaqs();
    });
});

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Animações
function addEntranceAnimation() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    filterFaqs();
    addEntranceAnimation();
}); 