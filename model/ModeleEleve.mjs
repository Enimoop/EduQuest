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
    const query = 'SELECT * FROM Eleve WHERE id_u = ?';
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

  recupererNotesParMatiere(id_matiere, id_u, callback) {
    const query = `SELECT Matiere.libelle_matiere, Noter.note, Noter.id_u, Noter.date_note
                   FROM Matiere
                   JOIN Contenu ON Matiere.id_matiere = Contenu.id_matiere
                   JOIN Noter ON Contenu.id_contenu = Noter.id_contenu
                   WHERE Matiere.id_matiere = ? AND Noter.id_u = ?`;
    this.connection.query(query, [id_matiere, id_u], (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      if (results.length === 0) {
        callback(null, null); // Aucune note trouvée avec cet ID
        return;
      }
      const notes = results.map(row => ({
        note: row.note,
        id_u: row.id_u,
        id_matiere: id_matiere, // Utilisation de la variable id_matiere passée en paramètre
        libelle_matiere: row.libelle_matiere,
        date_note: row.date_note
      }));
      callback(null, notes);
    });
  }

  updateLvl(id_u, id_matiere, lvl, callback) {
    const query = 'UPDATE Concerner SET lvl = ? WHERE id_u = ? AND id_matiere = ?';
    this.connection.query(query, [lvl, id_u, id_matiere], (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      callback(null, results.affectedRows);
    });
  }

  getLvl(id_matiere, id_u, callback) {
    const query = 'SELECT lvl, id_u FROM Concerner WHERE id_u = ? AND id_matiere = ?';
    this.connection.query(query, [id_u, id_matiere], (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      if (results.length === 0) {
        callback(null, null); // Aucun niveau trouvé avec cet ID
        return;
      }
      const lvl = {
        lvl: results[0].lvl,
        id_u: results[0].id_u
      };
      callback(null, lvl);
    });
  }

  lvlParMatiere( id_u, callback) {
    const query = `SELECT Matiere.libelle_matiere,Matiere.id_matiere, Concerner.lvl, Concerner.id_u
                  FROM Matiere
                  JOIN Concerner ON Matiere.id_matiere = Concerner.id_matiere
                  WHERE Concerner.id_u = ?`;
    this.connection.query(query, [id_u], (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      if (results.length === 0) {
        callback(null, null); // Aucun niveau trouvé avec cet ID
        return;
      }
      const lvl = results.map(row => ({
        lvl: row.lvl,
        id_u: id_u,
        id_matiere: row.id_matiere,
        libelle_matiere: row.libelle_matiere
      }));
      callback(null, lvl);
    });
  }


  recupererElevesDansGuilde(id_guilde, callback) {
    const query = `SELECT Eleve.id_u, Eleve.nom, Eleve.prenom
    FROM Eleve
    JOIN Rejoindre ON Eleve.id_u = Rejoindre.id_u
    WHERE Rejoindre.id_guilde = ?`;
    this.connection.query(query, [id_guilde], (error, results, fields) => {
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
  // Autres méthodes pour créer, mettre à jour et supprimer des élèves
}

export default ModeleEleve;
