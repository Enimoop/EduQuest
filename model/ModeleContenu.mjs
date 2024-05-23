import createConnection from './db.mjs';
import modeleMatiere from './ModeleMatiere.mjs';

class ModeleContenu {
  constructor() {
    this.connection = createConnection();
  }

  recupererTousLesContenus(id,callback) {
    const query = `SELECT c.*,
                  g.nom_guilde,
                  g.description_guilde
                  FROM Contenu c
                  LEFT JOIN Rejoindre r ON c.id_guilde = r.id_guilde
                  LEFT JOIN User u ON c.id_u = u.id_u
                  LEFT JOIN Guilde g ON c.id_guilde = g.id_guilde
                  WHERE (r.id_u = ? OR u.type = 'Admin')`;
    this.connection.query(query, [id], (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      const contenus = results.map(row => ({
        id: row.id_contenu,
        description_contenu: row.description_contenu,
        date_contenu: row.date_contenu,
        id_matiere: row.id_matiere,
        id_guilde: row.id_guilde,
        type_contenu: row.type_contenu,
        nom_guilde: row.nom_guilde
      }));
      callback(null, contenus);
    });
  }


  


  recupererContenuParId(id, callback) {
    const query = 'SELECT id_contenu, description_contenu, date_contenu, c.id_matiere, libelle_matiere, type_contenu FROM Contenu c, Matiere m WHERE c.id_matiere = m.id_matiere AND id_contenu = ?';
    this.connection.query(query, [id], (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      if (results.length === 0) {
        callback(null, null); // Aucun contenu trouvé avec cet ID
        return;
      }
      const contenu = {
        id: results[0].id_contenu,
        description_contenu: results[0].description_contenu,
        date_contenu: results[0].date_contenu,
        id_matiere: results[0].id_matiere,
        libelle_matiere: results[0].libelle_matiere,
        type_contenu: results[0].type_contenu

      };
      callback(null, contenu);
    });
  }


  recupererTousLesCours(id,callback) {
    const query = `SELECT c.*,
                  g.nom_guilde,
                  g.description_guilde
                  FROM Cours c
                  LEFT JOIN Rejoindre r ON c.id_guilde = r.id_guilde
                  LEFT JOIN User u ON c.id_u = u.id_u
                  LEFT JOIN Guilde g ON c.id_guilde = g.id_guilde
                  WHERE (r.id_u = ? OR u.type = 'Admin')`;
    this.connection.query(query, [id],(error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      const cours = results.map(row => ({
        id: row.id_contenu,
        description_contenu: row.description_contenu,
        date_contenu: row.date_contenu,
        id_matiere: row.id_matiere,
        id_guilde: row.id_guilde,
        nom_fichier: row.nom_fichier,
        nom_guilde: row.nom_guilde
      }));
      callback(null, cours);
    });
  }


  recupererCoursParId(id, callback) {
    const query = 'SELECT id_contenu, description_contenu, date_contenu, c.id_matiere, libelle_matiere, nom_fichier FROM Cours c, Matiere m WHERE c.id_matiere = m.id_matiere AND id_contenu = ?';
    this.connection.query(query, [id], (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      if (results.length === 0) {
        callback(null, null); // Aucun contenu trouvé avec cet ID
        return;
      }
      const cours = {
        id: results[0].id_contenu,
        description_contenu: results[0].description_contenu,
        date_contenu: results[0].date_contenu,
        id_matiere: results[0].id_matiere,
        libelle_matiere: results[0].libelle_matiere,
        nom_fichier: results[0].nom_fichier

      };
      callback(null, cours);
    });
  }

  recupererTousLesExercices(id,callback) {
    const query = `SELECT e.*,
                  g.nom_guilde,
                  g.description_guilde
                  FROM Exercice e
                  LEFT JOIN Rejoindre r ON e.id_guilde = r.id_guilde
                  LEFT JOIN User u ON e.id_u = u.id_u
                  LEFT JOIN Guilde g ON e.id_guilde = g.id_guilde
                  WHERE (r.id_u = ? OR u.type = 'Admin')`;
    this.connection.query(query, [id], (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      const exos = results.map(row => ({
        id: row.id_contenu,
        description_contenu: row.description_contenu,
        date_contenu: row.date_contenu,
        id_matiere: row.id_matiere,
        id_guilde: row.id_guilde,
        type_exercice: row.type_exercice,
        nom_guilde: row.nom_guilde
      }));
      callback(null, exos);
    });
  }


