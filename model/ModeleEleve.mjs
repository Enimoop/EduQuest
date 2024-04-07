import createConnection from './db.mjs';

class ModeleEleve {
  constructor() {
    this.connection = createConnection();
  }

  recupererTousLesEleves(callback) {
    const query = 'SELECT * FROM Eleve';
    this.connection.query(query, (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      const eleves = results.map(row => ({
        id: row.id_u,
        nom: row.nom,
        prenom: row.prenom
      }));
      callback(null, eleves);
    });
  }

  recupererEleveParId(id, callback) {
    const query = 'SELECT * FROM eleve WHERE id_u = ?';
    this.connection.query(query, [id], (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      if (results.length === 0) {
        callback(null, null); // Aucun élève trouvé avec cet ID
        return;
      }
      const eleve = {
        id: results[0].id_u,
        nom: results[0].nom,
        prenom: results[0].prenom,
        niveau: results[0].niveau
      };
      callback(null, eleve);
    });
  }

  // Autres méthodes pour créer, mettre à jour et supprimer des élèves
}

export default ModeleEleve;
