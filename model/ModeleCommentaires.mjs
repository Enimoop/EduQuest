import createConnection from "./db.mjs";

class ModeleCommentaires {
  constructor() {
    this.connection = createConnection();
  }

  recupererCommentaireParPostId(id, page, pageSize, callback) {
    const offset = (page - 1) * pageSize;
    const query = `
    SELECT c.id_com, c.contenu_com, c.date_com, c.id_post, u.nom, u.prenom
    FROM Commentaire c
    JOIN User u ON c.id_u = u.id_u
    WHERE c.id_post = ? LIMIT ? OFFSET ?;`;
    this.connection.query(query, [id, pageSize, offset], (error, results, fields) => {
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

  recupererToutCommentaire(id,callback) {
    const query = `
    SELECT count(*) as total
    FROM Commentaire c
    JOIN User u ON c.id_u = u.id_u
    WHERE c.id_post = ?;`;
    this.connection.query(query, [id], (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      callback(null, results[0].total);
    });
  }


  insererCommentaire(contenu, callback) {
    const { contenu_com, id_post, id_u } = contenu;

    const query =
      "INSERT INTO Commentaire (contenu_com, date_com, id_post, id_u) VALUES (?, NOW(), ?, ?)";
    this.connection.query(
      query,
      [contenu_com, id_post, id_u],
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
