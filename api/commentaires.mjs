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

export default router;
