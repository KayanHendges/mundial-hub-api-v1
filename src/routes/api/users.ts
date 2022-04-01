import { Router } from 'express';
import Users from '../../controllers/Users/Users';

const usersRouter = Router();

usersRouter.get('/users/tray-requests', Users.trayRequests)
usersRouter.get('/users/tray-products', Users.trayProductsAmount)

export default usersRouter;