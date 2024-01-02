import { CustomError } from '../errors/custom-error.js';
import { InternalServiceError } from '../errors/server-error.js';
import { Logger } from '../logger/logger.js';

const logger = Logger(import.meta.url);

export const errorHandler = (err, req, res, next) => {
    if(!res){
        logger.error('Undefined req object');
        process.exit(1);
    }

    const reqUrl = decodeURI(req.url);
    const reqBody = JSON.stringify(req.body);

    logger.error(`${reqUrl}\nreq.body: ${reqBody}\n${err.stack}`);

    if(err instanceof CustomError){
        const status = err.status ? err.status : 500;
        return res.status(status).json(err);
    }

    const internalServiceError = new InternalServiceError('Internal Service Error');
    logger.error(err);
    return res.status(500).json(internalServiceError);
}