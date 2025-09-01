const express = require('express');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       
  password: '',       
  database: 'projeto_cursos'
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL!');
});

app.get('/api/pacotes', (req, res) => {
  const sql = 'SELECT * FROM pacotes';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post('/api/pacotes', (req, res) => {
  const { nome, descricao, preco } = req.body;
  const sql = 'INSERT INTO pacotes (nome, descricao, preco) VALUES (?, ?, ?)';
  db.query(sql, [nome, descricao, preco], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: result.insertId, nome, descricao, preco });
  });
});

app.put('/api/pacotes/:id', (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco } = req.body;
  const sql = 'UPDATE pacotes SET nome = ?, descricao = ?, preco = ? WHERE id = ?';
  db.query(sql, [nome, descricao, preco, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id, nome, descricao, preco });
  });
});

app.delete('/api/pacotes/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM pacotes WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Pacote removido com sucesso' });
  });
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
