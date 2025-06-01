// Carrinho
const carrinhoContainer = document.getElementById("itens-carrinho");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");
const inputCupao = document.querySelector(".input-cupao");

let desconto = parseFloat(localStorage.getItem('desconto')) || 0;

// Limpar quaisquer itens de exemplo antigos e inicializar o carrinho
document.addEventListener("DOMContentLoaded", () => {
  // Se não houver itens no carrinho, limpar completamente o localStorage
  const carrinhoItens = JSON.parse(localStorage.getItem("carrinhoItens")) || [];
  if (carrinhoItens.length === 0) {
    localStorage.removeItem("carrinhoItens");
    localStorage.removeItem("desconto");
    desconto = 0;
  }
  renderizarCarrinho();
  verificarBotaoCupom();
});

// Carregar itens do localStorage
let carrinhoItens = JSON.parse(localStorage.getItem("carrinhoItens")) || [];

function formatarPreco(valor) {
  // Garantir que o valor é um número
  const numero = typeof valor === 'string' ? parseFloat(valor.replace('€', '').trim()) : Number(valor);
  
  // Verificar se é um número válido
  if (isNaN(numero)) {
    console.error('Valor inválido para formatação:', valor);
    return '€0,00';
  }
  
  return `€${numero.toFixed(2).replace('.', ',')}`;
}

function atualizarTotais() {
  const subtotal = calcularSubtotal();
  const total = subtotal - desconto;

  document.getElementById('subtotal').textContent = formatarPreco(subtotal);
  document.getElementById('desconto').textContent = formatarPreco(desconto);
  document.getElementById('total').textContent = formatarPreco(total);
  
  // Salvar desconto no localStorage
  localStorage.setItem('desconto', desconto.toString());
}

// Função para verificar e atualizar o estado do botão de cupom
function verificarBotaoCupom() {
  const botaoCupom = document.querySelector('.btn-aplicar-cupom');
  const inputCupom = document.getElementById('input-cupao');
  const activeUser = JSON.parse(sessionStorage.getItem('activeUser'));
  
  if (!activeUser) {
    botaoCupom.disabled = true;
    inputCupom.disabled = true;
    botaoCupom.title = 'Faça login para aplicar cupons';
    inputCupom.title = 'Faça login para aplicar cupons';
  } else {
    botaoCupom.disabled = false;
    inputCupom.disabled = false;
    botaoCupom.title = '';
    inputCupom.title = '';
  }
}

function aplicarCupom() {
  const activeUser = JSON.parse(sessionStorage.getItem('activeUser'));
  if (!activeUser) {
    mostrarMensagem('Faça login para aplicar cupons', 'erro');
    return;
  }

  const inputCupom = document.getElementById('input-cupao');
  const mensagemEl = document.getElementById('cupom-mensagem');
  const codigo = inputCupom.value.trim().toUpperCase();

  // Lista de cupons válidos
  const cuponsValidos = {
    'PROMO10': 10,
    'PROMO20': 20,
    'PROMO30': 30
  };

  if (cuponsValidos.hasOwnProperty(codigo)) {
    desconto = calcularSubtotal() * (cuponsValidos[codigo] / 100);
    localStorage.setItem('desconto', desconto.toString());
    localStorage.setItem('cupomAplicado', codigo);
    mensagemEl.textContent = `Cupom ${codigo} aplicado com sucesso! (${cuponsValidos[codigo]}% de desconto)`;
    mensagemEl.className = 'cupom-mensagem sucesso';
    inputCupom.value = '';
  } else {
    desconto = 0;
    localStorage.removeItem('desconto');
    localStorage.removeItem('cupomAplicado');
    mensagemEl.textContent = 'Cupom inválido. Tente PROMO10, PROMO20 ou PROMO30';
    mensagemEl.className = 'cupom-mensagem erro';
  }

  atualizarTotais();
}

function calcularSubtotal() {
  return carrinhoItens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
}

