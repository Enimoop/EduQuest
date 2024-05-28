import createConnection from './db.mjs';

class ModeleProfesseur {
  constructor() {
    this.connection = createConnection();
  }

  recupererTousLesProfesseurs(callback) {
    const query = 'SELECT * FROM Prof';
    this.connection.query(query, (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      const professeur = results.map(row => ({
        id: row.id_u,
        nom: row.nom,
        prenom: row.prenom,
        classe: row.diplome
      }));
      callback(null, professeur);
    });
  }

  recupererUnProfesseurEtSesGuildes(callback) {
    const query = 'SELECT * FROM Guilde g, Prof p  where p.id_u = g.id_prof and p.id_u = ?';
    this.connection.query(query, (error, results, fields) => {
        if (error) {
            callback(error, null);
            return;
        }
        if (results.length === 0) {
            callback(null, null); // Aucun professeur trouvé avec cet ID
            return;
        }
        const professeur = results.map(row => ({
            id: row.id_u,
            nom: row.nom,
            prenom: row.prenom,
            nom_guilde: row.nom_guilde,
          }));
          callback(null, professeur);
        });
    }

}

export default ModeleProfesseur;