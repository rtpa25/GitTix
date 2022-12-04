import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
    id: string;
    email: string;
}

// Attaching a currentUser property to the Request interface.
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}

export const currentUser = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    if (!req.session?.jwt) {
        return next();
    }
    try {
        const payload = jwt.verify(
            req.session.jwt,
            process.env.JWT_KEY!
        ) as UserPayload;

        req.currentUser = payload;
    } catch (error) {
        console.error(error);
    }
    return next();
};
