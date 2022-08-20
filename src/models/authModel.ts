/* eslint-disable @typescript-eslint/no-unused-vars */
import { Document, model, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import CustomError from '../utilities/error';
import validator from 'validator';

export interface ISession {
    pkce: string; // PKCE token (sent to server with each request)
    value: string; // Session ID (sent to client with each request)
}

export interface IJWT {
    _id: string; // userid
    name: string;
    mail: string;
    role: string;
    ses: ISession // session
}

// export interface ISessionDocument extends ISession, Document {
//     updatedAt: Date;
//     createdAt: Date;
// }

// const SessionSchema = new Schema<ISessionDocument>({
//     user: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     session: {
//         type: String,
//         required: true,
//         unique: true,
//     }
// }, { timestamps: true });

// const Session = model<ISessionDocument>('Session', SessionSchema);
// export default Session;