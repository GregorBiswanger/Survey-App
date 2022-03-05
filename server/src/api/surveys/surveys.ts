import { Router } from 'express';
import * as createError from 'http-errors';
import surveysRepository from '../../db/surveys-repository';

const router = Router();

router.route('/')
    .get(async (request, response, next) => {
        try {
            const surveys = await surveysRepository.loadAll();

            response.status(200).json(surveys);
        } catch (error) {
            next(new createError.InternalServerError(error));
        }
    })
    .post(async (request, response, next) => {
        try {
            await surveysRepository.save(request.body);

            response.status(201)
                .location(`http://${request.headers.host}/api/surveys`)
                .json(request.body);
        } catch (error) {
            next(new createError.InternalServerError(error));
        }
    })
    .options((request, response) => {
        response.setHeader('Allow', 'GET,POST,OPTIONS');
        response.sendStatus(200);
    });

export default router;