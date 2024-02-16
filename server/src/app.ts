import express from 'express';
import bodyParser from 'body-parser';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';

const app: express.Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

app.use(errorHandler);

export default app;