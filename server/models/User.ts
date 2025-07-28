// src/models/User.ts

import { Schema, model, Document, Types } from 'mongoose';

// **THE FIX**: Password-related fields and methods are removed.
export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    dateOfBirth?: Date;
    email: string;
    googleId?: string;
    otp?: string;
    otpExpires?: Date;
    isVerified: boolean;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: false },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    googleId: { type: String, unique: true, sparse: true },
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });

// **THE FIX**: Password hashing and comparison methods are removed as they are no longer needed.

const User = model<IUser>('User', userSchema);
export default User;
