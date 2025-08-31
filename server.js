const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;


app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));


const pacotes = [
  { id: 1, nome: "Pacote Front-End", descricao: "HTML, CSS, JavaScript", preco: 299.90 },
  { id: 2, nome: "Pacote Back-End", descricao: "Node.js, Express, Banco de Dados", preco: 399.90 },
  { id: 3, nome: "Pacote Full Stack", descricao: "Front + Back + Deploy", preco: 699.90 }
];


app.get('/api/pacotes', (req, res) => {
  res.json(pacotes);
});


app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
