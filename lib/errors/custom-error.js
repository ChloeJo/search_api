export class CustomError extends Error {
    constructor(status, message, data) {
        super();
        this.status = status;
        this.message = message;
        this.data = data;
    }
}