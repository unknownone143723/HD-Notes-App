// src/routes/authRoutes.ts

import { Router } from 'express';
import { signup, verifyOtp, sendLoginOtp, verifyLoginOtp, googleLogin } from '../controllers/authController';

const router = Router();

// Signup Routes
router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);

// Login Routes
router.post('/send-login-otp', sendLoginOtp);
router.post('/verify-login-otp', verifyLoginOtp);

// Google Auth Route
router.post('/google', googleLogin);

export default router;
