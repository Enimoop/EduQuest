
import express from 'express';
import ModeleProfil from '../model/ModeleProfil.mjs';

const router = express.Router();
const modeleProfil = new ModeleProfil();
router.use(express.json());

router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;

  modeleProfil.recupererTotalProfils((error, total) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du nombre total de profils' });
      return;
    }

  modeleProfil.recupererTousLesProfils(page, pageSize,(error, profils) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des profils' });
      return;
    }
    res.json({profils, total});
  });
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
  const id = req.params.id;
  modeleProfil.recupererNoteUnCompte(id, (error, notes) => {
    if (error) {
      console.error('Error retrieving notes:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des notes' });
      return;
    }
    if (!notes || notes.length === 0) {
      res.status(404).json({ message: 'notes non trouvées' });
      return;
    }
    res.json(notes);
  });
});


router.put('/update', (req, res) => {
  const { id,mail,mdp,etablissement } = req.body;
  modeleProfil.updateProfil(id, mail, mdp, etablissement, (error, result) => {
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

router.put('/update/type', (req, res) => {
  const { id,type } = req.body;
  modeleProfil.updateType(id, type, (error, result) => {
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

router.get('/nom/:string', (req, res) => {
  const string = req.params.string;
  modeleProfil.recupererProfilParNomPrenom(string, (error, profils) => {
    if (error) {
      res.status(500).json({
          message: 'Erreur lors de la récupération des profils'
      });
      return;
  }
  res.json(profils);
  });
});

router.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  modeleProfil.deleteUser(id, (error) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression du profil' });
      return;
    }
    res.json({ message: 'Profil supprimé avec succès' });
  });
});

export default router;
