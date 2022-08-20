
export interface ICustomError {
    field: string;
    status: number;
    type: string;
    message: string;
}

export default class CustomError extends Error {
    constructor(message: string | ICustomError) {
        if(typeof(message) === 'object') {
            super(JSON.stringify(message));
        } else {
            super(message);
        }
        // this.name = this.constructor.name;
        // Error.captureStackTrace(this, this.constructor);
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

// const error = new CustomError();