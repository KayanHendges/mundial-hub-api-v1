import { Request, Response } from 'express';
import Products from '../../models/Providers/Products';
import SaveProducts from '../../models/Providers/SaveProducts';
import ConvertProducts from '../../services/Providers/ConvertProducts';

export default {
  
  async ConvertProductsLuper(req: Request, res: Response) {
    const products = ConvertProducts.luperText('luper_products.txt')

    await SaveProducts.saveProductsDB(products.products, 2, res)

  },

  async ConvertProductsRoddar(req: Request, res: Response) {

    const products = ConvertProducts.roddarText('roddar_hankook_products.txt')

    await SaveProducts.saveProductsDB(products.products, 3, res)
  },

  
  async listProviderProducts(req: Request, res: Response){

    const {params, query}: any = req

    if(params.provider_id != undefined && query.search != undefined){
      Products.listByProviders(parseInt(params.provider_id), query.search, res)
    } else {
      res.status(400).json({
        code: 400,
        message: 'está faltando o id do fornecedor (provider_id) ou parâmetro de pesquisa'
      })
    }

  },
};