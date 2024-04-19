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


    recupererContenusParMatiere(id,callback) {
      const query = 'SELECT * from Contenu c, Matiere m where c.id_matiere = m.id_matiere and m.id_matiere = ?';
      this.connection.query(query,[id], (error, results, fields) => {
        if (error) {
          callback(error, null);
          return;
        }
        if (results.length === 0) {
          callback(null, null); // Aucun contenu dans cette matière
          return;
        }
        const contenus_matière = results.map(row => ({
          id: row.id_contenu,
          description_contenu: row.description_contenu,
          date_contenu: row.date_contenu,
          id_matiere: row.id_matiere,
          libelle_matiere: row.libelle_matiere,
          type_contenu: row.type_contenu
        }));
  
  
        callback(null, contenus_matière);
      });
    }

    recupererLibelleMatiereParId(id, callback) {
      const query = 'SELECT libelle_matiere FROM Matiere WHERE id_matiere = ?';
      this.connection.query(query, [id], (error, results, fields) => {
          if (error) {
              callback(error, null);
              return;
          }
          if (results.length === 0) {
              callback(null, null); // Aucune matière trouvée avec cet ID
              return;
          }
          const libelle_matiere = results[0].libelle_matiere;
          callback(null, libelle_matiere);
      });
  }
}

export default ModeleMatiere;