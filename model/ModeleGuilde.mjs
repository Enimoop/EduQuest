import createConnection from './db.mjs';

class ModeleGuilde {
    constructor() {
        this.connection = createConnection();
    }

    recupererToutesLesGuildes(callback) {
        const query = 'SELECT * FROM Guilde';
        this.connection.query(query, (error, results, fields) => {
            if (error) {
                callback(error, null);
                return;
            }
            const guildes = results.map(row => ({
                id: row.id_guilde,
                nom: row.nom_guilde,
                description: row.description_guilde,
                id_prof: row.id_prof
            }));
            callback(null, guildes);
        });
    }

    recupererGuildeParId(id, callback) {
        const query = 'SELECT * FROM Guilde WHERE id_guilde = ?';
        this.connection.query(query, [id], (error, results, fields) => {
            if (error) {
                callback(error, null);
                return;
            }
            if (results.length === 0) {
                callback(null, null); // Aucune guilde trouvée avec cet ID
                return;
            }
            const guilde = {
                id: results[0].id_guilde,
                nom: results[0].nom_guilde,
                description: results[0].description_guilde,
                id_prof: results[0].id_prof
            };
            callback(null, guilde);
        });
    }

    recupererGuildesParProf(id_prof, page, pageSize, callback) {
        const offset = (page - 1) * pageSize;
        const query = 'SELECT * FROM Guilde WHERE id_prof = ? LIMIT ? OFFSET ?';
        this.connection.query(query, [id_prof, pageSize, offset], (error, results, fields) => {
            if (error) {
                callback(error, null);
                return;
            }
            if (results.length === 0) {
                callback(null, null); // Aucune guilde trouvée avec cet ID
                return;
            }
            const guildes = results.map(row => ({
                id: row.id_guilde,
                nom: row.nom_guilde,
                description: row.description_guilde,
                id_prof: row.id_prof
            }));
            callback(null, guildes);
        });
    }

    recupererTotalGuildesProfs(id_prof, callback) {
        const query = 'SELECT COUNT(*) AS total FROM Guilde WHERE id_prof = ?';
        this.connection.query(query, [id_prof], (error, results, fields) => {
            if (error) {
                callback(error, null);
                return;
            }
            callback(null, results[0].total);
        });
    }

    recupererGuildesParEleve(id_u, page, pageSize, callback) {
        const offset = (page - 1) * pageSize;
        const query = `SELECT g.id_guilde, g.nom_guilde, g.description_guilde, u.nom AS nom_prof
                        FROM Guilde g
                        JOIN Rejoindre r ON g.id_guilde = r.id_guilde
                        JOIN User u ON g.id_prof = u.id_u
                        WHERE r.id_u = ? LIMIT ? OFFSET ?`;
        this.connection.query(query, [id_u, pageSize, offset], (error, results, fields) => {
          if (error) {
            callback(error, null);
            return;
          }
          const guildes = results.map(row => ({
            id: row.id_guilde,
            nom: row.nom_guilde,
            description: row.description_guilde,
            prof: row.nom_prof
          }));
          callback(null, guildes);
        });
      }

      recupererTotalGuildesEleves(id_u, callback) {
        const query = `SELECT COUNT(*) AS total
                        FROM Guilde g
                        JOIN Rejoindre r ON g.id_guilde = r.id_guilde
                        WHERE r.id_u = ?`;
        this.connection.query(query, [id_u], (error, results, fields) => {
          if (error) {
            callback(error, null);
            return;
          }
          callback(null, results[0].total);
        });
      }

    insertEleveDansGuilde(nouveauEleve, callback) {
        const {id, id_guilde} = nouveauEleve;
        const query = 'INSERT INTO Rejoindre (id_u, id_guilde) VALUES (?, ?)';
        const values = [id, id_guilde];
        this.connection.query(query, values, (error, results, fields) => {
            if (error) {
                callback(error, null);
                return;
            }
            callback(null,results.id_u);
        });
    }

    deleteElevefromGuilde(id, callback) {
        const query = 'DELETE FROM Rejoindre WHERE id_u = ?';
        this.connection.query(query, [id], (error, results, fields) => {
            if (error) {
                callback(error, null);
                return;
            }
            callback(null, results.affectedRows);
        });
    }

    creerGuilde(nouvelleGuilde, callback) {
        const {nom_guilde, description_guilde, id_prof} = nouvelleGuilde;
        const query = 'INSERT INTO Guilde (nom_guilde, description_guilde, id_prof) VALUES (?, ?, ?)';
        const values = [nom_guilde, description_guilde, id_prof];
        this.connection.query(query, values, (error, results, fields) => {
            if (error) {
                callback(error, null);
                return;
            }
            callback(null, results.insertId);
        });
    }

    recupererAllGuildesEleves(id_eleve, callback) {
        const query = `SELECT g.id_guilde
                        FROM Guilde g
                        JOIN Rejoindre r ON g.id_guilde = r.id_guilde
                        WHERE r.id_u = ?`;
        this.connection.query(query, [id_eleve], (error, results, fields) => {
            if (error) {
                callback(error, null);
                return;
            }
            const guildes = results.map(row => ({
                id: row.id_guilde
            }));
            callback(null, guildes);
        });
    }

    recupererAllGuildesProf(id_prof, callback) {
        const query = `SELECT g.id_guilde
                        FROM Guilde g
                        WHERE g.id_prof = ?`;
        this.connection.query(query, [id_prof], (error, results, fields) => {
            if (error) {
                callback(error, null);
                return;
            }
            const guildes = results.map(row => ({
                id: row.id_guilde
            }));
            callback(null, guildes);
        });
    }

}

export default ModeleGuilde;