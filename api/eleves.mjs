
import express from 'express';
import ModeleEleve from '../model/ModeleEleve.mjs';

const router = express.Router();
const modeleEleve = new ModeleEleve();

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

// Autres routes pour la création, la mise à jour et la suppression des élèves

export default router;
