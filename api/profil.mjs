
import express from 'express';
import ModeleProfil from '../model/ModeleProfil.mjs';
import { ro } from 'date-fns/locale';

const router = express.Router();
const modeleProfil = new ModeleProfil();
router.use(express.json());

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


router.get('/id/:id', (req, res) => {
  const id = req.params.id;
  modeleProfil.recupererUnCompteId(id, (error, profil) => {
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

router.get('/type/:id', (req, res) => {
  const id = req.params.id;
  modeleProfil.checkerTypeUser(id, (error, profil) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du type de compte' });
      return;
    }
    if (!profil) {
      res.status(404).json({ message: 'compte non trouvé' });
      return;
    }
    res.json(profil);
  });
});

router.get('/notes/:id', (req, res) => {
  console.log('GET /notes/:id called'); // Vérifiez que la route est atteinte
  const id = req.params.id;
  modeleProfil.recupererNoteUnCompte(id, (error, notes) => {
    if (error) {
      console.error('Error retrieving notes:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des notes' });
      return;
    }
    if (!notes || notes.length === 0) {
      console.log('No notes found for user:', id);
      res.status(404).json({ message: 'notes non trouvées' });
      return;
    }
    console.log('Notes retrieved:', notes);
    res.json(notes);
  });
});


router.put('/update', (req, res) => {
  const { id,mail,mdp } = req.body;
  console.log("API")
  console.log(id,mail,mdp)
  modeleProfil.updateProfil(id, mail, mdp, (error, result) => {
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
