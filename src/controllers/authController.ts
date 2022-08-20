
import { Request, Response } from 'express';
import User, {ILogin, IUser, IUserDocument} from '../models/userModel';
import CustomError from '../utilities/error';
import logger from '../utilities/logger';
import { createJWT, } from '../utilities/utils';
// import { IJWT } from '../models/authModel';
import PKCE, { IRequestPKCE, IVerifyPKCE } from '../models/pkceModel';

const signupUser = async (req: Request, res: Response) => {
    const {
        email,
        password,
        tos
    } = req.body.input;

    const newUser: IUser = {
        email,
        password,
        tos,
        role: 'client'
    };

    const verifyPKCE: IVerifyPKCE = {
        code_verifier: req.body.pkce.code_verifier as string,
        code_authorization: req.body.pkce.code_authorization as string
    };


    try {
        await PKCE.verify(verifyPKCE); // will throw error if fails
        // logger.warn('isVerified: ' + isVerified);
        const user: IUserDocument = await User.signup(newUser);

        const data = {
            email: user.email,
            role: user.role,
        };

        const token = createJWT(data);
        
        // res
        //     .status(200)
        //     .cookie('Authorization', `Bearer ${token}`, {
        //         httpOnly: true,
        //         secure: true,
        //         sameSite: 'strict',
        //     })
        //     .json({jwt:token});

        res.status(200).json({jwt:token});
    } catch (err) {
        let message: string;
        if (err instanceof CustomError){
            message = err.message;
            res.status(400).json({ error: message });
        } else {
            logger.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        }
    }
};

const loginUser = async (req: Request, res: Response) => {
    const {
        email,
        password
    } = req.body.input;
    
    const login: ILogin = {
        email,
        password,
    };
        
    try {
        const user = await User.login(login);

        const data = {
            email: user.email,
            role: 'administrator',
            // session: '49518510-53c9-48db-925b-a75144e2a148'
        };

        const token = createJWT(data);
        res.status(200).json(token);
    } catch (err) {
        let message: string;
        if (err instanceof CustomError){
            message = err.message;
            res.status(400).json({ error: message });
        } else {
            logger.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        }
    }
};

const logoutUser = async (req: Request, res: Response) => {
    res.json({mssg: 'logout'});
};

const pkce = async (req: Request, res: Response) => {
    const newPKCE: IRequestPKCE = {
        code_challenge: req.query.code_challenge as string,
        code_challenge_method: req.query.code_challenge_method as string
    };

    try {
        const code_authorization: string = await PKCE.request(newPKCE);
        res.status(200).json({code_authorization});
    } catch (err) {
        let message: string;
        if (err instanceof CustomError){
            message = err.message;
            res.status(400).json({ error: message });
        } else {
            logger.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        }
    }    
};

export {
    loginUser,
    signupUser,
    logoutUser,
    pkce
};
