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
        body('username')
            .trim()
            .notEmpty()
            .withMessage('Username must be valid')
            .isLength({ min: 2, max: 20 })
            .withMessage('Username must be between 2 and 20 characters'),
        body('password')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage('Password must be between 4 and 20 characters'),
    ],
    validateRequest,
    async (req: Request<{}, {}, UserAttrs>, res: Response) => {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            throw new BadRequestError(
                'Email or password or username not provided'
            );
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new BadRequestError('Email in use');
        }

        const user = await User.build({ email, password, username }).save();

        //Generate JWT
        const userJwt = jwt.sign(
            {
                id: user.id,
                email: user.email,
                username: user.username,
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
