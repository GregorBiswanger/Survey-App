import { Router } from 'express';
import surveys from './surveys/surveys';
const router = Router();

router.use('/surveys', surveys);

router.get('/', (request, response) => {
    response.status(200).json({
        surveys: `http://${request.headers.host}/api/surveys`
    });
});

router.options('/', (request, response) => {
    response.setHeader('Allow', 'GET,OPTIONS');
    response.sendStatus(200);
});

export default router;