import { Request, Response } from 'express';
import Products from '../../models/Providers/Products';
import SaveProducts from '../../models/Providers/SaveProducts';
import ConvertProducts from '../../services/Providers/ConvertProducts';

export default {
  
  async ConvertProductsLocal(req: Request, res: Response) {
    const products = await ConvertProducts.localStock()

    await SaveProducts.saveProductsDBLocal(products.products, 1, res)

  },

  async ConvertProductsLuper(req: Request, res: Response) {
    const products = ConvertProducts.luperText('luper_products.txt')

    await SaveProducts.saveProductsDB(products.products, 2, res)

  },

  async ConvertProductsRoddar(req: Request, res: Response) {

    const hankook = ConvertProducts.roddarText('roddar_hankook_products.txt')
    const laufenn = ConvertProducts.roddarText('roddar_laufenn_products.txt')
    const imports = ConvertProducts.roddarImportsText('roddar_imports_products.txt')
    const products = {
      products: hankook.products.concat(laufenn.products, imports.products)
    }

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

  async providerProductsByRef(req: Request, res: Response){

    const {query}: any = req

    if(query.provider_id != undefined && query.product_reference != undefined){
      Products.getProviderProductByRef(query.provider_id, query.product_reference, res)
    } else {
      res.status(400).json({
        code: 400,
        message: 'está faltando o id do fornecedor (provider_id) ou o id do produto'
      })
    }

  },
  
  async editProviderProduct(req: Request, res: Response){
    const {query}: any = req

    if(query.providerId != undefined && query.productId != undefined 
      && query.field != undefined && query.value != undefined){
        Products.editProviderProduct(query.providerId, query.productId , query.field, query.value, res)
    } else {
      res.status(400).json({
        code: 400,
        message: 'está faltando parametros'
      })
    }
    
  }
};