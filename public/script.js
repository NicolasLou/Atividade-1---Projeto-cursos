document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("quantidade");
  const totalSpan = document.getElementById("total");

  if (input && totalSpan) {
    const preco = parseFloat(totalSpan.textContent);

    input.addEventListener("input", () => {
      const qtd = parseInt(input.value) || 1;
      totalSpan.textContent = (preco * qtd).toFixed(2);
    });
  }
});