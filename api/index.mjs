import express from "express";
import cors from "cors";
import elevesRouter from "./eleves.mjs";
import professeursRouter from "./professeur.mjs";
import commentairesRouter from "./commentaires.mjs";
import postsRouter from "./posts.mjs";
import matieresRouter from "./matieres.mjs";
import contenuRouter from "./contenu.mjs";
import profilsRouter from "./profil.mjs";
import guildeRouter from "./guilde.mjs";

const app = express();
const port = 3001;

app.use(cors());

app.use("/eleves", elevesRouter);
app.use("/professeurs", professeursRouter);
app.use("/matieres", matieresRouter);
app.use("/commentaires", commentairesRouter);
app.use("/posts", postsRouter);
app.use("/contenus", contenuRouter);
app.use("/profils", profilsRouter);
app.use("/guildes", guildeRouter);

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});
