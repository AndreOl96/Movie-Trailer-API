import { Router } from "express";
import { check } from 'express-validator';
import UserController from "../controllers/UserController.js";
const router = Router();
router.get('/users', UserController.getAllUsers);
router.get('/users/:id', UserController.getUserById);
router.post('/register', [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Invalid email format'),
    check('password').isStrongPassword()
        .withMessage(`minLength: 8, minLowercase: 1,
        minUppercase: 1, minNumbers: 1, minSymbols: 1`),
    check('role').isIn(['USER', 'ADMIN']).withMessage('Invalid role')
], UserController.registerUser);
router.post('/login', [
    check('email').isEmail().withMessage('Invalid email format'),
    check('password').isLength({ min: 6 })
        .withMessage('Password should be at least 6 chars long')
], UserController.loginUser);
router.delete('/users/:id', UserController.deleteUser);
export default router;
//# sourceMappingURL=userRouter.js.map