  recupererExerciceEtQuestionParId(id, callback) {
    const query = 'SELECT id_question, e.id_contenu, description_contenu, date_contenu, e.id_matiere, libelle_matiere, intitule, type_exercice, reponse FROM Exercice e, Matiere m, Question q WHERE e.id_matiere = m.id_matiere AND e.id_contenu = q.id_contenu and e.id_contenu = ?';
    this.connection.query(query, [id], (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
    
      const questions = results.map(row => ({
        id: row.id_question,
        id_contenu: row.id_contenu,
        description_contenu: row.description_contenu,
        date_contenu: row.date_contenu,
        id_matiere: row.id_matiere,
        libelle_matiere: row.libelle_matiere,
        intitule: row.intitule,
        type_exercice: row.type_exercice,
        reponse: row.reponse

      }));
      callback(null, questions);
    });
  }


  insertNouveauQuiz(nouveauQuiz, callback) {
    const {description_contenu, date_contenu, id_matiere, id_u, id_guilde} = nouveauQuiz;
    const query = 'INSERT INTO Exercice (description_contenu, date_contenu, id_matiere, id_u,id_guilde, type_exercice) VALUES (?, ?, ?, ?, ?,?)';
    const values = [description_contenu, date_contenu, id_matiere, id_u,id_guilde, "QCM"];
    this.connection.query(query, values, (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      // Récupérer l'ID de l'exercice nouvellement inséré
      const insertedId = results.insertId;
      callback(null, insertedId);
    });
  }

  insertQuestion(question, callback) {
    const {intitule, reponse,id_contenu} = question;
    const query = 'INSERT INTO Question (intitule, reponse,id_contenu) VALUES (?, ?, ?)';
    const values = [intitule, reponse,id_contenu];
    this.connection.query(query, values, (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      // Récupérer l'ID de la question nouvellement insérée
      const insertedId = results.insertId;
      callback(null, insertedId);
    });
  }

  insertScore(score, callback) {
    const {id_u, id_contenu, note} = score;
    const query = 'INSERT INTO Noter (id_u, id_contenu, note, date_note) VALUES (?, ?, ?, curdate())';
    const values = [id_u, id_contenu, note];
    this.connection.query(query, values, (error, results, fields) => {
      if (error) {
        callback(error);
        return;
      }   
      callback(null);
    });
  }

  updateScore(score, callback) {
    const {id_u, id_contenu, note} = score;
    const query = 'UPDATE Noter SET note = ?, date_note = curdate() WHERE id_u = ? AND id_contenu = ?';
    const values = [note, id_u, id_contenu];
    this.connection.query(query, values, (error, results, fields) => {
      if (error) {
        callback(error);
        return;
      }   
      callback(null);
    });
  }

  recupererScoreParId(id_u, id_contenu, callback) {
    const query = 'SELECT id_u, id_contenu, note, date_note FROM Noter WHERE  id_u = ? AND id_contenu = ? ';
    this.connection.query(query, [id_u, id_contenu], (error, results, fields) => {
        if (error) {
            callback(error, null);
            return;
        }
        const scores = results.map(row => ({
            id_u: row.id_u,
            id_contenu: row.id_contenu,
            note: row.note,
          date_note: row.date_note
      }));
      callback(null, scores);
    });
}


insertNouveauCours(nouveauCours, callback) {
  const {description_contenu, date_contenu, id_matiere, id_u, id_guilde, nom_fichier} = nouveauCours;
  const query = 'INSERT INTO Cours (description_contenu, date_contenu, id_matiere, id_u,  id_guilde, nom_fichier) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [description_contenu, date_contenu, id_matiere, id_u, id_guilde, nom_fichier];
  this.connection.query(query, values, (error, results, fields) => {
    if (error) {
      callback(error, null);
      return;
    }
    // Récupérer l'ID de l'exercice nouvellement inséré
    const insertedId = results.insertId;
    callback(null, insertedId);
  });

}

recupererContenusParGuilde(id_guilde, callback) {
  const query = `SELECT c.*, g.nom_guilde, g.description_guilde
                  FROM Contenu c
                  JOIN Guilde g ON c.id_guilde = g.id_guilde
                  WHERE c.id_guilde = ?`;
  this.connection.query(query, [id_guilde], (error, results, fields) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (results.length === 0) {
      callback(null, null); // Aucun contenu trouvé avec cet ID
      return;
    }
    const contenu = results.map(row => ({
      id: row.id_contenu,
      description_contenu: row.description_contenu,
      date_contenu: row.date_contenu,
      id_matiere: row.id_matiere,
      id_guilde: row.id_guilde,
      type_contenu: row.type_contenu,
      nom_guilde: row.nom_guilde,
      description_guilde: row.description_guilde
    }));
    callback(null, contenu);
  });

}

deleteContenu(id, callback) {
  const query = 'DELETE FROM Contenu WHERE id_contenu = ?';
  this.connection.query(query, [id], (error, results, fields) => {
    if (error) {
      callback(error);
      return;
    }
    callback(null);
  });
}
}


export default ModeleContenu;