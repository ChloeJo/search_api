import { Client, errors as esErrors } from '@elastic/elasticsearch';

import config from 'config';
import { Logger } from '../logger/logger.js';
import { BadGatewayError } from '../errors/server-error.js';

const logger = Logger(import.meta.url);

const client = new Client({
    node: config.get('elasticsearch.nodes')
});

const handleError = err => {
    logger.error(`${err.name}: ${err.message}`);
    if(err instanceof esErrors.ResponseError){
        logger.error(JSON.stringify(err.meta.body.error.caused_by));
    }
    throw new BadGatewayError();
}

export const search = async params => {
    try{
        const result = await client.search(params);
        return result;
    }catch(err){
        handleError(err);
    }
}

export const msearch = async params => {
    try{
        const result = await client.msearch(params);
        return result;
    }catch(err){
        handleError(err);
    }
}

export const write = async params => {
    try{    
        const result = await client.index(params);
        return result;
    }catch(err){
        logger.error('could not index querylog');
        handleError(err);
    }
}