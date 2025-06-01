// Função para validar email
function validarEmail(email) {
    // Regex mais rigorosa para validar email:
    // - Deve ter caracteres antes do @
    // - Deve ter caracteres entre @ e o ponto
    // - Deve ter pelo menos 2 caracteres após o último ponto (.com, .pt, etc)
    // - Não permite caracteres especiais inválidos
    const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
    return regexEmail.test(email);
}

// Função para validar telefone português
function validarTelefone(telefone) {
    // Aceita formatos: +351 912345678, 912345678, 91 234 56 78
    const regexTelefone = /^(?:\+351\s?)?9[1236]\d{8}$/;
    return telefone === "" || regexTelefone.test(telefone.replace(/\s/g, ''));
}

// Função para mostrar mensagem de erro
function mostrarErro(input, mensagem) {
    const errorElement = input.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        const span = document.createElement('span');
        span.className = 'error-message';
        span.style.color = '#ef4444';
        span.style.fontSize = '0.875rem';
        span.style.marginTop = '0.25rem';
        input.parentNode.insertBefore(span, input.nextSibling);
    }
    const errorSpan = input.nextElementSibling;
    errorSpan.textContent = mensagem;
    errorSpan.style.display = 'block';
    input.style.borderColor = '#ef4444';
}

// Função para limpar mensagem de erro
function limparErro(input) {
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.style.display = 'none';
    }
    input.style.borderColor = '';
}

// Função principal de validação do formulário
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.contact-form form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // Validar Nome
            const nome = form.querySelector('#nome');
            if (!nome.value.trim()) {
                mostrarErro(nome, 'Por favor, insira seu nome completo');
                isValid = false;
            } else if (nome.value.trim().length < 3) {
                mostrarErro(nome, 'O nome deve ter pelo menos 3 caracteres');
                isValid = false;
            } else {
                limparErro(nome);
            }

            // Validar Email
            const email = form.querySelector('#email');
            if (!email.value.trim()) {
                mostrarErro(email, 'Por favor, insira seu email');
                isValid = false;
            } else if (!validarEmail(email.value.trim())) {
                mostrarErro(email, 'Por favor, insira um email válido');
                isValid = false;
            } else {
                limparErro(email);
            }

            // Validar Telefone
            const telefone = form.querySelector('#telefone');
            if (telefone.value.trim() && !validarTelefone(telefone.value.trim())) {
                mostrarErro(telefone, 'Por favor, insira um número de telefone português válido');
                isValid = false;
            } else {
                limparErro(telefone);
            }

            // Validar Assunto
            const assunto = form.querySelector('#assunto');
            if (!assunto.value.trim()) {
                mostrarErro(assunto, 'Por favor, insira o assunto da mensagem');
                isValid = false;
            } else if (assunto.value.trim().length < 3) {
                mostrarErro(assunto, 'O assunto deve ter pelo menos 3 caracteres');
                isValid = false;
            } else {
                limparErro(assunto);
            }

            // Validar Mensagem
            const mensagem = form.querySelector('#mensagem');
            if (!mensagem.value.trim()) {
                mostrarErro(mensagem, 'Por favor, insira sua mensagem');
                isValid = false;
            } else if (mensagem.value.trim().length < 10) {
                mostrarErro(mensagem, 'A mensagem deve ter pelo menos 10 caracteres');
                isValid = false;
            } else {
                limparErro(mensagem);
            }

            // Se tudo estiver válido, enviar o formulário
            if (isValid) {
                // Aqui você pode adicionar o código para enviar o formulário
                alert('Mensagem enviada com sucesso!');
                form.reset();
            }
        });

        // Limpar erros quando o usuário começar a digitar
        form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                limparErro(input);
            });
        });
    }
});
