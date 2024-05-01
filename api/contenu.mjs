import express from 'express';
import ModeleContenu from '../model/ModeleContenu.mjs';

const router = express.Router();
const modeleContenu = new ModeleContenu();
router.use(express.json());

router.get('/', (req, res) => {
  modeleContenu.recupererTousLesContenus((error, contenus) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des contenus' });
      return;
    }
    res.json(contenus);
  });
});

router.get('/cours', (req, res) => {
  modeleContenu.recupererTousLesCours((error, cours) => {

    if (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des cours' });
      return;
    }
    res.json(cours);
  });

});

router.get('/cours/:id', (req, res) => {
  const id = req.params.id;
  modeleContenu.recupererCoursParId(id, (error, cours) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du cours' });
      return;
    }
    if (!cours) {
      res.status(404).json({ message: 'Cours non trouvé' });
      return;
    }
    res.json(cours);
  });
});


router.get('/exercices', (req, res) => {
  modeleContenu.recupererTousLesExercices((error, exercices) => {

    if (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des exercices' });
      return;
    }
    res.json(exercices);
  });

});


router.get('/exercices/:id', (req, res) => {
  const id = req.params.id;
  modeleContenu.recupererExerciceEtQuestionParId(id, (error, questions) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du quiz' });
      return;
    }
    if (!questions) {
      res.status(404).json({ message: 'Quiz non trouvé' });
      return;
    }
    res.json(questions);
  });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  modeleContenu.recupererContenuParId(id, (error, contenu) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du contenu' });
      return;
    }
    if (!contenu) {
      res.status(404).json({ message: 'Contenu non trouvé' });
      return;
    }
    res.json(contenu);
  });
});

router.post('/exercices', (req, res) => {
  // Récupérer les données du nouveau quiz/exercice à partir du corps de la requête
  const nouveauQuiz = req.body;

  // Insérer le nouveau quiz/exercice dans la base de données en utilisant le modèle
  modeleContenu.insertNouveauQuiz(nouveauQuiz, (error, insertedId) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de l\'insertion du quiz/exercice' });
      return;
    }
    // Renvoyer une réponse avec l'ID du quiz/exercice nouvellement inséré
    res.status(201).json({ message: 'Quiz/exercice inséré avec succès', insertedId });
  });
});

router.post('/exercices/question', (req, res) => {
  // Récupérer les données de la nouvelle question à partir du corps de la requête
  const nouvelleQuestion = req.body;

  // Insérer la nouvelle question dans la base de données en utilisant le modèle
  modeleContenu.insertQuestion(nouvelleQuestion, (error, insertedId) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de l\'insertion de la question' });
      return;
    }
    // Renvoyer une réponse avec l'ID de la question nouvellement insérée
    res.status(201).json({ message: 'Question insérée avec succès', insertedId });
  });
});



export default router;
