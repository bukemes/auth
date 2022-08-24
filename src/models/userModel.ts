import { Document, model, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import {ICustomError, CustomError} from '../utilities/error';
import validator from 'validator';
import { createJWT } from '../utilities/utils';

// import logger from '../utilities/logger';

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
  signup(input: IUser): Promise<string>;
  login(input: ILogin): Promise<string>;
  logout(email: string): string;
  refresh(session: string, token: object): Promise<string>;
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
    if(!input.tos){
        const error: ICustomError = {
            code: 400,
            type: 'Bad Request',
            message: 'TOS is required',
            fields: ['tos'],
        }; throw new CustomError(error);
    }

    if(!input.email || !input.password || !input.role) {
        const error: ICustomError = {
            code: 400,
            type: 'Bad Request',
            message: 'All fields are required',
            fields: ['email', 'password', 'role'],
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
    const exists = await USER.findOne({ email: input.email });
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
        password: hashedPassword, // store the HASHED password
        tos: input.tos,
        role: input.role,
    };

    const savedUser: IUserDocument = await USER.create(newUser);

    const tokenData = {
        email: savedUser.email,
        role: savedUser.role,
    };
    const token = createJWT(tokenData);

    return token;
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
    const user = await USER.findOne({ email: input.email });
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

    const tokenData = {
        email: user.email,
        role: user.role,
    };

    const token = createJWT(tokenData);

    return token;
});

const USER = model<IUserDocument, UserModel>('User', UserSchema);
export default USER;