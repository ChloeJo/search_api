import { CustomError } from './custom-error.js';

export class BadGatewayError extends CustomError{
    constructor(data){
        super(502, 'Bad Gateway Error', data);
    }
}

export class InternalServiceError extends CustomError{
    constructor(data){
        super(500, 'Internal Service Error', data);
    }
}

// module.exports = {
//     BadGatewayError,
//     InternalServiceError
// }