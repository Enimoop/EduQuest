
import express from 'express';
import ModeleProfil from '../model/ModeleProfil.mjs';

const router = express.Router();
const modeleProfil = new ModeleProfil();

router.get('/', (req, res) => {
  modeleProfil.recupererTousLesProfils((error, profils) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des profils' });
      return;
    }
    res.json(profils);
  });
});

router.get('/:mail', (req, res) => {
  const mail = req.params.mail;
  modeleProfil.recupererUnCompte(mail, (error, profil) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du compte' });
      return;
    }
    if (!profil) {
      res.status(404).json({ message: 'compte non trouvé' });
      return;
    }
    res.json(profil);
  });
});



export default router;
