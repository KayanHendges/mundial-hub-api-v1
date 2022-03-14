import { Request, Response } from 'express';
import Products from '../../models/Products/Products';
import List from '../../models/Products/List';

export default {

  async unitary(req: Request, res: Response){
    const { body } = req

    if(body.reference){
      
    } else {
      res.status(400).json({
        code: 400,
        message: 'está faltando a referencia no body'
      })
    }
  },
  
  async list(req: Request, res: Response) {
    
    const { query }: any  = req
    if (query.search != undefined) {
      List.list(query, res)
    } else {
      res.status(400).json({
          code: 400,
          message: 'é preciso ser enviado parametros para busca'
      })
    }

  },

  async listToLinkProviders(req: Request, res: Response) {
    
    const { query }: any  = req
    if (query.query != undefined) {
      List.listToLinkProviders(query.query, res)
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
      Products.updateImages(params.reference, res)
    }
  },

  async kitsByRef(req: Request, res: Response){
    
    const {params}: any = req

    if(params.reference != undefined){
      List.kitsByRef(params.reference, res)
    }
  },

  async deleteNoStockTray(req: Request, res: Response){

    List.deleteNoStockTray(res)
    
  }
  
};