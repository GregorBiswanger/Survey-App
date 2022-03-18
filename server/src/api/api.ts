import { Router } from 'express';
import surveys from './surveys/surveys';
import activeSurveys from './active-surveys/active-surveys';
const router = Router();

router.use('/surveys', surveys);
router.use('/active-surveys', activeSurveys);

router.get('/', (request, response) => {
    response.status(200).json({
        surveys: `http://${request.headers.host}/api/surveys`,
        'active-surveys': `http://${request.headers.host}/api/active-surveys`
    });
});

router.options('/', (request, response) => {
    response.setHeader('Allow', 'GET,OPTIONS');
    response.sendStatus(200);
});

export default router;