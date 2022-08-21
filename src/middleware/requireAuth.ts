import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// utils
import { ICustomError } from '../utilities/error';
import logger from '../utilities/logger';
// models
import USER from '../models/userModel';
import SESSION from '../models/sessionModel';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const { Authorization, token } = req.cookies;
    
    if(!Authorization || !token) { // !authorization || 
        const error: ICustomError = {
            code: 401,
            type: 'Unauthorized',
            message: 'Authorization & Token are required.',
        }; 
        return res.status(error.code).json(error);
    }

    
    interface JwtPayload {
        email: string
        role: string
    }

    try {
        const SECRET_JWT = process.env.SECRET_JWT as string;
        const { email, role } = jwt.verify(token, SECRET_JWT) as JwtPayload;
        await SESSION.verify_session(email, Authorization);

        // pass decoded JWT to next middleware or function
        res.locals.user = await USER.findOne({ email }).select('-password');
        res.locals.email = res.locals.user.email;
        res.locals.role = role;
        next();
    } catch (err) {
        const error: ICustomError = {
            code: 401,
            type: 'Unauthorized',
            message: 'Invalid Credentials.',
        };
        logger.error(error);
        return res.status(error.code).json(error);
    }
};
