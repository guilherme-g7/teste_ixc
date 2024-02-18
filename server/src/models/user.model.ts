import mongoose, { Schema, model } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password: string;
    rememberMe: boolean;
    emailVerified: boolean;
    createdAt: Date;
    lastLoginAt: Date | null;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    rememberMe: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    lastLoginAt: { type: Date, default: null }
});

const UserModel = mongoose.model('UserModel', UserSchema);
export default UserModel;