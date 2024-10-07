import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@goticket/common';

const app = express();
// make sure express knows that we are using customized cookie session beyond ingress nginx
app.set('trust proxy', true);

app.use(json());

app.use(
  cookieSession({
    // disable encryption in the cookie
    signed: false,
    // require cookie only be used if user is visiting on https connection
    // set secure to true when it's in dev/prod environment
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
