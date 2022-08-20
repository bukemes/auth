import { Document, model, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import CustomError from '../utilities/error';
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

    logger.warn('userModel.signup', input);

    // input validation
    if(!input.email || !input.password || !input.tos || !input.role) {
        // const error = new CustomError('test');
        // console.log(error instanceof Error);
        // console.log(error instanceof CustomError);
        throw new CustomError('All fields are required');
    }
    if(!validator.isEmail(input.email)) {
        throw new CustomError('Invalid email');
    }
    // if(!validator.isStrongPassword(input.password)) {
    //     throw new CustomError('Password not strong enough');
    // }

    // exists
    const exists = await User.findOne({ email: input.email });
    if(exists){
        throw new CustomError('User already in use');
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
    // const createdUser = await User.create(newUser);
    // return createdUser;
});

UserSchema.static('login', async function login(input: ILogin) {
    // input validation
    if(!input.email || !input.password) {
        throw new CustomError('All fields are required');
    }
    if(!validator.isEmail(input.email)) {
        throw new CustomError('Invalid email');
    }

    // exists?
    const user = await User.findOne({ email: input.email });
    if(!user){
        throw new CustomError('User does not exist, please register');
    }

    // login user
    const isMatch = await bcrypt.compare(input.password, user.password);

    if(!isMatch){
        throw new CustomError('Invalid password');
    }

    return user;
});

const User = model<IUserDocument, UserModel>('User', UserSchema);
export default User;