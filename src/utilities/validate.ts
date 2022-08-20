/* eslint-disable @typescript-eslint/no-explicit-any */
// validate request against a schema.
import {Request, Response, NextFunction} from 'express';
import { AnyZodObject } from 'zod';
import logger from './logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        logger.error(error);
        return res.status(400).json(error.message);
    }
};

export {validate};