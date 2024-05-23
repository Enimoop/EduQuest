import createConnection from "./db.mjs";

class ModelePosts {
  constructor() {
    this.connection = createConnection();
  }

  recupererToutLesPosts(callback) {
    const query = "SELECT * FROM PostForum";
    this.connection.query(query, (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      const posts = results.map((row) => ({
        id: row.id_post,
        nom: results[0].nom_post,
        contenu: row.contenu_post,
        date: row.date_post,
      }));
      callback(null, posts);
    });
  }

  RecupererLesPostsParId(id, callback) {
    const query = "SELECT * from PostForum WHERE id_post = ?";
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
      };
      callback(null, post);
    });
  }

  insererPost(contenu, callback) {
    const query =
      "INSERT INTO PostForum (contenu_post, date_post) VALUES (?, NOW())";
    this.connection.query(query, [contenu], (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      callback(null, results.insertId);
    });
  }
}

export default ModelePosts;
