import express from 'express';
import ModeleContenu from '../model/ModeleContenu.mjs';

const router = express.Router();
const modeleContenu = new ModeleContenu();

router.get('/', (req, res) => {
  modeleContenu.recupererTousLesContenus((error, contenus) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des contenus' });
      return;
    }
    res.json(contenus);
  });
});


router.get('/:id', (req, res) => {
    const id = req.params.id;
    modeleContenu.recupererContenusParMatiere(id, (error, contenus_matiere) => {
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
