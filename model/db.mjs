import mysql from "mysql2";

export default function createConnection() {
  // Configurez MySQL
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "bddEduQuest",
  });

  // Connexion à MySQL
  connection.connect();

  // Retournez l'objet de connexion
  return connection;
}
