import express from 'express';
import ModeleMatiere from '../model/ModeleMatiere.mjs';

const router = express.Router();
const modeleMatiere = new ModeleMatiere();



router.get('/', (req, res) => {
  modeleMatiere.recupererToutesLesMatieres((error, matieres) => {
    if (error) {
      res.status(500).json({
        message: 'Erreur lors de la récupération des matieres'
      });
      return;
    }
    res.json(matieres);
  });
});


router.get('/:idm/:id', (req, res) => {
  const idm = req.params.idm;
  const id = req.params.id;
  modeleMatiere.recupererContenusParMatiere(id,idm, (error, contenus_matiere) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des contenus' });
      return;
    }
    if (!contenus_matiere) {
      res.status(404).json({ message: 'contenu non trouvé' });
      return;
    }
    res.json(contenus_matiere);
  });
});


export default router;