import { Router } from 'express';
import Create from '../../controllers/Products/Create';
import List from '../../controllers/Products/List';
import Page from '../../controllers/Products/Page';

const productsRoutes = Router();

    productsRoutes.get('/products/list', List.list)
    productsRoutes.get('/products/list/kits/:reference', List.kitsByRef)
    productsRoutes.post('/products/update-images/:reference', List.updateImages)

    productsRoutes.get('/products/page/:reference', Page.unitary)
    productsRoutes.get('/products/page/kits/:reference', Page.kits)
    productsRoutes.get('/products/page/categories/list', Page.categories)

    productsRoutes.get('/products/reference', Page.lastReference)
    productsRoutes.get('/products/model-suggestion', Page.modelSuggestion)
    
    productsRoutes.post('/products/page/', Page.create) // excluir depois
    productsRoutes.post('/products/page/kits', Page.createKits)
    productsRoutes.patch('/products/:reference', Page.edit)
    productsRoutes.delete('/products/:reference', Page.delete)
 
    // create 
    productsRoutes.post('/products/create/unitary', Create.unitary)
    productsRoutes.post('/products/create/pricing', Create.pricing)
    productsRoutes.post('/products/create/pricing/kit', Create.kitPricingRule)

    productsRoutes.post('/products/create/unitary-tray', Create.unitaryTray)
    productsRoutes.post('/products/create/kit-tray', Create.kitTray)

    // productsRoutes.get('/products/delete-tray', List.deleteNoStockTray)
            
export default productsRoutes;