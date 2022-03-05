import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";

export default function handleErrors(error: HttpError, request: Request, response: Response, next: NextFunction) {
    const isDevelopment = request.app.get('env') === 'development';

    response.status(error.status || 500).json({
        message: error.message,
        stack: isDevelopment ? error.stack : {}
    });
}