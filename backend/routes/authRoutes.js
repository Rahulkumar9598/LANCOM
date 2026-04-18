import { Router } from 'express';
import { forgotPassword, login, resetPassword, verifyOTP } from '../controllers/authController.js';
// import { protect } from '../middleware/auth.js';

const authRoutes = Router();

authRoutes.post('/login', login);
authRoutes.post('/forgot-password' ,forgotPassword)
authRoutes.post('/verify-otp',verifyOTP)
authRoutes.post('/reset-password' ,resetPassword)

export default authRoutes;