import { da, id } from 'date-fns/locale';
import createConnection from './db.mjs';

class ModeleEleve {
  constructor() {
    this.connection = createConnection();
  }

  recupererTousLesEleves(callback) {
    const query = 'SELECT * FROM User WHERE type="Eleve"';
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
    const query = 'SELECT * FROM User WHERE id_u = ?';
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

  recupererEleveParNomPrenom(string, guildeid, callback) {
    const query = `SELECT * FROM User
                  WHERE (nom LIKE ? OR prenom LIKE ?)
                  AND id_u NOT IN (SELECT id_u FROM Rejoindre WHERE id_guilde = ?) and type="Eleve"`;
    const searchString = `%${string}%`;
    this.connection.query(query, [searchString, searchString, guildeid], (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      
      const eleves = results.map(row => ({
        id: row.id_u,
        mail: row.mail,
        nom: row.nom,
        prenom: row.prenom
      }));
      callback(null, eleves);
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


  recupererElevesDansGuilde(id_guilde, page, pageSize, callback) {
    const offset = (page - 1) * pageSize;
    const query = `SELECT User.id_u, User.nom, User.prenom
    FROM User
    JOIN Rejoindre ON User.id_u = Rejoindre.id_u
    WHERE Rejoindre.id_guilde = ? LIMIT ? OFFSET ?;`;
    this.connection.query(query, [id_guilde, pageSize, offset], (error, results, fields) => {
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

recupererTotalElevesDansGuilde(id_guilde, callback) {
    const query = `SELECT count(*) as total
    FROM User
    JOIN Rejoindre ON User.id_u = Rejoindre.id_u
    WHERE Rejoindre.id_guilde = ?;`;
    this.connection.query(query, [id_guilde], (error, results, fields) => {
        if (error) {
            callback(error, null);
            return;
        }
        callback(null, results[0].total);
    });
}

  recupererNotesParGuilde(id_eleve, id_guilde, callback) {
    const query = `SELECT n.id_u AS id_eleve, n.*, c.*, g.nom_guilde, g.description_guilde
                    FROM Noter n
                    JOIN Contenu c ON n.id_contenu = c.id_contenu
                    JOIN Guilde g ON c.id_guilde = g.id_guilde
                    WHERE n.id_u = ? AND g.id_guilde = ?
                    `;
    this.connection.query(query, [id_eleve, id_guilde], (error, results, fields) => {
      if(error) {
        callback(error, null);
        return;
      }
      const notes = results.map(row => ({
        id: row.id_contenu,
        titre: row.titre_contenu,
        description: row.description_contenu,
        note: row.note,
        id_eleve: row.id_eleve,
        date: row.date_note
      }));
      callback(null, notes);
    });
  }

  recupererNotesParContenu(id, callback) {
    const query = `
        SELECT n.note, n.id_contenu, n.id_u, n.date_note, c.titre_contenu, c.description_contenu
        FROM Noter n
        JOIN Contenu c ON n.id_contenu = c.id_contenu
        WHERE n.id_u = ?
        AND YEARWEEK(n.date_note, 1) = YEARWEEK(CURDATE(), 1)
        `;
    this.connection.query(query, [id], (error, results, fields) => {
        if (error) {
            console.error('Erreur lors de l\'exécution de la requête:', error); // Ajout de log pour les erreurs SQL
            callback(error, null);
            return;
        }
        if (results.length === 0) {
            callback(null, null);
            return;
        }
        const notes_contenu = results.map(row => ({
            note: row.note,
            id_contenu: row.id_contenu,
            id_u: row.id_u,
            date_note: row.date_note,
            titre_contenu: row.titre_contenu,
            description_contenu: row.description_contenu
        }));

        callback(null, notes_contenu);
    });
}

  inscriptionEleve(nom, prenom, mail, mdp,callback) {
    const query = 'INSERT INTO User (nom, prenom, mail, mdp, niveau_etude, type) VALUES (?, ?, ?, ?, 6,"Eleve")';
    this.connection.query(query, [nom, prenom,mail, mdp], (error, results, fields) => {
      if (error) {
        callback(error, null);
        return;
      }
      callback(null, results.insertId);
    });
  }
    
  }

export default ModeleEleve;
