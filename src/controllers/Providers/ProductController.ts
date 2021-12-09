import { Request, Response } from 'express';
import SaveProducts from '../../models/Providers/SaveProducts';
import ConvertProducts from '../../services/Providers/ConvertProducts';

export default {
  
  async getLuperProducts(req: Request, res: Response) {
    const convertProducts = new ConvertProducts
    const products = convertProducts.luperText('luper_products.txt')

    const saveProducts = new SaveProducts
    const success = await saveProducts.saveProductsDB(products.products, 2)

    return res.status(200).json({success, products: products.products});
  },
};