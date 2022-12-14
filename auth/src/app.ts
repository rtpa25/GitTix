import { errorHandler, NotFoundError } from '@rp-gittix/common';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

const app = express();

app.set('trust proxy', true); //traffic is proxied through ingress-nginx

app.use(express.json());

app.use(
    cookieSession({
        signed: false,
        secure: false,
    })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res, next) => {
    throw new NotFoundError();
}); // This is a wildcard route that will match any route that is not defined above.

app.use(errorHandler);

export { app };