function renderizarCarrinho() {
  // Recarregar itens do localStorage para garantir dados atualizados
  carrinhoItens = JSON.parse(localStorage.getItem("carrinhoItens")) || [];
  console.log('Itens no carrinho:', carrinhoItens); // Debug log
  
  carrinhoContainer.innerHTML = "";

  if (carrinhoItens.length === 0) {
    console.log('Carrinho vazio'); // Debug log
    carrinhoContainer.innerHTML = `
      <div class="carrinho-vazio">
        <p>O seu carrinho está vazio.</p>
        <p>Adicione voos, hotéis, pacotes ou promoções para continuar.</p>
      </div>
    `;
    // Zerar os totais quando o carrinho estiver vazio
    subtotalEl.textContent = '€0,00';
    totalEl.textContent = '€0,00';
    desconto = 0;
    return;
  }

  console.log('Renderizando itens...'); // Debug log
  carrinhoItens.forEach((item, index) => {
    console.log(`Renderizando item ${index}:`, item); // Debug log
    const itemEl = document.createElement("div");
    itemEl.classList.add("item-carrinho");
    itemEl.setAttribute('data-tipo', item.tipo);

    // Template diferente baseado no tipo de item (voo, hotel, pacote ou promocao)
    if (item.tipo === 'voo') {
      itemEl.innerHTML = `
        <img src="${item.imagem}" alt="Voo" class="imagem-item" />
        <div class="detalhes-item">
          <h3>Voo ${item.origem} → ${item.destino}</h3>
          <p>Data Ida: <strong>${item.dataIda}</strong></p>
          ${item.dataVolta ? `<p>Data Volta: <strong>${item.dataVolta}</strong></p>` : ''}
          <p>Passageiros: ${item.adultos} adulto(s)${item.criancas ? `, ${item.criancas} criança(s)` : ''}${item.bebes ? `, ${item.bebes} bebé(s)` : ''}</p>
          <p>Classe: ${item.classe}</p>
          <div class="quantidade-controle">
            <button onclick="alterarQuantidade(${item.id}, -1)">-</button>
            <span>${item.quantidade}</span>
            <button onclick="alterarQuantidade(${item.id}, 1)">+</button>
          </div>
          <p class="preco">${formatarPreco(item.preco * item.quantidade)}</p>
          <button class="remover-btn" onclick="removerItem(${item.id})"><i class="fa-solid fa-trash"></i> Remover</button>
        </div>
      `;
    } else if (item.tipo === 'hotel') {
      itemEl.innerHTML = `
        <img src="${item.imagem}" alt="${item.nome}" class="imagem-item" />
        <div class="detalhes-item">
          <h3>${item.nome}</h3>
          <p>Quarto: ${item.quarto}</p>
          <p>Check-in: <strong>${item.dataIda}</strong></p>
          <p>Check-out: <strong>${item.dataVolta}</strong></p>
          <p>Passageiros: ${item.adultos} adulto(s)${item.criancas ? `, ${item.criancas} criança(s)` : ''}</p>
          <p>Preço por noite: ${formatarPreco(item.precoNoite)}</p>
          <p>Noites: ${item.noites}</p>
          <div class="quantidade-controle">
            <button onclick="alterarQuantidade(${item.id}, -1)">-</button>
            <span>${item.quantidade}</span>
            <button onclick="alterarQuantidade(${item.id}, 1)">+</button>
          </div>
          <p class="preco">${formatarPreco(item.preco * item.quantidade)}</p>
          <button class="remover-btn" onclick="removerItem(${item.id})"><i class="fa-solid fa-trash"></i> Remover</button>
        </div>
      `;
    } else if (item.tipo === 'pacote') {
      itemEl.innerHTML = `
        <img src="${item.imagem}" alt="${item.nome}" class="imagem-item" />
        <div class="detalhes-item">
          <h3>${item.nome}</h3>
          <p>Hotel: ${item.hotelNome}</p>
          <p>Voo: ${item.origem} → ${item.destino}</p>
          <p>Data Ida: <strong>${item.dataIda}</strong></p>
          <p>Data Volta: <strong>${item.dataVolta}</strong></p>
          <p>Passageiros: ${item.adultos} adulto(s)${item.criancas ? `, ${item.criancas} criança(s)` : ''}${item.bebes ? `, ${item.bebes} bebé(s)` : ''}</p>
          <div class="quantidade-controle">
            <button onclick="alterarQuantidade(${item.id}, -1)">-</button>
            <span>${item.quantidade}</span>
            <button onclick="alterarQuantidade(${item.id}, 1)">+</button>
          </div>
          <p class="preco">${formatarPreco(item.preco * item.quantidade)}</p>
          <button class="remover-btn" onclick="removerItem(${item.id})"><i class="fa-solid fa-trash"></i> Remover</button>
        </div>
      `;
    } else if (item.tipo === 'promocao') {
      itemEl.innerHTML = `
        <img src="${item.imagem}" alt="${item.nome}" class="imagem-item" />
        <div class="detalhes-item">
          <h3>${item.nome}</h3>
          ${item.nome !== 'Paris Romântica' ? `<p>${item.descricao}</p>` : ''}
          <p>Data Ida: <strong>${item.dataIda}</strong></p>
          ${item.dataVolta ? `<p>Data Volta: <strong>${item.dataVolta}</strong></p>` : ''}
          <p>Passageiros: ${item.passageiros}</p>
          <div class="quantidade-controle">
            <button onclick="alterarQuantidade(${item.id}, -1)">-</button>
            <span>${item.quantidade}</span>
            <button onclick="alterarQuantidade(${item.id}, 1)">+</button>
          </div>
          <p class="preco">${formatarPreco(item.preco * item.quantidade)}</p>
          <button class="remover-btn" onclick="removerItem(${item.id})"><i class="fa-solid fa-trash"></i> Remover</button>
        </div>
      `;
    }

    carrinhoContainer.appendChild(itemEl);
  });

  atualizarTotais();
}

