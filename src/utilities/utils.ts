/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import logger from './logger';
import fs from 'fs';

function isValidID(id: any) {
    if (mongoose.Types.ObjectId.isValid(id)) {
        return true;
    } 
    return false;
}

function isValidJSON(json: any): boolean {
    if(typeof(json) !== 'string') {
        console.log(typeof(json));
        return false;
    } else {
        try {
            const x = JSON.parse(json);
            if(typeof(x) === 'object') {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

const handleBodyParserErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
        console.error(err);
        return res.status(400).send({ status: 404, message: (err as any).message }); // Bad request
    } else if (err instanceof SyntaxError && 'body' in err) {
        console.error(err);
        return res.status(500).send({ status: 500, message: 'Internal server error' }); // Internal server error
    }
    next();
};

function createJWT (input: any) {
    const data = {
        ...input
    };
    
    const token =  jwt.sign({...data}, 
        process.env.SECRET_JWT as string, 
        {expiresIn: '1d'}
    );

    return token;
}

function checkEnvVariables () {
    if (!process.env.SECRET_JWT) {
        throw new Error('JWT_SECRET is not defined');
    }
}

function generateRandomUUID () {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


export {
    isValidID,
    isValidJSON,
    handleBodyParserErrors,
    createJWT
};
