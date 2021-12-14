import { Router } from 'express';
import Auth from '../../controllers/Auth/Auth';
import List from '../../controllers/Products/List';
import ProductController from '../../controllers/Providers/ProductController';
import ProviderController from '../../controllers/Providers/ProviderController';

const providersRouter = Router();

    providersRouter.get('/providers/list', ProviderController.getProviders)
    providersRouter.get('/providers/link/:provider_id', ProviderController.productsNotLinked)
    providersRouter.get('/providers/convert-luper', ProductController.getLuperProducts)
    providersRouter.get('/providers/link-products', List.listToLinkProviders)

export default providersRouter;