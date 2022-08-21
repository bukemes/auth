
import { Request, Response } from 'express';
import {CustomError, ErrorResponse} from '../utilities/error';
import logger from '../utilities/logger';
// models
import USER, { ILogin, IUser} from '../models/userModel';
import PKCE, { IRequestPKCE, IVerifyPKCE } from '../models/pkceModel';
import SESSION, { IRefresh } from '../models/sessionModel';

const sessionOptions = {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
    sameSite: true,
    // signed: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 days
};

const tokenOptions = {
    sameSite: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
};

const expiredOptions = {
    sameSite: true,
    expires: new Date(Date.now() - 1000 * 60 * 60 * 24), // -1 days
};

const pkce = async (req: Request, res: Response) => {
    const newPKCE: IRequestPKCE = {
        code_challenge: req.query.code_challenge as string,
        code_challenge_method: req.query.code_challenge_method as string
    };

    try {
        const code_authorization: string = await PKCE.request(newPKCE);
        res
            // .header('Access-Control-Allow-Origin', '*')
            // .header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,PATCH,OPTIONS')
            // .header('Access-Control-Allow-Credentials','true')
            .status(200).json({code_authorization});
    } catch (err) {
        if (err instanceof CustomError){
            ErrorResponse(err, res);
        } else {
            logger.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        }
    }    
};

const signup = async (req: Request, res: Response) => {
    const {
        email,
        password,
        tos
    } = req.body.input;

    const newUser: IUser = {
        email,
        password,
        tos,
        role: 'user'
    };

    const verifyPKCE: IVerifyPKCE = {
        code_verifier: req.body.pkce.code_verifier as string,
        code_authorization: req.body.pkce.code_authorization as string
    };

    try {
        await PKCE.verify(verifyPKCE); // will throw error if fails
        const session = await SESSION.create_session(email);
        const token = await USER.signup(newUser);
        
        res // res.status(200).json({jwt:token});
            .cookie('token', token, tokenOptions)
            .cookie('Authorization', session, sessionOptions) // `Bearer ${token}`
            .status(200)
            .send();
    } catch (err) {
        if (err instanceof CustomError){
            ErrorResponse(err, res);
        } else {
            logger.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        }
    }
};

const login = async (req: Request, res: Response) => {
    const {
        email,
        password
    } = req.body.input;
    
    const login: ILogin = {
        email,
        password,
    };

    const verifyPKCE: IVerifyPKCE = {
        code_verifier: req.body.pkce.code_verifier as string,
        code_authorization: req.body.pkce.code_authorization as string
    };
        
    try {
        await PKCE.verify(verifyPKCE);
        const session = await SESSION.create_session(email);
        const token = await USER.login(login);
        await PKCE.clear(verifyPKCE.code_authorization);

        res
            .cookie('token', token, tokenOptions)
            .cookie('Authorization', session, sessionOptions) // `Bearer ${token}`
            .status(200)
            .send();
    } catch (err) {
        if (err instanceof CustomError){
            ErrorResponse(err, res);
        } else {
            logger.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        }
    }
};

const logout = async (req: Request, res: Response) => {
    try {
        await SESSION.remove_session(res.locals.email);
        res
            .cookie('token', '', expiredOptions)
            .cookie('Authorization', '', expiredOptions)
            .status(200)
            .send();
    } catch (err) {
        if (err instanceof CustomError){
            ErrorResponse(err, res);
        } else {
            logger.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        }
    }
};

const refresh = async (req: Request, res: Response) => {
    try {
        const refresh: IRefresh = await SESSION.refresh_session(res.locals.email, res.locals.role, req.cookies.Authorization);

        res
            .cookie('token', refresh.token, tokenOptions)
            .cookie('Authorization', refresh.Authorization, sessionOptions) // `Bearer ${token}`
            .status(200)
            .send();
    } catch (err) {
        if (err instanceof CustomError){
            ErrorResponse(err, res);
        } else {
            logger.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        }
    }
};




export {
    pkce,
    login,
    signup,
    logout,
    refresh 
};



// .header('Access-Control-Allow-Origin', '*')
// .header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,PATCH,OPTIONS')
// .header('Access-Control-Allow-Credentials','true')