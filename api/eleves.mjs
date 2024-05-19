
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
  modeleEleve.recupererElevesDansGuilde(req.params.idguilde, (error, eleves) => {
      if (error) {
          res.status(500).json({
              message: 'Erreur lors de la récupération des eleves'
          });
          return;
      }
      res.json(eleves);
  });
});
// Autres routes pour la création, la mise à jour et la suppression des élèves

export default router;
