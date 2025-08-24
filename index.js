const express = require("express");
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "segredo",
    resave: false,
    saveUninitialized: true
}));

const USER = { username: "admin", password: "123" };

const cursos = [
    {
        id: 1,
        nome: "Curso de Culinaria",
        inicio: "01/09/2025",
        duracao: "4 semanas",
        preco: 200,
        descricao: "Curso introdutório de Culinaria.",
        carga: "20h",
        instrutor: "João Silva",
        nivel: "Iniciante",
        vagas: 30
    },
    {
        id: 2,
        nome: "Curso de Medicina",
        inicio: "15/09/2025",
        duracao: "6 semanas",
        preco: 350,
        descricao: "Curso avançado sobre medicina.",
        carga: "40h",
        instrutor: "Maria Souza",
        nivel: "Avançado",
        vagas: 25
    }
];

function checkAuth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/login");
    }
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === USER.username && password === USER.password) {
        req.session.user = USER;
        res.redirect("/");
    } else {
        res.send("<h2>Usuário ou senha inválidos. <a href='/login'>Tente novamente</a></h2>");
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

app.get("/detalhes/:id", checkAuth, (req, res) => {
    const curso = cursos.find(c => c.id == req.params.id);
    if (!curso) return res.status(404).send("Curso não encontrado.");
    res.sendFile(path.join(__dirname, "views", "packageDetails.html"));
});

app.get("/api/cursos", (req, res) => {
    res.json(cursos);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
