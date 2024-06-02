import express from 'express';
import ModeleGuilde from '../model/ModeleGuilde.mjs';

const router = express.Router();
const modeleGuilde = new ModeleGuilde();
router.use(express.json());

router.get('/', (req, res) => {
    modeleGuilde.recupererToutesLesGuildes((error, guildes) => {
        if (error) {
            res.status(500).json({
                message: 'Erreur lors de la récupération des guildes'
            });
            return;
        }
        res.json(guildes);
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    modeleGuilde.recupererGuildeParId(id, (error, guilde) => {
        if (error) {
            res.status(500).json({
                message: 'Erreur lors de la récupération de la guilde'
            });
            return;
        }
        if (!guilde) {
            res.status(404).json({
                message: 'Guilde non trouvée'
            });
            return;
        }
        res.json(guilde);
    });
});

router.get('/prof/:idprof', (req, res) => {
    const id_prof = req.params.idprof;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 9;

    modeleGuilde.recupererTotalGuildesProfs(id_prof, (error, total) => {
        if (error) {
            res.status(500).json({
                message: 'Erreur lors de la récupération du nombre total de guildes'
            });
            return;
        }

        modeleGuilde.recupererGuildesParProf(id_prof, page, pageSize, (error, guildes) => {
            if (error) {
                res.status(500).json({
                    message: 'Erreur lors de la récupération des guildes'
                });
                return;
            }
            res.json({
                guildes,
                total
            });
        });
    });
});

router.get('/eleve/:ideleve', (req, res) => {
    const id_eleve = req.params.ideleve;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 9;
    modeleGuilde.recupererTotalGuildesEleves(id_eleve, (error, total) => {
        if (error) {
            res.status(500).json({
                message: 'Erreur lors de la récupération du nombre total de guildes'
            });
            return;
        }

        modeleGuilde.recupererGuildesParEleve(id_eleve, page, pageSize, (error, guildes) => {
            if (error) {
                res.status(500).json({
                    message: 'Erreur lors de la récupération des guildes'
                });
                return;
            }
            res.json({
                guildes,
                total
            });
        });
    });
});

router.post('/addEleve', (req, res) => {
    const nouveauEleve = req.body;
    modeleGuilde.insertEleveDansGuilde(nouveauEleve, (error, id) => {
        if (error) {
            res.status(500).json({
                message: 'Erreur lors de l\'ajout de l\'élève dans la guilde'
            });
            return;
        }
        res.json({
            id: id
        });
    });
});

router.delete('/deleteEleve/:id', (req, res) => {
    const id = req.params.id;
    modeleGuilde.deleteElevefromGuilde(id, (error) => {
        if (error) {
            res.status(500).json({
                message: 'Erreur lors de la suppression de l\'élève de la guilde'
            });
            return;
        }
        res.json({
            message: 'Elève supprimé de la guilde'
        });
    });
});

router.post('/addGuilde', (req, res) => {
    const nouvelleGuilde = req.body;
    modeleGuilde.creerGuilde(nouvelleGuilde, (error, id) => {
        if (error) {
            res.status(500).json({
                message: 'Erreur lors de l\'ajout de la guilde'
            });
            return;
        }
        res.json({
            id: id
        });
    });
});

router.get('/all/eleve/:id', (req, res) => {
    const id = req.params.id;
    modeleGuilde.recupererAllGuildesEleves(id, (error, guildes) => {
        if (error) {
            res.status(500).json({
                message: 'Erreur lors de la récupération des guildes'
            });
            return;
        }
        res.json(guildes);
    });
});

router.get('/all/prof/:id', (req, res) => {
    const id = req.params.id;
    modeleGuilde.recupererAllGuildesProf(id, (error, guildes) => {
        if (error) {
            res.status(500).json({
                message: 'Erreur lors de la récupération des guildes'
            });
            return;
        }
        res.json(guildes);
    });
});

export default router;