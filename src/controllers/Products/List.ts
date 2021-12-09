import { Request, Response } from 'express';
import Products from '../../models/Products/Products';
import List from '../../models/Products/List';

export default {
  
  async list(req: Request, res: Response) {
    
    const { query }: any  = req
    if (query.search != undefined) {
      const productsList = new List
      productsList.list(query, res)
    } else {
      res.status(400).json({
          code: 400,
          message: 'é preciso ser enviado parametros para busca'
      })
    }

  },

  async updateImages(req: Request, res: Response){
    const {params}: any = req
    console.log(params)

    if(params.reference){
      const products = new Products
      products.updateImages(params.reference, res)
    }
  },

  async kitsByRef(req: Request, res: Response){
    
    const {params}: any = req

    if(params.reference != undefined){
      const productList = new List
      productList.kitsByRef(params.reference, res)
    }
  }
  
};