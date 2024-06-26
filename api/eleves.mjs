
import express from 'express';
import ModeleEleve from '../model/ModeleEleve.mjs';

const router = express.Router();
const modeleEleve = new ModeleEleve();
router.use(express.json());

router.get('/', (req, res) => {
  modeleEleve.recupererTousLesEleves((error, eleves) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des élèves' });
      return;
    }
    res.json(eleves);
  });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  modeleEleve.recupererEleveParId(id, (error, eleve) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération de l\'élève' });
      return;
    }
    if (!eleve) {
      res.status(404).json({ message: 'Elève non trouvé' });
      return;
    }
    res.json(eleve);
  });
});

router.get('/nom/:string/guilde/:guildeid', (req, res) => {
  const string = req.params.string;
  const guildeid = req.params.guildeid;
  modeleEleve.recupererEleveParNomPrenom(string, guildeid, (error, eleves) => {
    if (error) {
      res.status(500).json({
          message: 'Erreur lors de la récupération des eleves'
      });
      return;
  }
  res.json(eleves);
  });
});

router.get('/notes/:id_matiere/:id', (req, res) => {
  const id_matiere = req.params.id_matiere; // Utilisation de id_matiere plutôt que id pour la matière
  const id = req.params.id; // Utilisation de id pour l'utilisateur
  modeleEleve.recupererNotesParMatiere(id_matiere, id, (error, notes) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des notes' });
      return;
    }
    if (!notes) {
      res.status(404).json({ message: 'Notes non trouvées' });
      return;
    }
    res.json(notes);
  });
});

router.put('/lvl' , (req, res) => {
  const { id_u, id_matiere, lvl } = req.body;

  modeleEleve.updateLvl(id_u, id_matiere, lvl, (error, eleve) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour du niveau' });
      return;
    }
    res.json(eleve);
  });
});

router.get('/lvl/:id_matiere/:id', (req, res) => {
  const id_matiere = req.params.id_matiere;
  const id = req.params.id;
  modeleEleve.getLvl(id_matiere, id, (error, lvl) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du niveau' });
      return;
    }
    if (!lvl) {
      res.status(404).json({ message: 'Niveau non trouvé' });
      return;
    }
    res.json(lvl);
  });
});

router.get('/lvl/:id', (req, res) => {
  const id = req.params.id;
  modeleEleve.lvlParMatiere(id, (error, lvl) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du niveau' });
      return;
    }
    if (!lvl) {
      res.status(404).json({ message: 'Niveau non trouvé' });
      return;
    }
    res.json(lvl);
  });
});

router.get('/guilde/:idguilde', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 9;

  modeleEleve.recupererTotalElevesDansGuilde(req.params.idguilde, (error, total) => {
      if (error) {
          res.status(500).json({
              message: 'Erreur lors de la récupération du nombre total d\'eleves'
          });
          return;
      }

  modeleEleve.recupererElevesDansGuilde(req.params.idguilde, page, pageSize, (error, eleves) => {
      if (error) {
          res.status(500).json({
              message: 'Erreur lors de la récupération des eleves'
          });
          return;
      }
      res.json({eleves, total});
  });
});
});

router.get('/guilde/:ideleve/:idguilde', (req, res) => {
  modeleEleve.recupererNotesParGuilde( req.params.ideleve,req.params.idguilde, (error, notes) => {
    if (error) {
      res.status(500).json({
          message: 'Erreur lors de la récupération des notes'
      });
      return;
    }
    res.json(notes);
  });
});

router.get('/notes/:id', (req, res) => {
  const id = req.params.id;
  modeleEleve.recupererNotesParContenu(id, (error, notes) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des notes' });
      return;
    }
    if (!notes) {
      res.status(404).json({ message: 'Notes non trouvées' });
      return;
    }
    res.json(notes);
  });
});

router.post('/new', (req, res) => {
  const { nom, prenom, mail, mdp} = req.body;
  modeleEleve.inscriptionEleve(nom, prenom, mail, mdp, (error, eleve) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la création de l\'élève' });
      return;
    }
    res.json(eleve);
  });
});

router.put('/update', (req, res) => {
  const { id,mail,mdp } = req.body;
  modeleEleve.updateEleve(id, mail, mdp, (error, result) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' });
      return;
    }
    if (result === 0) {
      res.status(404).json({ message: 'Aucun utilisateur trouvé avec cet ID' });
      return;
    }
    res.json({ message: 'Profil mis à jour avec succès' });
  });
});

// Autres routes pour la création, la mise à jour et la suppression des élèves

export default router;
