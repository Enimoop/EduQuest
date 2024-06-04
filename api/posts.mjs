import express from "express";
import ModelePosts from "../model/ModelePosts.mjs";

const router = express.Router();
const modelePost = new ModelePosts();
router.use(express.json());

router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 9;
  const titre = req.query.titre || "";
  modelePost.recupererTotalPosts(titre,(error, total) => {
    if (error) {
      res.status(500).json({
        message: "Erreur lors de la récupération du nombre total de posts",
      });
      return;
    }

  modelePost.recupererToutLesPosts(titre, page, pageSize, (error, posts) => {
    if (error) {
      res.status(500).json({
        message: "Erreur lors de la récupération des posts",
      });
      return;
    }
    res.json({posts, total});
  });
});
});

router.post("/addPost", (req, res) => {
  const contenu = req.body;
  modelePost.insererPost(contenu, (error, id) => {
    if (error) {
      res.status(500).json({
        message: "Erreur lors de l'ajout du post",
      });
      return;
    }
    res.json(contenu);
  });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  modelePost.RecupererLesPostsParId(id, (error, post) => {
    if (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération du post" });
      return;
    }
    if (!post) {
      res.status(404).json({ message: "post non trouvé" });
      return;
    }
    res.json(post);
  });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  modelePost.supprimerPost(id, (error) => {
    if (error) {
      res.status(500).json({ message: "Erreur lors de la suppression du post" });
      return;
    }
    res.json({ message: "post supprimé" });
  });
});

export default router;
