import { validateRequest, BadRequestError } from '@rp-gittix/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User, UserAttrs } from '../models/user';

const router = Router();

router.post(
    '/api/users/signup',
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage('Password must be between 4 and 20 characters'),
    ],
    validateRequest,
    async (req: Request<{}, {}, UserAttrs>, res: Response) => {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new BadRequestError('Email or password not provided');
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new BadRequestError('Email in use');
        }

        const user = await User.build({ email, password }).save();

        //Generate JWT
        const userJwt = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            process.env.JWT_KEY!
        );

        //Store it on session object
        req.session = {
            jwt: userJwt,
        };

        res.status(201).send(user);
    }
);

export { router as signupRouter };
