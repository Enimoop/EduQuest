import createConnection from './db.mjs';

class ModeleMatiere {
  constructor() {
    this.connection = createConnection();
  }


  recupererToutesLesMatieres(callback) {
    const query = 'SELECT * FROM Matiere;'
    this.connection.query(query, (error, results, fields) => {
        if (error) {
            callback(error, null);
            return;
        }
        if (results.length === 0) {
            callback(null, null); // Aucun professeur trouvé avec cet ID
            return;
        }
        const matieres = results.map(row => ({
            id: row.id_matiere,
            libelle_matiere: row.libelle_matiere,
          }));
          callback(null, matieres);
        });
    }
}

export default ModeleMatiere;