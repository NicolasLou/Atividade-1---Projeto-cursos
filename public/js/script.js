// Renderização da lista de cursos
if (document.getElementById("lista-cursos")) {
  fetch("/api/cursos")
    .then(res => res.json())
    .then(cursos => {
      const lista = document.getElementById("lista-cursos");
      cursos.forEach(curso => {
        const card = document.createElement("article");
        card.className = "card";
        card.innerHTML = `
          <h3>${curso.nome}</h3>
          <p>Início: ${curso.inicio}</p>
          <p>Duração: ${curso.duracao}</p>
          <p>Preço: R$ ${curso.preco}</p>
          <a href="/detalhes/${curso.id}">
            <button>Ver detalhes</button>
          </a>
        `;
        lista.appendChild(card);
      });
    });
}

// Página de detalhes: carregar dados e calcular total
if (document.getElementById("detalhes")) {
  const cursoId = window.location.pathname.split("/").pop();

  fetch("/api/cursos")
    .then(res => res.json())
    .then(cursos => {
      const curso = cursos.find(c => c.id == cursoId);
      if (curso) {
        document.getElementById("detalhes").innerHTML = `
          <h2>${curso.nome}</h2>
          <p>${curso.descricao}</p>
          <p><b>Instrutor:</b> ${curso.instrutor}</p>
          <p><b>Nível:</b> ${curso.nivel}</p>
          <p><b>Carga Horária:</b> ${curso.carga}</p>
          <p><b>Preço:</b> R$ ${curso.preco}</p>
          <p><b>Vagas disponíveis:</b> ${curso.vagas}</p>
        `;

        const qtdInput = document.getElementById("quantidade");
        const totalSpan = document.getElementById("total");

        function calcularTotal() {
          let qtd = parseInt(qtdInput.value) || 1;
          if (qtd > curso.vagas) qtd = curso.vagas;
          totalSpan.textContent = (qtd * curso.preco).toFixed(2);
        }

        qtdInput.addEventListener("input", calcularTotal);
        calcularTotal();
      }
    });
}
