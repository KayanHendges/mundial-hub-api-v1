import { Router } from 'express';

import productsRoutes from './api/products';

import authRouter from './api/auth';
import usersRouter from './api/users';
import categoriesRoutes from './api/categories';
import freightRouter from './api/freight';
import providersRouter from './api/providers';
import temp from '../models/temp';

const mainRouter = Router();

mainRouter.use(productsRoutes)
mainRouter.use(categoriesRoutes)

mainRouter.use(authRouter)
mainRouter.use(usersRouter)

mainRouter.use(providersRouter)
mainRouter.use(freightRouter)

export default mainRouter;