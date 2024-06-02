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
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 12;

  modeleMatiere.recupererTotalContenuParMatiere(id,idm, (error, total) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du total des contenus' });
      return;
    }
    modeleMatiere.recupererContenusParMatiere(id,idm, page, pageSize, (error, contenus_matiere) => {
      if (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des contenus' });
        return;
      }
      res.json({
        contenus_matiere,
        total
      });
    });
  });

});


export default router;