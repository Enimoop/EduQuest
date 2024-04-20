import createConnection from './db.mjs';
import modeleMatiere from './ModeleMatiere.mjs';

class ModeleContenu {
  constructor() {
    this.connection = createConnection();
  }

  recupererTousLesContenus(callback) {
    const query = 'SELECT * from Contenu';
    this.connection.query(query, (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      const contenus = results.map(row => ({
        id: row.id_contenu,
        description_contenu: row.description_contenu,
        date_contenu: row.date_contenu,
        id_matiere: row.id_matiere,
        type_contenu: row.type_contenu
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


  recupererTousLesCours(callback) {
    const query = 'SELECT * from Cours';
    this.connection.query(query, (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      const cours = results.map(row => ({
        id: row.id_contenu,
        description_contenu: row.description_contenu,
        date_contenu: row.date_contenu,
        id_matiere: row.id_matiere,
        nom_fichier: row.nom_fichier
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

  recupererTousLesExercices(callback) {
    const query = 'SELECT * from Exercice';
    this.connection.query(query, (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      const cours = results.map(row => ({
        id: row.id_contenu,
        description_contenu: row.description_contenu,
        date_contenu: row.date_contenu,
        id_matiere: row.id_matiere,
        type_exercice: row.type_exercice
      }));
      callback(null, cours);
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

}



export default ModeleContenu;