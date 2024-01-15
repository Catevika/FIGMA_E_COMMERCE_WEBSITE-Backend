import express from 'express';
import { loginUser } from '../controllers/authController.js';
import { logoutUser } from '../controllers/logoutController.js';
import { handleRefreshToken } from '../controllers/refreshTokenController.js';
import { registerUser } from '../controllers/registerController.js';
import { getAllUsers } from '../controllers/userController.js';

const router = express.Router();

router.get('/refresh', handleRefreshToken);

router.post('/signup', registerUser);
router.post('/signin', loginUser);

router.get('/users', getAllUsers);
router.get('/logout', logoutUser);

export default router;