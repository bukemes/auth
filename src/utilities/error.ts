import { Response } from 'express';

export interface ICustomError {
    code: number; // HTTP status code
    type: string; // Error type
    message: string; // Error message
    fields?: Array<string>; // Optional field that caused the error
}

export class CustomError extends Error {
    constructor(message: ICustomError) {
        super(JSON.stringify(message));
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

export const ErrorResponse = (err: CustomError, res: Response) => {
    const error = JSON.parse(err.message);
    res.status(error.code).json(error);
};