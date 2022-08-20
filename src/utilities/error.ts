export default class CustomError extends Error {
    constructor(message: string) {
        super(message);
        // this.name = this.constructor.name;
        // Error.captureStackTrace(this, this.constructor);
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

// const error = new CustomError();