function alterarQuantidade(id, delta) {
  const item = carrinhoItens.find(i => i.id === id);
  if (!item) return;

  item.quantidade += delta;
  if (item.quantidade < 1) item.quantidade = 1;

  localStorage.setItem("carrinhoItens", JSON.stringify(carrinhoItens));
  renderizarCarrinho();
}

function removerItem(id) {
  const index = carrinhoItens.findIndex(i => i.id === id);
  if (index !== -1) {
    carrinhoItens.splice(index, 1);
    localStorage.setItem("carrinhoItens", JSON.stringify(carrinhoItens));
    
    // Se o carrinho ficar vazio, limpar também o desconto
    if (carrinhoItens.length === 0) {
      localStorage.removeItem('desconto');
      localStorage.removeItem('cupomAplicado');
      desconto = 0;
    }
    
    renderizarCarrinho();
  }
}

// Função para mostrar mensagem flutuante
function mostrarMensagem(mensagem, tipo = 'info') {
  const mensagemDiv = document.createElement('div');
  mensagemDiv.className = `mensagem-flutuante ${tipo}`;
  mensagemDiv.textContent = mensagem;
  mensagemDiv.setAttribute('role', 'alert');
  document.body.appendChild(mensagemDiv);

  setTimeout(() => {
    mensagemDiv.classList.add('mostrar');
  }, 100);

  setTimeout(() => {
    mensagemDiv.classList.remove('mostrar');
    setTimeout(() => {
      mensagemDiv.remove();
    }, 300);
  }, 3000);
}

// Manipulador para o botão "Finalizar Compra"
document.querySelector('.btn-checkout').addEventListener('click', () => {
  if (carrinhoItens.length === 0) {
    mostrarMensagem('O seu carrinho está vazio. Adicione itens antes de finalizar a compra.', 'erro');
    return;
  }

  // Salvar os itens do carrinho no localStorage antes de redirecionar
  localStorage.setItem("carrinhoItens", JSON.stringify(carrinhoItens));

  const activeUser = JSON.parse(sessionStorage.getItem('activeUser'));
  
  if (!activeUser) {
    // Salvar a página atual (carrinho) como destino após o login
    localStorage.setItem('lastPage', window.location.href);
    // Adicionar flag específica para checkout
    localStorage.setItem('checkoutRedirect', 'true');
    // Mostrar mensagem antes do redirecionamento
    mostrarMensagem('Por favor, faça login para continuar com a compra', 'info');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
  } else {
    window.location.href = 'checkout.html';
  }
});