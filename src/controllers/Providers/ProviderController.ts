import { Request, Response } from 'express';
import Products from '../../models/Providers/Products';
import Providers from '../../models/Providers/Providers';

const users = [
  { name: 'Diego', email: 'diego@rocketseat.com.br' },
];

export default {
  
  async getProviders(req: Request, res: Response) {
    const providers = new Providers

    const providerslist = await providers.getAllProviders()

    res.status(200).json({
        code: 200,
        providers_list: providerslist
    })
  },

  async productsNotLinked(req: Request, res: Response){
    const {params, query}: any = req

    if(params.provider_id != undefined && query.param){
      Products.getProductsNotLinked(parseInt(params.provider_id), query.param, query.search, res)
    } else {
      res.status(400).json({
        code: 400,
        message: 'está faltando o id do fornecedor (provider_id)'
      })
    }
  },

  async handleProductsNotLinked(req: Request, res: Response){
    const {body}: any = req

    if(body.ids != undefined && body.handleFunction != undefined){
      Products.handleProductsNotLinked(body.ids, body.handleFunction, res)
    } else {
      res.status(400).json({
        code: 400,
        message: 'está faltando os Ids ou a função a ser executada'
      })
    }
  },
};