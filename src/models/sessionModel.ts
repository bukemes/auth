import { Document, model, Model, Schema } from 'mongoose';
import { ICustomError, CustomError } from '../utilities/error';
import { v4 as uuidv4 } from 'uuid';
import { createJWT } from '../utilities/utils';
import logger from '../utilities/logger';
export interface ISession {
    email: string; // sent by client to initiate PKCE
    session: string; // sent by client to initiate PKCE
}

export interface IRefresh {
    token: string;
    Authorization: string;
}

export interface ISessionDocument extends ISession, Document {
    updatedAt: Date;
    createdAt: Date;
}

export interface SessionModel extends Model<ISessionDocument> {
    create_session(email: string): Promise<string>;
    remove_session(email: string): Promise<boolean>;
    verify_session(email: string, session: string): Promise<boolean>;
    refresh_session(email: string, role: string, session: string): Promise<IRefresh>;
}

const SessionSchema = new Schema<ISessionDocument, SessionModel>({
    email: {
        type: String,
    },
    session: {
        type: String,
    }
}, { timestamps: true });

SessionSchema.static('create_session', async function create_session(email: string) {
    
    if(!email){
        const error: ICustomError = {
            code: 500,
            type: 'Internal Server Error',
            message: 'Could not create session, no email was provided',
        }; throw new CustomError(error);
    }

    const sessionId = uuidv4();

    const newSession: ISession = {
        email,
        session: sessionId,
    };

    try {
        const savedSession = await SESSION.create(newSession);
        return savedSession.session;
    } catch (err) {
        logger.error(err);
        const error: ICustomError = {
            code: 500,
            type: 'Internal Server Error',
            message: 'Could not create session'
        }; throw new CustomError(error);
    }
});

SessionSchema.static('remove_session', async function remove_session(email: string) {
    
    if(!email){
        const error: ICustomError = {
            code: 500,
            type: 'Internal Server Error',
            message: 'Could not delete a session, no email was provided',
        }; throw new CustomError(error);
    }
    
    await SESSION.deleteMany({email: email}).
        then(() => {
            return true;
        }).catch(() => {
            const error: ICustomError = {
                code: 404,
                type: 'Not Found',
                message: 'Session does not exist',
            }; throw new CustomError(error);
        });
});

SessionSchema.static('verify_session', async function verify_session(email: string, session: string) {
    
    await SESSION.findOne({session: session})
        .then((storedSession) => {
            if (!storedSession) {
                const error: ICustomError = {
                    code: 404,
                    type: 'Not Found',
                    message: 'Session does not exist',
                }; throw new CustomError(error);
            } else {
                return isMatch(storedSession.session, session);
            }
        })
        .catch(() => {
            const error: ICustomError = {
                code: 500,
                type: 'Internal Server Error',
                message: 'Something went wrong in SessionScheme.static.validate_session',
            }; throw new CustomError(error);
        });   
        
    function isMatch(input: string, challenge: string): boolean {
        return input === challenge;
    }
});

SessionSchema.static('refresh_session', async function refresh_session(email: string, role: string, session: string) {
    if(!email || !session){
        const error: ICustomError = {
            code: 400,
            type: 'Bad Request',
            message: 'Could not refresh session, some values missing',
        }; throw new CustomError(error);
    }

    await SESSION.deleteMany({email});

    const sessionId = uuidv4();

    const newSession: ISession = {
        email,
        session: sessionId,
    };

    const tokenData = {
        email,
        role
    };

    const token = createJWT(tokenData);
    
    try {
        const savedSession = await SESSION.create(newSession);

        const refresh: IRefresh = {
            token,
            Authorization: savedSession.session,
        };
        
        return refresh;
    } catch (err) {
        const error: ICustomError = {
            code: 500,
            type: 'Internal Server Error',
            message: 'Could not store session',
        }; throw new CustomError(error);
    }
});

const SESSION = model<ISessionDocument, SessionModel>('Session', SessionSchema);
export default SESSION;


