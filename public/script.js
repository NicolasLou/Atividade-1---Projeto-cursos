const API_URL = "/api/pacotes";
const API_PESSOAS = "/api/pessoas"; 


function mostrarMensagem(tipo, texto) {
  const messages = document.getElementById("messages");
  messages.innerHTML = `
    <div class="alert alert-${tipo}" role="alert">${texto}</div>
  `;
  setTimeout(() => messages.innerHTML = "", 3000);
}

async function fetchJSON(url, options = {}) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (err) {
    console.error("Erro:", err);
    mostrarMensagem("danger", "Erro ao comunicar com servidor");
    throw err;
  }
}


async function carregarPacotesPublico() {
  if (!document.getElementById("lista-pacotes")) return;
  const pacotes = await fetchJSON(API_URL);
  const container = document.getElementById("lista-pacotes");
  container.innerHTML = "";
  pacotes.forEach(p => {
    container.innerHTML += `
      <div class="col-md-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${p.nome}</h5>
            <p class="card-text">${p.descricao || ""}</p>
            <p><strong>R$ ${parseFloat(p.preco).toFixed(2)}</strong></p>
          </div>
        </div>
      </div>
    `;
  });
}


async function carregarPacotesAdmin() {
  if (!document.getElementById("tabela-pacotes")) return;
  const pacotes = await fetchJSON(API_URL);
  const tabela = document.getElementById("tabela-pacotes");
  tabela.innerHTML = "";
  pacotes.forEach(p => {
    tabela.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.nome}</td>
        <td>${p.descricao || ""}</td>
        <td>R$ ${parseFloat(p.preco).toFixed(2)}</td>
        <td>
          <button class="btn btn-sm btn-warning me-2" onclick="editarPacote(${p.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="excluirPacote(${p.id})">Excluir</button>
        </td>
      </tr>
    `;
  });
}

async function salvarPacote(e) {
  e.preventDefault();
  const id = document.getElementById("pacote-id").value;
  const nome = document.getElementById("nome").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const preco = document.getElementById("preco").value;

  if (!nome || !preco) {
    mostrarMensagem("warning", "Nome e preço são obrigatórios!");
    return;
  }

  const pacote = { nome, descricao, preco };
  try {
    if (id) {
      await fetchJSON(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pacote)
      });
      mostrarMensagem("success", "Pacote atualizado com sucesso!");
    } else {
      await fetchJSON(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pacote)
      });
      mostrarMensagem("success", "Pacote criado com sucesso!");
    }
    document.getElementById("pacote-form").reset();
    document.getElementById("pacote-id").value = "";
    carregarPacotesAdmin();
  } catch {}
}

async function editarPacote(id) {
  const pacote = await fetchJSON(`${API_URL}/${id}`);
  document.getElementById("pacote-id").value = pacote.id;
  document.getElementById("nome").value = pacote.nome;
  document.getElementById("descricao").value = pacote.descricao;
  document.getElementById("preco").value = pacote.preco;
}

async function excluirPacote(id) {
  if (!confirm("Deseja excluir este pacote?")) return;
  try {
    await fetchJSON(`${API_URL}/${id}`, { method: "DELETE" });
    mostrarMensagem("success", "Pacote excluído com sucesso!");
    carregarPacotesAdmin();
  } catch {}
}

// Pessoas
async function carregarPessoasAdmin() {
  if (!document.getElementById("tabela-pessoas")) return;
  const pessoas = await fetchJSON(API_PESSOAS);
  const tabela = document.getElementById("tabela-pessoas");
  tabela.innerHTML = "";
  pessoas.forEach(p => {
    tabela.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.nome}</td>
        <td>${p.email}</td>
        <td>${p.telefone || ""}</td>
        <td>${p.status}</td>
        <td>
          <button class="btn btn-sm btn-warning me-2" onclick="editarPessoa(${p.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="excluirPessoa(${p.id})">Excluir</button>
        </td>
      </tr>
    `;
  });
}

async function salvarPessoa(e) {
  e.preventDefault();
  const id = document.getElementById("pessoa-id").value;
  const nome = document.getElementById("pessoa-nome").value.trim();
  const email = document.getElementById("pessoa-email").value.trim();
  const telefone = document.getElementById("pessoa-telefone").value.trim();
  const status = document.getElementById("pessoa-status").value;

  if (!nome || !email) {
    mostrarMensagem("warning", "Nome e email são obrigatórios!");
    return;
  }

  const pessoa = { nome, email, telefone, status };
  try {
    if (id) {
      await fetchJSON(`${API_PESSOAS}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pessoa)
      });
      mostrarMensagem("success", "Pessoa atualizada com sucesso!");
    } else {
      await fetchJSON(API_PESSOAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pessoa)
      });
      mostrarMensagem("success", "Pessoa criada com sucesso!");
    }
    document.getElementById("pessoa-form").reset();
    document.getElementById("pessoa-id").value = "";
    carregarPessoasAdmin();
  } catch {}
}

async function editarPessoa(id) {
  const pessoa = await fetchJSON(`${API_PESSOAS}/${id}`);
  document.getElementById("pessoa-id").value = pessoa.id;
  document.getElementById("pessoa-nome").value = pessoa.nome;
  document.getElementById("pessoa-email").value = pessoa.email;
  document.getElementById("pessoa-telefone").value = pessoa.telefone;
  document.getElementById("pessoa-status").value = pessoa.status;
}

async function excluirPessoa(id) {
  if (!confirm("Deseja excluir esta pessoa?")) return;
  try {
    await fetchJSON(`${API_PESSOAS}/${id}`, { method: "DELETE" });
    mostrarMensagem("success", "Pessoa excluída com sucesso!");
    carregarPessoasAdmin();
  } catch {}
}


document.addEventListener("DOMContentLoaded", () => {
  carregarPacotesPublico();
  carregarPacotesAdmin();
  carregarPessoasAdmin();

  const formPacote = document.getElementById("pacote-form");
  if (formPacote) formPacote.addEventListener("submit", salvarPacote);

  const formPessoa = document.getElementById("pessoa-form");
  if (formPessoa) formPessoa.addEventListener("submit", salvarPessoa);


  setInterval(() => {
    carregarPacotesAdmin();
    carregarPessoasAdmin();
  }, 5000);
});
