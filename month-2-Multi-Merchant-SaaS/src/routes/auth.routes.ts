import { Router } from 'express';
import { register, login, refresh, logout } from '../controllers/auth.controller';

const router = Router();

// Endpoint mapping for user authentication and session management
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
