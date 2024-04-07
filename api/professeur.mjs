import express from 'express';
import ModeleProfesseur from '../model/ModeleProfesseur.mjs';

const router = express.Router();
const modeleProfesseur = new ModeleProfesseur();



router.get('/', (req, res) => {
    modeleProfesseur.recupererTousLesProfesseurs((error, professeurs) => {
      if (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des professeurs' });
        return;
      }
      res.json(professeurs);
    });
  });



export default router;

