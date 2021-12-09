import { Router } from 'express';
import Users from '../../controllers/Users/Users';

const usersRouter = Router();

usersRouter.get('/users/tray-requests', Users.trayRequests)

export default usersRouter;