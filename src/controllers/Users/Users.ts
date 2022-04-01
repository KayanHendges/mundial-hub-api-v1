import { Request, Response } from 'express';
import Users from '../../models/Users/Users';

export default {
  
  async trayRequests(req: Request, res: Response) {
    
    Users.getCountRequestsTray(res)
  },

  async trayProductsAmount(req: Request, res: Response) {
    
    const { store_id } = req.query

    if(store_id){
      try {
        const products = await Users.getProductsAmount(parseInt(store_id as string))
        res.status(200).json({
          code: 200,
          products: {
            total: products.total
          }
        })
      }
      catch (erro) {
        res.status(404).json({
          code: 404,
          message: erro
        })
      }
      
    } else {
      res.status(400).json({
        code: 400,
        message: 'está faltando o store_id como parametro'
      })
    }
  },
};