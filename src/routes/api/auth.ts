import { Router } from 'express';
import Auth from '../../controllers/Auth/Auth';

const authRouter = Router();

    authRouter.post('/auth/login', Auth.login)
    authRouter.get('/auth/check-token', Auth.checkToken)
    authRouter.post('/auth/refresh-token', Auth.refreshToken)

export default authRouter;