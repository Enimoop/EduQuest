import express from "express";
import ModeleCommentaires from "../model/ModeleCommentaires.mjs";

const router = express.Router();
const modeleCommentaires = new ModeleCommentaires();
router.use(express.json());

router.get("/:id", (req, res) => {
  const id = req.params.id;
  modeleCommentaires.recupererCommentaireParPostId(
    id,
    (error, commentaires) => {
      if (error) {
        res
          .status(500)
          .json({ message: "Erreur lors de la récupération des commentaires" });
        return;
      }
      res.json(commentaires);
    }
  );
});

router.post("/addCommentaire", (req, res) => {
  const contenu = req.body;
  console.log(contenu);
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
