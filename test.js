import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "bddEduQuest",
  port: 3306,
  password: "password",
});

connection.addListener("error", (err) => {
  console.log(err);
});
