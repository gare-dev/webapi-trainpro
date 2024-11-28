const mysql = require("mysql2/promise");

const client = mysql.createPool(process.env.CONNECTION_STRING);

async function cadastrarCliente(usuario) {
  const values = [usuario.nome, usuario.email, usuario.senha];
  const checkSignup = await client.query(
    "SELECT * FROM usuarios WHERE email = ?",
    values[1]
  );
  if (checkSignup[0].length != 1) {
    const results = await client.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
      values
    );
    return results[0];
  } else {
    return false;
  }
}

async function loginCliente(usuario) {
  const values = [usuario.email, usuario.senha];
  const login = await client.query(
    "SELECT * FROM usuarios WHERE email = ? and senha = ?",
    values
  );
  if (login[0].length === 1) {
    return login[0];
  } else {
    return false;
  }
}

async function cadastroTreino(treinos) {
  try {
    for (const treino of treinos) {
      const values = [
        treino.user,
        treino.nome,
        treino.categoria,
        treino.series,
        treino.data,
        treino.nomeEx,
        treino.repts,
        treino.kgs,
      ];

      const response = await client.query(
        "INSERT INTO treinos (usuario_id, nome, categoria, series, data, exercicio, repts, kgs) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        values
      );

      if (response[0].affectedRows !== 1) {
        throw new Error("Falha ao adicionar treino.");
      }
    }

    return true;
  } catch (error) {
    console.error("Erro ao cadastrar treinos:", error.message);
    return false;
  }
}

async function listaTreinos(user) {
  const value = [user.email];
  const treinos = await client.query(
    "SELECT * FROM treinos WHERE usuario_id = ?",
    value
  );
  if (treinos[0].length >= 1) {
    return treinos;
  }
  return false;
}

module.exports = {
  cadastrarCliente,
  loginCliente,
  cadastroTreino,
  listaTreinos,
};
