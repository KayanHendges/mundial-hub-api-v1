import { Request, Response } from 'express';
import Products from '../../models/Products/Products';
import List from '../../models/Products/List';
import Connect from '../../database/Connect';

export default {

  async unitary(req: Request, res: Response){
    const { reference } = req.params

    if(reference){
      
      List.unitary(reference)
      .then(response => {
        res.status(200).json({
          code: 200,
          details: response.details,
          pricing: response.pricing
        })
      })
      .catch(erro => {
        res.status(400).json({
          code: 400,
          message: erro
        })
      })

    } else {
      res.status(400).json({
        code: 400,
        message: 'está faltando a referencia no body'
      })
    }
  },

  async unitaryByTrayId(req: Request, res: Response){ // temporário para a api 2
    const { tray_id, store_id } = req.query

    if(tray_id && store_id){
      
      const sql = `SELECT p.hub_id
      FROM produtos p JOIN tray_produtos tp ON p.hub_id = tp.hub_id
      WHERE tp.tray_product_id = ${tray_id} and tp.tray_store_id = ${store_id}`

      Connect.query(sql, (err, result) => {
        if(err){
          console.log(err)
          res.status(400).json({
            code: 400,
            message: 'error getting product from database'
          })
        } else {
          if(result.length > 0){
            res.json({
              hub_id: result[0].hub_id
            })
          } else {
            res.status(404).json({
              code: 404,
              message: 'any product found in database'
            })
          }
        }
      })

    } else {
      res.status(400).json({
        code: 400,
        message: 'está faltando a referencia'
      })
    }
  },

  async kits(req: Request, res: Response){
    const { reference } = req.params

    if(reference){
      
      List.kits(reference)
      .then(response => {
        res.status(200).json({
          code: 200,
          kits: response
        })
      })
      .catch(erro => {
        res.status(400).json({
          code: 400,
          message: erro
        })
      })

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