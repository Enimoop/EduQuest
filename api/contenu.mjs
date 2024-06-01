import express from 'express';
import ModeleContenu from '../model/ModeleContenu.mjs';

const router = express.Router();
const modeleContenu = new ModeleContenu();
router.use(express.json());

router.get('/all/:id', (req, res) => {
  const id = req.params.id;
  modeleContenu.recupererTousLesContenus(id,(error, contenus) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des contenus' });
      return;
    }
    res.json(contenus);
  });
});

router.get('/cours/:id', (req, res) => {
  const id = req.params.id;
  modeleContenu.recupererTousLesCours(id,(error, cours) => {

    if (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des cours' });
      return;
    }
    res.json(cours);
  });

});

router.get('/cour/:id', (req, res) => {
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


router.get('/exercices/:id', (req, res) => {
  const id = req.params.id;
  modeleContenu.recupererTousLesExercices(id,(error, exercices) => {

    if (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des exercices' });
      return;
    }
    res.json(exercices);
  });

});


router.get('/exercice/:id', (req, res) => {
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

router.post('/exercices/score', (req, res) => {
  // Récupérer les données du score à partir du corps de la requête
  const score = req.body;
  // Insérer le score dans la base de données en utilisant le modèle
  modeleContenu.insertScore(score, (error) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de l\'insertion du score' });
      return;
    }
    // Renvoyer une réponse avec un message de succès
    res.status(201).json({ message: 'Score inséré avec succès' });
  });
});

router.put('/exercices/score', (req, res) => {
  // Récupérer les données du score à partir du corps de la requête
  const score = req.body;
  // Mettre à jour le score dans la base de données en utilisant le modèle
  modeleContenu.updateScore(score, (error) => {
      if (error) {
          res.status(500).json({ error: 'Erreur lors de la mise à jour du score.' });
          return;
      }
      res.json({ message: 'Score mis à jour avec succès' });
  });
});



router.get('/exercices/score/:id_u/:id_contenu', (req, res) => {
  const {id_u, id_contenu} = req.params;
  modeleContenu.recupererScoreParId(id_u, id_contenu, (error, scores) => {
      if (error) {
          res.status(500).json({ error: 'Erreur lors de la récupération des scores.' });
          return;
      }
      res.json(scores);
  });
});


router.post('/cours', (req, res) => {
  const nouveauCours = req.body;
  modeleContenu.insertNouveauCours(nouveauCours, (error, insertedId) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de l\'insertion du Cours' });
      return;
    }
    res.status(201).json({ message: 'Cours inséré avec succès', insertedId });
  });
});

router.get('/guilde/:id_guilde', (req, res) => {
  const id_guilde = req.params.id_guilde;
  modeleContenu.recupererContenusParGuilde(id_guilde, (error, contenus) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des contenus' });
      return;
    }
    res.json(contenus);
  });
});

router.get('/guilde/page/:id_guilde', (req, res) => {
  const id_guilde = req.params.id_guilde;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;

  modeleContenu.recupererTotalContenus(id_guilde, (error, total) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du total des contenus' });
      return;
    }
    modeleContenu.recupererContenusParGuildePagination(id_guilde, page, pageSize, (error, contenus) => {
      if (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des contenus' });
        return;
      }
      res.json({ contenus, total });
    });
  });
});

router.delete('/delete/exercice/:id', (req, res) => {
  const id = req.params.id;
  modeleContenu.deleteExo(id, (error) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression du contenu' });
      return;
    }
    res.json({ message: 'Contenu supprimé avec succès' });
  });
});

router.delete('/delete/cours/:id', (req, res) => {
  const id = req.params.id;
  modeleContenu.deleteCours(id, (error) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression du contenu' });
      return;
    }
    res.json({ message: 'Contenu supprimé avec succès' });
  });
});

router.put('/update/exo', (req, res) => {
  const exo = req.body;
  modeleContenu.updateExo(exo, (error) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour du contenu' });
      return;
    }
    res.json({ message: 'Contenu mis à jour avec succès' });
  });
});


router.put('/update/cours', (req, res) => {
  const cours = req.body;
  modeleContenu.updateCours(cours, (error) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour du contenu' });
      return;
    }
    res.json({ message: 'Contenu mis à jour avec succès' });
  });
});

router.put('/update/question', (req, res) => {
  const question = req.body;
  modeleContenu.updateQuestion(question, (error) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour de la question' });
      return;
    }
    res.json({ message: 'Question mise à jour avec succès' });
  });
});


router.delete('/delete/question/:id', (req, res) => {
  const id = req.params.id;
  modeleContenu.deleteQuestion(id, (error) => {
    if (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression du contenu' });
      return;
    }
    res.json({ message: 'Contenu supprimé avec succès' });
  });
});

export default router;
