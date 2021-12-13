import { Router } from 'express';
import List from '../../controllers/Categories/List';
import Page from '../../controllers/Categories/Page';

const categoriesRoutes = Router();

    categoriesRoutes.get('/categories/:id', Page.getById)
    categoriesRoutes.get('/categories/list/all', List.all)
    
    categoriesRoutes.post('/categories/', Page.createCategory)
    categoriesRoutes.post('/categories/subcategory/:parent_id', Page.createSubcategory)
    categoriesRoutes.patch('/categories/', Page.createCategory)
    categoriesRoutes.delete('/categories/:hub_id', Page.deleteCategory)

export default categoriesRoutes;