import { Router } from 'express';
import List from '../../controllers/Products/List';
import ProductController from '../../controllers/Providers/ProductController';
import ProviderController from '../../controllers/Providers/ProviderController';

const providersRouter = Router();

    providersRouter.get('/providers/list', ProviderController.getProviders)

    providersRouter.get('/providers/convert-product/local', ProductController.ConvertProductsLocal)
    providersRouter.get('/providers/convert-product/luper', ProductController.ConvertProductsLuper)
    providersRouter.get('/providers/convert-product/roddar', ProductController.ConvertProductsRoddar)
    
    providersRouter.get('/providers/link/:provider_id', ProviderController.productsNotLinked)
    providersRouter.get('/providers/link-products', List.listToLinkProviders)
    providersRouter.post('/providers/link-products', ProviderController.handleProductsNotLinked)
    
    providersRouter.get('/providers/products/list/:provider_id', ProductController.listProviderProducts)
    providersRouter.get('/providers/products/', ProductController.providerProductsByRef)
    providersRouter.post('/providers/products/edit', ProductController.editProviderProduct)

export default providersRouter;