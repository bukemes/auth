import { Request, Response, NextFunction } from 'express';
// utils
import { ICustomError } from '../utilities/error';

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if(res.locals.role !== 'admin') {
        const error: ICustomError = {
            code: 401,
            type: 'Unauthorized',
            message: 'Admin role is required.',
        };
        return res.status(error.code).json(error);
    }
    next();
};