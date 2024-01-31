import express from 'express';
import { loginUser } from '../controllers/authController.js';
import { logoutUser } from '../controllers/logoutController.js';
import { handleRefreshToken } from '../controllers/refreshTokenController.js';
import { registerUser } from '../controllers/registerController.js';
import { deleteUser, getAllUsers, getUserDetails, updateUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/refresh', handleRefreshToken);

router.post('/signup', registerUser);
router.post('/signin', loginUser);

router.get('/users', getAllUsers);
router.route('/logout').get(logoutUser);
router.route('/users/:username').get(getUserDetails).put(updateUser).delete(deleteUser);

export default router;