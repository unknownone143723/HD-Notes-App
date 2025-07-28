// src/controllers/authController.ts

import { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import { sendEmail } from '../utils/mailer';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id: string) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign({ id }, secret, { expiresIn: '30d' });
};

/**
 * @desc    Step 1 (Signup): Register user details, send OTP. No password.
 */
export const signup = async (req: Request, res: Response) => {
    const { name, email, dateOfBirth } = req.body;
    if (!name || !email || !dateOfBirth) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }
    try {
        let user = await User.findOne({ email });
        if (user && user.isVerified) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        if (user) {
            user.name = name;
            user.dateOfBirth = dateOfBirth;
            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();
        } else {
            user = await User.create({ name, email, dateOfBirth, otp, otpExpires });
        }
        await sendEmail({
            to: user.email,
            subject: 'Your Verification Code',
            text: `Your verification code is: ${otp}. It is valid for 10 minutes.`,
        });
        res.status(200).json({ message: 'OTP sent to your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during signup' });
    }
};

/**
 * @desc    Step 2 (Signup): Verify OTP and finalize registration. No password.
 */
export const verifyOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }
    try {
        const user = await User.findOne({ email, otp, otpExpires: { $gt: new Date() } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id.toString()),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during OTP verification' });
    }
};

/**
 * @desc    Password login is removed.
 */
export const login = async (req: Request, res: Response) => {
    return res.status(404).json({ message: 'This endpoint is deprecated. Use OTP login.' });
};

/**
 * @desc    Step 1 (Login): Send OTP to a registered user's email.
 */
export const sendLoginOtp = async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Please provide an email address' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user || !user.isVerified) {
            return res.status(404).json({ message: 'No verified account found with this email.' });
        }
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();
        await sendEmail({
            to: user.email,
            subject: 'Your Login Code',
            text: `Your one-time code for logging in is: ${otp}. It is valid for 10 minutes.`,
        });
        res.status(200).json({ message: 'OTP sent to your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Step 2 (Login): Verify OTP and log the user in.
 */
export const verifyLoginOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }
    try {
        const user = await User.findOne({
            email,
            otp,
            otpExpires: { $gt: new Date() },
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id.toString()),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Google login remains the same and is unaffected
export const googleLogin = async (req: Request, res: Response) => {
    // ... your existing googleLogin code ...
    const { credential } = req.body;
    if (!credential) {
        return res.status(400).json({ message: 'Google credential is required.' });
    }
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(400).json({ message: 'Invalid Google credential.' });
        }
        const { sub: googleId, email, name } = payload;
        if (!email) {
            return res.status(400).json({ message: 'Email not found in Google account.' });
        }
        let user = await User.findOne({ googleId });
        if (!user) {
            user = await User.findOne({ email });
            if (user) {
                user.googleId = googleId;
                user.isVerified = true;
                await user.save();
            } else {
                user = await User.create({
                    googleId,
                    email,
                    name: name || 'Google User',
                    isVerified: true,
                });
            }
        }
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id.toString()),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during Google authentication.' });
    }
};
