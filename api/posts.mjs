import express from "express";
import ModelePosts from "../model/ModelePosts.mjs";

const router = express.Router();
const modelePost = new ModelePosts();
router.use(express.json());

router.get("/", (req, res) => {
  modelePost.recupererToutLesPosts((error, posts) => {
    if (error) {
      res.status(500).json({
        message: "Erreur lors de la récupération des posts",
      });
      return;
    }
    res.json(posts);
  });
});

router.post("/addPost", (req, res) => {
  const contenu = req.body;
  console.log(contenu);
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

export default router;