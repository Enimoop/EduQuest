import createConnection from "./db.mjs";

class ModelePosts {
  recupererToutLesPosts(callback) {
    const query = "SELECT * from Post";
    this.connection.query(query, (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      const posts = results.map((row) => ({
        id: row.id_post,
        contenu: row.contenu,
        date: row.date,
      }));
      callback(null, posts);
    });
  }

  RecupererLesPostsParId(id, callback) {
    const query = "SELECT * from Post WHERE id_post = ?";
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
        contenu: results[0].contenu,
        date: results[0].date,
      };
      callback(null, post);
    });
  }

  insererPost(contenu, callback) {
    const query =
      "INSERT INTO Post (contenu_post, date_post) VALUES (?, NOW())";
    this.connection.query(
      query,
      [contenu],
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
