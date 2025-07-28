import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    dateOfBirth?: Date;
    email: string;
    password?: string; 
    googleId?: string;  
    otp?: string;
    otpExpires?: Date;
    isVerified: boolean;
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: false },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: false },
    googleId: { type: String, unique: true, sparse: true }, 
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = model<IUser>('User', userSchema);
export default User;
