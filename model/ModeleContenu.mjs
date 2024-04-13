import createConnection from './db.mjs';
import modeleMatiere from './ModeleMatiere.mjs';

class ModeleContenu {
  constructor() {
    this.connection = createConnection();
  }

  recupererTousLesContenus(callback) {
    const query = 'SELECT * from Contenu c, Matiere m where c.id_matiere = m.id_matiere';
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
        libelle_matiere: row.libelle_matiere
      }));
      callback(null, contenus);
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



}

export default ModeleContenu;