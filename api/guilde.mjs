import express from 'express';
import ModeleGuilde from '../model/ModeleGuilde.mjs';

const router = express.Router();
const modeleGuilde = new ModeleGuilde();

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

router.get('/prof/:idprof', (req, res) => {
    modeleGuilde.recupererGuildeParProf(req.params.idprof, (error, guildes) => {
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