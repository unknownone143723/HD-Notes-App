// src/routes/authRoutes.ts

import { Router } from 'express';
import { signup, verifyOtp, login, sendLoginOtp, verifyLoginOtp } from '../controllers/authController';

const router = Router();

// Signup Routes
router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);

// Login Routes
router.post('/login', login); // For password login
router.post('/send-login-otp', sendLoginOtp); // For OTP login step 1
router.post('/verify-login-otp', verifyLoginOtp); // For OTP login step 2

export default router;
