// Carregar pacotes na página inicial
if (document.getElementById('pacotes-container')) {
  fetch('/api/pacotes')
    .then(res => res.json())
    .then(pacotes => {
      const container = document.getElementById('pacotes-container');
      pacotes.forEach(p => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
          <h3>${p.nome}</h3>
          <p>${p.descricao}</p>
          <p>R$ ${p.preco.toFixed(2)}</p>
          <a href="pacote.html?id=${p.id}">Ver Detalhes</a>
        `;
        container.appendChild(div);
      });
    });
}

// Mostrar detalhes do pacote
if (window.location.pathname.includes('pacote.html')) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  fetch('/api/pacotes')
    .then(res => res.json())
    .then(pacotes => {
      const pacote = pacotes.find(p => p.id == id);
      if (pacote) {
        document.getElementById('pacote-nome').textContent = pacote.nome;
        document.getElementById('pacote-descricao').textContent = pacote.descricao;
        document.getElementById('pacote-preco').textContent = `R$ ${pacote.preco.toFixed(2)}`;
      }
    });
}

// Carrinho simples no LocalStorage
function adicionarAoCarrinho() {
  const preco = parseFloat(document.getElementById('pacote-preco').textContent.replace('R$ ', '').replace(',', '.'));
  let total = parseFloat(localStorage.getItem('carrinho') || 0);
  total += preco;
  localStorage.setItem('carrinho', total);
  document.getElementById('total-carrinho').textContent = total.toFixed(2);
}

// Login básico (salva no LocalStorage)
if (document.getElementById('login-form')) {
  document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    localStorage.setItem('logado', 'true');
    alert('Login realizado com sucesso!');
    window.location.href = 'index.html';
  });
}
