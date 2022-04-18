import { Router } from 'express';
import Create from '../../controllers/Products/Create';
import Delete from '../../controllers/Products/Delete';
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

    productsRoutes.get('/products/unitary/:reference', List.unitary)
    productsRoutes.get('/products/kits/:reference', List.kits)

    productsRoutes.get('/products/unitary-by-tray-id', List.unitaryByTrayId) // temporário para uso da api v2
 
    // create 
    productsRoutes.post('/products/create/unitary', Create.unitary)
    productsRoutes.post('/products/create/pricing', Create.pricing)
    productsRoutes.post('/products/create/pricing/kit', Create.kitPricingRule)

    productsRoutes.post('/products/create/unitary-tray', Create.unitaryTray)
    productsRoutes.post('/products/create/kit-tray', Create.kitTray)

    // edit 
    productsRoutes.post('/products/edit/unitary', Edit.unitary)
    productsRoutes.post('/products/edit/pricing', Edit.pricing)
    productsRoutes.post('/products/edit/pricing/kit', Edit.kitPricingRules)

    productsRoutes.post('/products/edit/unitary-tray', Edit.unitaryTray)
    productsRoutes.post('/products/edit/kit-tray', Edit.kitTray)

    // delete
    productsRoutes.post('/products/delete/kit', Delete.kit)

    productsRoutes.post('/products/delete/unitary-tray', Delete.unitaryTray)
    productsRoutes.post('/products/delete/kit-tray', Delete.kitTray)
            
export default productsRoutes;