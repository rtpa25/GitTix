import { currentUser, errorHandler, NotFoundError } from '@rp-gittix/common';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import { createChargeRouter } from './routes/new';

const app = express();

app.set('trust proxy', true); //traffic is proxied through ingress-nginx

app.use(express.json());

app.use(
    cookieSession({
        signed: false,
        secure: false,
    })
);

app.use(currentUser);

app.use(createChargeRouter);

app.all('*', async (req, res, next) => {
    throw new NotFoundError();
}); // This is a wildcard route that will match any route that is not defined above.

app.use(errorHandler);

export { app };
