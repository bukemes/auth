import { Document, model, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import {ICustomError, CustomError} from '../utilities/error';
import validator from 'validator';
import logger from '../utilities/logger';

export interface ILogin {
    email: string;
    password: string;
}

export interface IUser extends ILogin {
    tos: boolean;
    role?: string;
    name?: string;
    pfp?: string;
}

export interface IUserDocument extends IUser, Document {
    updatedAt: Date;
    createdAt: Date;
}

interface UserModel extends Model<IUserDocument> {
  myStaticMethod(): number;
  signup(input: IUser): Promise<IUserDocument>;
  login(input: ILogin): Promise<IUserDocument>;
  logout(_id: string): string;
}

const UserSchema = new Schema<IUserDocument, UserModel>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    tos: {
        type: Boolean,
        required: true,
    },
    name: {
        type: String,
    },
    pfp: {
        type: String,
    },
}, { timestamps: true });

UserSchema.static('signup', async function signup(input: IUser) {
    // input validation
    if(!input.email || !input.password || !input.tos || !input.role) {
        const error: ICustomError = {
            code: 400,
            type: 'Bad Request',
            message: 'All fields are required',
            fields: ['email', 'password', 'tos', 'role'],
        }; throw new CustomError(error);
    }
    if(!validator.isEmail(input.email)) {
        const error: ICustomError = {
            code: 400,
            type: 'Bad Request',
            message: 'Invalid email',
            fields: ['email'],
        }; throw new CustomError(error);
    }
    // if(!validator.isStrongPassword(input.password)) {
    //     const error: ICustomError = {
    //         code: 400,
    //         type: 'Bad Request',
    //         message: 'Password not strong enough',
    //         fields: ['password'],
    //     }; throw new CustomError(error);
    // }

    // exists
    const exists = await User.findOne({ email: input.email });
    if(exists){
        // https://stackoverflow.com/questions/3825990/http-response-code-for-post-when-resource-already-exists
        const error: ICustomError = {
            code: 409,
            type: 'Conflict',
            message: 'User already exists',
            fields: ['email'],
        }; throw new CustomError(error);
    } 

    // create user 
    const salt = await bcrypt.genSalt(12); // 12 rounds minimum
    const hashedPassword = await bcrypt.hash(input.password, salt);

    const newUser: IUser = {
        email: input.email,
        password: hashedPassword,
        tos: input.tos,
        role: input.role,
    };

    return await User.create(newUser);
});

UserSchema.static('login', async function login(input: ILogin) {
    // input validation
    if(!input.email || !input.password) {
        const error: ICustomError = {
            code: 400,
            type: 'Bad Request',
            message: 'All fields are required',
            fields: ['email', 'password'],
        };  throw new CustomError(error);
    }
    if(!validator.isEmail(input.email)) {
        const error: ICustomError = {
            code: 400,
            type: 'Bad Request',
            message: 'Invalid email',
            fields: ['email'],
        }; throw new CustomError(error);
    }

    // exists?
    const user = await User.findOne({ email: input.email });
    if(!user){
        const error: ICustomError = {
            code: 400,
            type: 'Bad Request',
            message: 'User does not exist, please register',
            fields: ['email'],
        }; throw new CustomError(error);
    }

    // login user
    const isMatch = await bcrypt.compare(input.password, user.password);

    if(!isMatch){
        const error: ICustomError = {
            code: 401,
            type: 'Unauthorized',
            message: 'Invalid password',
            fields: ['password'],
        }; throw new CustomError(error);
    }

    return user;
});

const User = model<IUserDocument, UserModel>('User', UserSchema);
export default User;