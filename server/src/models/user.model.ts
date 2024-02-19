import mongoose, {Schema, model} from "mongoose";
import {hash} from "bcryptjs";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    rememberMe: boolean;
    emailVerified: boolean;
    createdAt: Date;
    lastLoginAt: Date | null;
}

const UserSchema = new mongoose.Schema<IUser>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, select: false},
    emailVerified: {type: Boolean, default: false},
    rememberMe: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now},
    lastLoginAt: {type: Date, default: null}
});

UserSchema.pre('save', async function (next) {
    this.password = await hash(this.password, 10);
    next();
});

const UserModel = mongoose.model('UserModel', UserSchema);
export default UserModel;