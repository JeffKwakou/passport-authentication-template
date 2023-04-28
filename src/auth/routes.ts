import express, { Request, Response} from 'express';
import { check } from 'express-validator';
import { validate } from '../middlewares/validate.middleware';
import { login, register, verify } from './auth.controller';
import { authenticate } from '../middlewares/authenticate.middleware';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.status(200).send("You've reached the auth route");
});

router.post('/login', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').exists()
], validate, login);

router.post('/register', [
    check('email', 'Email is required').isEmail(),
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty()
], validate, register);

router.get('/verify/:token', verify);

router.get('/user', authenticate, (req: Request, res: Response) => {
    res.status(200).json(req.body.user)
});

export { router as authRoutes };