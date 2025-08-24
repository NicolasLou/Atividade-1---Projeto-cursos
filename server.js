const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "chave-secreta",
    resave: false,
    saveUninitialized: true,
  })
);


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.static(path.join(__dirname, "public")));


const cursos = [
  {
    id: 1,
    nome: "Culinaria para Iniciantes",
    inicio: "10/09/2025",
    duracao: "4 semanas",
    preco: 200,
    descricao: "Aprenda os fundamentos da Culinaria.",
    cargaHoraria: "40h",
    instrutor: "Paula Marques",
    nivel: "Iniciante",
    vagas: 20,
  },
  {
    id: 2,
    nome: "Curso de Medicina",
    inicio: "15/09/2025",
    duracao: "6 semanas",
    preco: 400,
    descricao: "Curso completo sobre Medicina.",
    cargaHoraria: "60h",
    instrutor: "Sandra Oliveira",
    nivel: "Avançado",
    vagas: 15,
  },
];


function autenticar(req, res, next) {
  if (req.session.usuarioAutenticado) {
    next();
  } else {
    res.redirect("/login");
  }
}


app.get("/", (req, res) => {
  res.render("index", { cursos });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;
  if (usuario === "admin" && senha === "123") {
    req.session.usuarioAutenticado = true;
    res.redirect("/");
  } else {
    res.send("Usuário ou senha inválidos!");
  }
});

app.get("/detalhes/:id", autenticar, (req, res) => {
  const curso = cursos.find((c) => c.id == req.params.id);
  if (curso) {
    res.render("detalhes", { curso });
  } else {
    res.send("Curso não encontrado!");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});