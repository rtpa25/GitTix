import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (
    err: CustomError,
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    res.status(err.statusCode).send({
        errors: err.serializeErrors(),
    });

    return next();
};
