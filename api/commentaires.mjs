import express from "express";
import ModeleCommentaires from "../model/ModeleCommentaires.mjs";

const router = express.Router();
const modeleCommentaires = new ModeleCommentaires();
router.use(express.json());

router.get("/:id", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 2;
  const id = req.params.id;
  modeleCommentaires.recupererToutCommentaire(id, (error, total) => {
    if (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des commentaires" });
      return;
    }

  modeleCommentaires.recupererCommentaireParPostId(
    id, page, pageSize,
    (error, commentaires) => {
      if (error) {
        res
          .status(500)
          .json({ message: "Erreur lors de la récupération des commentaires" });
        return;
      }
      res.json({commentaires, total});
    }
  );
});
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  modeleCommentaires.supprimerCommentaire(id, (error, affectedRows) => {
    if (error) {
      res.status(500).json({
        message: "Erreur lors de la suppression du commentaire",
      });
      return;
    }
    if (affectedRows === 0) {
      res.status(404).json({ message: "Commentaire non trouvé" });
      return;
    }
    res.json({ message: "Commentaire supprimé" });
  });
});

router.post("/addCommentaire", (req, res) => {
  const contenu = req.body;
  modeleCommentaires.insererCommentaire(contenu, (error, id) => {
    if (error) {
      res.status(500).json({
        message: "Erreur lors de l'ajout du commentaire",
      });
      return;
    }
    res.json(contenu);
  });
});

export default router;
