import { Router } from 'express';
import Auth from '../../controllers/Auth/Auth';
import ProductController from '../../controllers/Providers/ProductController';
import ProviderController from '../../controllers/Providers/ProviderController';

const providersRouter = Router();

    providersRouter.get('/providers/list', ProviderController.getProviders)
    providersRouter.get('/providers/convert-luper', ProductController.getLuperProducts)

export default providersRouter;