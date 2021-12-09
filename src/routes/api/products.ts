import { Router } from 'express';
import List from '../../controllers/Products/List';
import Page from '../../controllers/Products/Page';

const productsRoutes = Router();

    productsRoutes.get('/products/list', List.list)
    productsRoutes.get('/products/list/kits/:reference', List.kitsByRef)
    productsRoutes.post('/products/update-images/:reference', List.updateImages)

    productsRoutes.get('/products/page/:reference', Page.unitary)
    productsRoutes.get('/products/page/kits/:reference', Page.kits)
    productsRoutes.get('/products/page/categories/list', Page.categories)
        
export default productsRoutes;