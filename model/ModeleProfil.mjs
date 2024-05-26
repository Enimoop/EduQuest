import createConnection from './db.mjs';

class ModeleProfil {
  constructor() {
    this.connection = createConnection();
  }

  recupererTousLesProfils(page, pageSize,callback) {
    const offset = (page - 1) * pageSize;
    const query = 'SELECT * FROM User LIMIT ? OFFSET ?';
    this.connection.query(query, [pageSize, offset], (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      const user = results.map(row => ({
        id: row.id_u,
        nom: row.nom,
        prenom: row.prenom,
        mail: row.mail,
        type: row.type
      }));
      callback(null, user);
    });
  }
  
  recupererTotalProfils(callback) {
    const query = 'SELECT COUNT(*) AS total FROM User';
    this.connection.query(query, (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      callback(null, results[0].total);
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


recupererUnCompteId(id, callback) {
  const query = 'SELECT * FROM User WHERE id_u = ?';
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
      id: results[0].id_u,
      mail: results[0].mail,
      mdp: results[0].mdp,
      type: results[0].type
    };
    callback(null, user);
  });
}

updateProfil(id, mdp, mail, callback) {
  const query = 'UPDATE User SET mail = ?, mdp = ? WHERE id_u = ?';
  this.connection.query(query, [mdp, mail, id], (error, results, fields) => {
    if (error) {
      callback(error, null);
      return;
    }
    callback(null, results.affectedRows);
  });

}

updateType(id, type, callback) {
  const query = 'UPDATE User SET type = ? WHERE id_u = ?';
  this.connection.query(query, [type, id], (error, results, fields) => {
    if (error) {
      callback(error, null);
      return;
    }
    callback(null, results.affectedRows);
  });

}

recupererProfilParNomPrenom(string, callback) {
  const query = `SELECT * FROM User
                WHERE (nom LIKE ? OR prenom LIKE ?)`;
  const searchString = `%${string}%`;
  this.connection.query(query, [searchString, searchString], (error, results, fields) => {
    if (error) {
      callback(error, null);
      return;
    }
    
    const users = results.map(row => ({
      id: row.id_u,
      nom: row.nom,
      prenom: row.prenom,
      mail: row.mail,
      type: row.type,
      etablissement: row.etablissement,
      niveau_etude: row.niveau_etude
    }));
    callback(null, users);
  });
}

deleteUser(id, callback) {
  const query = 'DELETE FROM User WHERE id_u = ?';
  this.connection.query(query, [id], (error, results, fields) => {
    if (error) {
      callback(error, null);
      return;
    }
    callback(null, results.affectedRows);
  });
}
}
export default ModeleProfil;
