import { Router } from 'express';
import * as createError from 'http-errors';
import activeSurveysRepository from '../../db/active-surveys-repository';

const router = Router();

router.route('/')
    .options((request, response) => {
        response.setHeader('Allow', 'GET,OPTIONS');
        response.sendStatus(200);
    });

router.get('/', async (request, response, next) => {
    try {
        if(request.query.surveyId) {
            const activeSurvey = await activeSurveysRepository.loadFromSurveyId(request.query.surveyId as string);

            response.status(200).json(activeSurvey);
        } else {
            response.sendStatus(400);
        }

    } catch (error) {
        next(new createError.InternalServerError(error));
    }
});

router.get('/:connectCode', async (request, response, next) => {
    try {
        const activeSurvey = await activeSurveysRepository.load(request.params.connectCode);

        response.status(200).json(activeSurvey);
    } catch (error) {
        next(new createError.InternalServerError(error));
    }
})


export default router;



// api/surveys

// api/active-surveys/007423
// api/active-surveys/127423
// api/active-surveys/connect/007423