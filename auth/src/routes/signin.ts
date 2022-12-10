import { BadRequestError, validateRequest } from '@rp-gittix/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { Password } from '../utils/password';

const router = Router();

router.post(
    '/api/users/signin',
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage('Password must be between 4 and 20 characters')
            .notEmpty()
            .withMessage('Password is required'),
    ],
    validateRequest,
    async (
        req: Request<{}, {}, { email: string; password: string }>,
        res: Response
    ) => {
        const { email, password } = req.body;

        /*----------  Check if user exists ----------*/

        const existingUser = await User.findOne({ email });

        /*----------  If user does not exist, throw an error ----------*/
        if (!existingUser) {
            throw new BadRequestError('Invalid credentials');
        }

        /*---------- Check if password is correct ----------*/
        const passwordsMatch = await Password.compare(
            existingUser.password,
            password
        );

        /*---------- If password is incorrect, throw an error ----------*/
        if (!passwordsMatch) {
            throw new BadRequestError('Invalid credentials');
        }

        /*---------- If both are true, send back a JWT ----------*/

        //Generate JWT
        const userJwt = jwt.sign(
            {
                id: existingUser.id,
                email: existingUser.email,
                username: existingUser.username,
            },
            process.env.JWT_KEY!
        );

        //Store it on session object
        req.session = {
            jwt: userJwt,
        };

        res.status(200).send(existingUser);
    }
);

export { router as signinRouter };
