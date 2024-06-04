import createConnection from "./db.mjs";

class ModelePosts {
  constructor() {
    this.connection = createConnection();
  }

  recupererToutLesPosts(titre, page, pageSize, callback) {
    const offset = (page - 1) * pageSize;
    const query = `
    SELECT p.id_post, p.nom_post, p.contenu_post, p.date_post, u.nom AS nom_user, u.prenom AS prenom_user
    FROM PostForum p
    JOIN User u ON p.id_u = u.id_u
    WHERE p.nom_post LIKE ? LIMIT ? OFFSET ?`;
    this.connection.query(query, [`%${titre}%`, pageSize, offset], (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      const posts = results.map((row) => ({
        id: row.id_post,
        nom: row.nom_post,
        contenu: row.contenu_post,
        date: row.date_post,
        eleve: {
          nom: row.nom_user,
          prenom: row.prenom_user,
        },
      }));
      callback(null, posts);
    });
  }

  recupererTotalPosts(titre, callback) {
    const query = "SELECT COUNT(*) AS total FROM PostForum WHERE nom_post LIKE ?";
    this.connection.query(query, [`%${titre}%`], (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      callback(null, results[0].total);
    });
  }

  RecupererLesPostsParId(id, callback) {
    const query = `
    SELECT p.id_post, p.nom_post, p.contenu_post, p.date_post, u.nom AS nom_user, u.prenom AS prenom_user
    FROM PostForum p
    JOIN User u ON p.id_u = u.id_u
    WHERE p.id_post = ?`;
    this.connection.query(query, [id], (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      if (results.length === 0) {
        callback(null, null);
        return;
      }
      const post = {
        id: results[0].id_post,
        nom: results[0].nom_post,
        contenu: results[0].contenu_post,
        date: results[0].date_post,
        eleve: {
          nom: results[0].nom_user,
          prenom: results[0].prenom_user,
        },
      };
      callback(null, post);
    });
  }

  insererPost(contenu, callback) {
    const { nom_post, contenu_post, id_u } = contenu;

    const query =
      "INSERT INTO PostForum (nom_post, contenu_post, id_u, date_post) VALUES (?, ?, ?, NOW())";
    this.connection.query(
      query,
      [nom_post, contenu_post, id_u],
      (error, results, fields) => {
        if (error) {
          callback(error, null);
          return;
        }
        callback(null, results.insertId);
      }
    );
  }

  supprimerPost(id, callback) {
    const query = "DELETE FROM PostForum WHERE id_post = ?";
    this.connection.query(query, [id], (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      callback(null, results.affectedRows > 0);
    });
  }
}

export default ModelePosts;
