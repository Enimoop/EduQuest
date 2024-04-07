import express from 'express';
import ModeleMatiere from '../model/ModeleMatiere.mjs';

const router = express.Router();
const modeleMatiere = new ModeleMatiere();



router.get('/', (req, res) => {
    modeleMatiere.recupererToutesLesMatieres((error, matieres) => {
      if (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des matieres' });
        return;
      }
      res.json(matieres);
    });
  });



export default router;

