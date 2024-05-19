import createConnection from "./db.mjs";
import ModelePosts from "./ModelePosts.mjs";

class ModelePosts {
  constructor() {
    this.connection = createConnection();
  }

  recupererCommentaireParPostId(id, callback) {
    const query = "SELECT * from Commentaire WHERE id_post = ?";
    this.connection.query(query, [id], (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      const commentaires = results.map((row) => ({
        id: row.id_commentaire,
        contenu: row.contenu,
        date: row.date,
        id_post: row.id_post,
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

export default ModelePosts;
