import { Document, model, Model, Schema } from 'mongoose';
import { ICustomError, CustomError } from '../utilities/error';
import bcrypt from 'bcrypt';
import {verifyChallenge} from 'pkce-challenge';


// https://www.rfc-editor.org/rfc/rfc7636#section-4.3
// https://www.rfc-editor.org/rfc/rfc6749#section-4.1.1

export interface IRequestPKCE {
    code_challenge: string; // sent by client to initiate PKCE
    code_challenge_method: string; // sent by client to initiate PKCE
    // code_authorization?: string | null; // sent by server to client, to continue PKCE
}

export interface IVerifyPKCE {
    code_authorization: string; // sent by server to client, to continue PKCE
    code_verifier: string; // sent by client with code_auth to verify.
}

interface IStorePKCE {
    code_challenge: string; // sent by client to initiate PKCE
    code_challenge_method: string; // sent by client to initiate PKCE
    code_authorization: string; // sent by server to client, to continue PKCE
}

export interface IPKCEDocument extends IStorePKCE, Document {
    updatedAt: Date;
    createdAt: Date;
}

interface PKCEModel extends Model<IPKCEDocument> {
    request(input: IRequestPKCE): Promise<string>;
    verify(input: IVerifyPKCE): Promise<boolean>;
    clear(input: string): Promise<boolean>;
}

const PKCESchema = new Schema<IPKCEDocument, PKCEModel>({
    code_challenge: {
        type: String,
        unique: true,
    },
    code_challenge_method: {
        type: String,
    },
    code_authorization:{
        type: String,
        unique: true,
    },
}, { timestamps: true });

PKCESchema.static('request', async function request(input: IRequestPKCE) {
    const {
        code_challenge,
        code_challenge_method,
    } = input;
    
    if(!code_challenge || !code_challenge_method){
        const error: ICustomError = {
            code: 400,
            type: 'Bad Request',
            message: 'code_challenge and code_challenge_method are required',
        }; throw new CustomError(error);
    }

    if(code_challenge_method !== 'S256'){
        const error: ICustomError = {
            code: 400,
            type: 'Bad Request',
            message: 'PKCE needs to use SHA256',
        };  throw new CustomError(error);
    }

    const presalt = code_challenge + code_challenge_method;
    const code_authorization = await bcrypt.hash(presalt, 12);
    // const code_url_safe = encodeURIComponent(code_encrypted);

    const newPKCE: IStorePKCE = {
        code_challenge,
        code_challenge_method,
        code_authorization,
    };

    const savedPKCE = await PKCE.create(newPKCE);

    if(!savedPKCE.code_authorization){
        const error: ICustomError = {
            code: 500,
            type: 'Internal Server Error',
            message: 'code_challenge and code_challenge_method are required',
        }; throw new CustomError(error);
    }

    return encodeURIComponent(savedPKCE.code_authorization);
});

PKCESchema.static('verify', async function verify(input: IVerifyPKCE) {
    const {
        code_authorization,
        code_verifier,
    } = input;
    const code_encrypted = decodeURIComponent(code_authorization);
    const pkceDoc = await PKCE.findOne({code_authorization: code_encrypted});
    
    if(!pkceDoc){
        const error: ICustomError = {
            code: 400,
            type: 'Bad Request',
            message: 'Your PKCE challenge was not found',
        }; throw new CustomError(error);
    }

    const isVerified = verifyChallenge(code_verifier, pkceDoc.code_challenge);
    
    if(!isVerified){
        const error: ICustomError = {
            code: 401,
            type: 'Unauthorized',
            message: 'PKCE was not able to be verified',
        }; throw new CustomError(error);
    }

    return isVerified;
});

PKCESchema.static('clear', async function clear(input: string) {
    console.log('input', input);
    if(!input){
        const error: ICustomError = {
            code: 500,
            type: 'Internal Server Error',
            message: 'Could not delete PKCE, no code_auth was provided',
        }; throw new CustomError(error);
    }

    const decoded_input = decodeURIComponent(input);
    
    await PKCE.deleteMany({code_authorization: decoded_input}).
        then(() => {
            return true;
        }).catch(() => {
            const error: ICustomError = {
                code: 404,
                type: 'Not Found',
                message: 'PKCE does not exist',
            }; throw new CustomError(error);
        });
});

const PKCE = model<IPKCEDocument, PKCEModel>('PKCE', PKCESchema);
export default PKCE;