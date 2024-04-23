import express from 'express';
import cors from 'cors';
import elevesRouter from './eleves.mjs';
import professeursRouter from './professeur.mjs';
import matieresRouter from './matieres.mjs';
import contenuRouter from './contenu.mjs';
import profilsRouter from './profil.mjs';

const app = express();
const port = 3001;

app.use(cors());

app.use('/eleves', elevesRouter);
app.use('/professeurs', professeursRouter);
app.use('/matieres', matieresRouter);
app.use('/contenus', contenuRouter);
app.use('/profils', profilsRouter);

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});