import { Document, model, Model, Schema } from 'mongoose';
import CustomError from '../utilities/error';
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
        throw new CustomError('code_challenge and code_challenge_method are required');
    }

    if(code_challenge_method !== 'S256'){
        throw new CustomError('PKCE needs to use SHA256');
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
        throw new CustomError('PKCE not saved');
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
        throw new CustomError('PKCE not found');
    }

    const isVerified = verifyChallenge(code_verifier, pkceDoc.code_challenge);
    
    if(!isVerified){
        throw new CustomError('PKCE not verified');
    }

    return isVerified;
});

const PKCE = model<IPKCEDocument, PKCEModel>('PKCE', PKCESchema);
export default PKCE;