import { Router } from 'express';
import { loginController, refreshTokenController } from './auth.controller';
import { verifyRefreshToken } from '../../middlewares/jwt';
import { validateRequest } from '../../middlewares/validation';
import validator from './auth.validator';

const authRoutes = Router();

// =========================
// POST /login
// - Handles user login
// - Validates input using validator.login
// =========================
authRoutes.post('/login', validateRequest(validator.login), loginController);

// =========================
// POST /refresh-token
// - Handles refreshing access token using a valid refresh token
// - Validates the refresh token using verifyRefreshToken middleware
// =========================
authRoutes.post('/refresh-token', verifyRefreshToken, refreshTokenController);

export default authRoutes;
