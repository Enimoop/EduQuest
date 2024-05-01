import createConnection from './db.mjs';

class ModeleProfil {
  constructor() {
    this.connection = createConnection();
  }

  recupererTousLesProfils(callback) {
    const query = 'SELECT * FROM User';
    this.connection.query(query, (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      const user = results.map(row => ({
        id: row.id_u,
        mail: row.mail,
        type: row.type
      }));
      callback(null, user);
    });
  }

  recupererUnCompte(mail, callback) {
    const query = 'SELECT * FROM User WHERE mail = ?';
    this.connection.query(query, [mail], (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      if (results.length === 0) {
        callback(null, null); // Aucun user trouvé avec cet ID
        return;
      }
      const user = {
        id: results[0].id_u,
        mail: results[0].mail,
        mdp: results[0].mdp,
        type: results[0].type
      };
      callback(null, user);
    });
  }

  checkerTypeUser(id, callback) {
    const query = 'SELECT type FROM User WHERE id_u = ?';
    this.connection.query(query, [id], (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      if (results.length === 0) {
        callback(null, null); // Aucun user trouvé avec cet ID
        return;
      }
      const user = {
        type: results[0].type
      };
      callback(null, user);
    });
  }
}

export default ModeleProfil;
