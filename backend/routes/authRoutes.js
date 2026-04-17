import { Router } from 'express';
import { login, getMe, forgotPassword } from '../controllers/authController.js';
// import { protect } from '../middleware/auth.js';

const authRoutes = Router();

authRoutes.post('/login', login);
authRoutes.post('/forgot-password' ,forgotPassword)

export default authRoutes;