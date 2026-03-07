import * as SQLite from "expo-sqlite";

const dbName = "notas.db";
let database;

async function abrirConexao() {
  if(!database) {
    database = await SQLite.openDatabaseAsync(dbName);
  }
  return database;
};

export async function criarTabela() {
  const db = await abrirConexao();
  db.transaction(tx => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS notas (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT, descricao TEXT, categoria TEXT);"
    );
  });
};

export async function inserirNota(titulo, descricao, categoria) {
  const db = await abrirConexao();
  db.transaction(tx => {
    tx.executeSql(
      "INSERT INTO notas (titulo, descricao, categoria) VALUES (?, ?, ?);",
      [titulo, descricao, categoria]
    );
  });
};

export async function alterarNota(nota) {
  const db = await abrirConexao();
  db.transaction(tx => {
    tx.executeSql(
      "UPDATE notas SET titulo = ?, descricao = ?, categoria = ? WHERE id = ?;",
      [nota.titulo, nota.descricao, nota.categoria, nota.id]
    );
  });
};

export async function excluirNota(id) {
  const db = await abrirConexao();
  db.transaction(tx => {
    tx.executeSql(
      "DELETE FROM notas WHERE id = ?;",
      [id]
    );
  });
};

export async function listarNotas() {
  const db = await abrirConexao();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM notas;",
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};

export async function filtrarPorCategoria(categoria) {
  const db = await abrirConexao();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM notas WHERE categoria = ?;",
        [categoria],
        (_, { rows }) => resolve(rows._array),  
        (_, error) => reject(error)
      );
    });
  });
};
