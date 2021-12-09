import { Router } from 'express';

import productsRoutes from './api/products';

import ProductController from '../controllers/Providers/ProductController';
import ProviderController from '../controllers/Providers/ProviderController';
import authRouter from './api/auth';
import usersRouter from './api/users';
import categoriesRoutes from './api/categories';

const mainRouter = Router();

mainRouter.use(productsRoutes)
mainRouter.use(categoriesRoutes)

mainRouter.use(authRouter)
mainRouter.use(usersRouter)

mainRouter.get('/providers/list', ProviderController.getProviders)
mainRouter.get('/providers/convert-luper', ProductController.getLuperProducts)

export default mainRouter;