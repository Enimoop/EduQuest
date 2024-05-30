import createConnection from "./db.mjs";

class ModeleCommentaires {
  constructor() {
    this.connection = createConnection();
  }

  recupererCommentaireParPostId(id, callback) {
    const query = `
    SELECT c.id_com, c.contenu_com, c.date_com, c.id_post, e.nom, e.prenom
    FROM Commentaire c
    JOIN Eleve e ON c.id_u = e.id_u
    WHERE c.id_post = ?`;
    this.connection.query(query, [id], (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      const commentaires = results.map((row) => ({
        id: row.id_com,
        contenu: row.contenu_com,
        date: row.date_com,
        id_post: row.id_post,
        eleve: {
          id: row.id_u,
          nom: row.nom,
          prenom: row.prenom,
        },
      }));
      callback(null, commentaires);
    });
  }

  insererCommentaire(id_post, contenu, callback) {
    const query =
      "INSERT INTO Commentaire (contenu_post, date_post, id_post) VALUES (?, NOW(), ?)";
    this.connection.query(
      query,
      [contenu, id_post],
      (error, results, fields) => {
        if (error) {
          callback(error, null);
          return;
        }
        callback(null, results.insertId);
      }
    );
  }
}

export default ModeleCommentaires;
