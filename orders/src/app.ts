import { currentUser, errorHandler, NotFoundError } from '@rp-gittix/common';
import cookieSession from 'cookie-session';
import express from 'express';

const app = express();

app.set('trust proxy', true); //traffic is proxied through ingress-nginx

app.use(express.json());

app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test',
    })
);

app.use(currentUser);

app.all('*', async (req, res, next) => {
    throw new NotFoundError();
}); // This is a wildcard route that will match any route that is not defined above.

app.use(errorHandler);

export { app };
