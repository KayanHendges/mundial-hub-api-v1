import { Router } from 'express';
import Create from '../../controllers/Products/Create';
import Edit from '../../controllers/Products/Edit';
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
    
    productsRoutes.post('/products/page/kits', Page.createKits) // excluir depois
    productsRoutes.patch('/products/:reference', Page.edit)
    productsRoutes.delete('/products/:reference', Page.delete)

    // get

    productsRoutes.get('/product/unitary', List.unitary)
 
    // create 
    productsRoutes.post('/products/create/unitary', Create.unitary)
    productsRoutes.post('/products/create/pricing', Create.pricing)
    productsRoutes.post('/products/create/pricing/kit', Create.kitPricingRule)

    productsRoutes.post('/products/create/unitary-tray', Create.unitaryTray)
    productsRoutes.post('/products/create/kit-tray', Create.kitTray)

    // edit 
    productsRoutes.post('/product/edit/unitary', Edit.unitary)

    // productsRoutes.get('/products/delete-tray', List.deleteNoStockTray)
            
export default productsRoutes;