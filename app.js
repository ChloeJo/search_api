import http from 'http';
import cors from 'cors';
import config from 'config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import { promises as fs } from 'fs';

import morganMiddleware from './lib/logger/morgan.js';
import { NotFoundError } from './lib/errors/client-error.js';
import { errorHandler } from './lib/utils/error-handler.js'
import { router as gatewayRouter } from './routes/gateway/index.js';
import searchRouter from './routes/search/index.js';
import { Logger } from './lib/logger/logger.js';

const logger = Logger(import.meta.url);
const swaggerDoc = await fs.readFile('./lib/swagger/swagger-output.json');

const app = express();
app.set('port', config.app.port);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morganMiddleware);

// ======================================================================
logger.info(`PORT: ${config.get('app.port')}`);
logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);
logger.info(`NODE_CONFIG_ENV: ${config.util.getEnv('NODE_CONFIG_ENV')}`);
logger.info(`Elasticsearch HOST: ${config.get('elasticsearch.nodes')}`);
// ======================================================================

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(JSON.parse(swaggerDoc)));
app.use('/search', searchRouter);
app.use('/gateway', gatewayRouter);

// 위 3개의 url 요청이 아닌 경우 Not Found Error throw
app.use((req, res, next) => {
    next(new NotFoundError(`Cannot ${req.method} ${req.path}`));
});

app.use(errorHandler);

process.on('uncaughtException', err => {
    logger.error(`uncaughtException ${JSON.stringify(err)}`);
    process.exit(1);
});

process.on('unhandledRejection', reason => {
    logger.error(`unhandledRejection ${JSON.stringify(reason)}`);
    process.exit(1);
});

http.createServer(app).listen(app.get('port'));


