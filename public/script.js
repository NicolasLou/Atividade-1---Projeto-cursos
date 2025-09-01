const apiUrl = '/api/pacotes';


async function carregarPacotes() {
  const res = await fetch(apiUrl);
  const pacotes = await res.json();

  const lista = document.getElementById('lista-pacotes');
  if (!lista) return;

  lista.innerHTML = '';

  const isTabela = lista.tagName === 'TBODY';

  pacotes.forEach(p => {
    const precoFormatado = parseFloat(p.preco).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

    if (isTabela) {
  
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.nome}</td>
        <td>${p.descricao}</td>
        <td>${precoFormatado}</td>
        <td>
          <button onclick='editarPacote(${p.id}, ${JSON.stringify(p.nome)}, ${JSON.stringify(p.descricao)}, ${JSON.stringify(p.preco)})'>Editar</button>
          <button onclick="excluirPacote(${p.id})">Excluir</button>
        </td>
      `;
      lista.appendChild(tr);
    } else {
 
      const card = document.createElement('div');
      card.className = 'card linha';
      card.innerHTML = `
        <div class="info">
          <span><strong>Nome:</strong> ${p.nome}</span>
          <span><strong>Descrição:</strong> ${p.descricao}</span>
          <span><strong>Preço:</strong> ${precoFormatado}</span>
        </div>
        <div class="acoes">
          <button onclick='editarPacote(${p.id}, ${JSON.stringify(p.nome)}, ${JSON.stringify(p.descricao)}, ${JSON.stringify(p.preco)})'>Editar</button>
          <button onclick="excluirPacote(${p.id})">Excluir</button>
        </div>
      `;
      lista.appendChild(card);
    }
  });
}

async function criarPacote(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value;
  const descricao = document.getElementById('descricao').value;
  const preco = document.getElementById('preco').value;

  await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, descricao, preco })
  });

  document.getElementById('form-pacote').reset();
  carregarPacotes();
}


async function editarPacote(id, nome, descricao, preco) {
  document.getElementById('nome').value = nome;
  document.getElementById('descricao').value = descricao;
  document.getElementById('preco').value = preco;

  const form = document.getElementById('form-pacote');
  form.onsubmit = async (event) => {
    event.preventDefault();
    const novoNome = document.getElementById('nome').value;
    const novaDescricao = document.getElementById('descricao').value;
    const novoPreco = document.getElementById('preco').value;

    await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: novoNome, descricao: novaDescricao, preco: novoPreco })
    });

    form.reset();
    form.onsubmit = criarPacote; 
    carregarPacotes();
  };
}


async function excluirPacote(id) {
  if (confirm("Tem certeza que deseja excluir este pacote?")) {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    carregarPacotes();
  }
}


document.addEventListener('DOMContentLoaded', () => {
  carregarPacotes();

  const form = document.getElementById('form-pacote');
  if (form) {
    form.onsubmit = criarPacote;
  }
});
