import express from 'express';
import cors from 'cors';
import elevesRouter from './eleves.mjs';
import professeursRouter from './professeur.mjs';
import matieresRouter from './matieres.mjs';

const app = express();
const port = 3001;

app.use(cors());

app.use('/eleves', elevesRouter);
app.use('/professeurs', professeursRouter);
app.use('/matieres', matieresRouter);

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});