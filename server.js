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
  db.query('SELECT * FROM pacotes', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.get('/api/pacotes/:id', (req, res) => {
  db.query('SELECT * FROM pacotes WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ mensagem: "Pacote não encontrado" });
    res.json(results[0]);
  });
});

app.post('/api/pacotes', (req, res) => {
  const { nome, descricao, preco } = req.body;
  db.query('INSERT INTO pacotes (nome, descricao, preco) VALUES (?, ?, ?)', [nome, descricao, preco], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ mensagem: "Pacote criado com sucesso", id: result.insertId });
  });
});

app.put('/api/pacotes/:id', (req, res) => {
  const { nome, descricao, preco } = req.body;
  db.query('UPDATE pacotes SET nome = ?, descricao = ?, preco = ? WHERE id = ?', [nome, descricao, preco, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ mensagem: "Pacote não encontrado" });
    res.json({ mensagem: "Pacote atualizado com sucesso" });
  });
});

app.delete('/api/pacotes/:id', (req, res) => {
  db.query('DELETE FROM pacotes WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ mensagem: "Pacote não encontrado" });
    res.json({ mensagem: "Pacote excluído com sucesso" });
  });
});


app.get('/api/pessoas', (req, res) => {
  db.query('SELECT * FROM pessoas', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.get('/api/pessoas/:id', (req, res) => {
  db.query('SELECT * FROM pessoas WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ mensagem: "Pessoa não encontrada" });
    res.json(results[0]);
  });
});

app.post('/api/pessoas', (req, res) => {
  const { nome, email, telefone, status } = req.body;
  db.query('INSERT INTO pessoas (nome, email, telefone, status) VALUES (?, ?, ?, ?)', [nome, email, telefone, status], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ mensagem: "Pessoa criada com sucesso", id: result.insertId });
  });
});

app.put('/api/pessoas/:id', (req, res) => {
  const { nome, email, telefone, status } = req.body;
  db.query('UPDATE pessoas SET nome = ?, email = ?, telefone = ?, status = ? WHERE id = ?', [nome, email, telefone, status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ mensagem: "Pessoa não encontrada" });
    res.json({ mensagem: "Pessoa atualizada com sucesso" });
  });
});

app.delete('/api/pessoas/:id', (req, res) => {
  db.query('DELETE FROM pessoas WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ mensagem: "Pessoa não encontrada" });
    res.json({ mensagem: "Pessoa excluída com sucesso" });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
