import morgan from 'morgan';
import { Logger } from './logger.js';

const logger = Logger(import.meta.url);

// morgan 로그 개행 
const stream = {
    write: message => {
        logger.info(message);
    }
}

// morgan 로그 스킵 여부
const skip = (_, res)=> {
    if(res.req.url === '/querylog'){
        return true;
    }
    return false;
}

// morgan middleware type
const morganMiddleware = morgan(
    ':method :url :status', { stream, skip }
);

export default morganMiddleware