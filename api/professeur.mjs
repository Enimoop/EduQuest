import express from 'express';
import ModeleProfesseur from '../model/ModeleProfesseur.mjs';

const router = express.Router();
const modeleProfesseur = new ModeleProfesseur();
router.use(express.json());


router.get('/', (req, res) => {
    modeleProfesseur.recupererTousLesProfesseurs((error, professeurs) => {
      if (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des professeurs' });
        return;
      }
      res.json(professeurs);
    });
  });

  router.put('/update', (req, res) => {
    const { id,mail,mdp } = req.body;
    modeleProfesseur.updateProf(id, mail, mdp, (error, result) => {
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
  


export default router;

