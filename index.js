require("dotenv").config();

const cors = require("cors");
const db = require("./db");
const express = require("express");
const app = express();

app.use(express.json());
app.use(cors());

app.listen(process.env.PORT, () => {
  console.log("Application running.");
});

app.post("/cadastrar", async (req, res) => {
  const user = req.body;
  const result = await db.cadastrarCliente(user);

  if (result) {
    res.status(201).json({
      code: "200",
      message: "Conta criada com sucesso.",
      email: user.email,
    });
    return;
  }

  res.status(409).json({
    code: "409",
    message: "Já existe uma conta com esse email.",
  });
});

app.post("/login", async (req, res) => {
  const user = req.body;
  const result = await db.loginCliente(user);

  if (result) {
    res.status(200).json({
      code: "200",
      message: "Conta logada com sucesso.",
      email: user.email,
      nome: result[0].nome,
    });
    return;
  }

  res.status(401).json({
    code: "401",
    message: "Não foi possível fazer o login. Tente novamente mais tarde.",
  });
});

app.post("/meusTreinos", async (req, res) => {
  const user = req.body;
  const result = await db.listaTreinos(user);

  if (result) {
    res.status(200).json({
      json: result[0],
    });
    return;
  }
  res.status(401).json({
    code: "401",
    message: "Não foi possível listar os treinos. Tente novamente mais tarde.",
  });
});

app.post("/cadastroTreino", async (req, res) => {
  const treinos = req.body;

  if (!Array.isArray(treinos)) {
    return res.status(400).json({
      code: "400",
      message: "Formato de dados inválido. Esperado um array.",
    });
  }

  const result = await db.cadastroTreino(treinos);

  if(!result){
    res.status(400).json({
      code: "400",
      message: "Já existe um treino com esse mesmo nome."
    })
  }

  if (result) {
    res.status(201).json({
      code: "200",
      message: "Treinos adicionados com sucesso.",
    });
    return;
  }

  res.status(500).json({
    code: "500",
    message: "Erro ao adicionar treinos.",
  });
});
