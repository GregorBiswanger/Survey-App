import { Router } from 'express';
import * as createError from 'http-errors';
import activeSurveysRepository from '../../db/active-surveys-repository';

const router = Router();

router.route('/:connectCode')
    .get(async (request, response, next) => {
        try {
            const activeSurvey = await activeSurveysRepository.load(request.params.connectCode);

            response.status(200).json(activeSurvey);
        } catch (error) {
            next(new createError.InternalServerError(error));
        }
    })
    .options((request, response) => {
        response.setHeader('Allow', 'GET,OPTIONS');
        response.sendStatus(200);
    });

export default router;