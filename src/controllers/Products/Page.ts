import { Request, Response } from 'express';
import Categories from '../../models/Categories/Categories';
import Products from '../../models/Products/Products';

export default {
  
  async unitary(req: Request, res: Response){
    console.log('unitary')

    const {params}: any = req
    console.log(params)

    if(params.reference != undefined){
      Products.unitary(params.reference, res)
    } else {
      res.status(400).json({code: 400, message: 'está faltando a referencia do produto'})
    }
  },

  async kits(req: Request, res: Response){
    console.log('kits')

    const {params}: any = req

    if(params.reference != undefined){
      Products.kits(params.reference, res)
    } else {
      res.status(400).json({code: 400, message: 'está faltando a referencia do produto'})
    }
  },

  async categories(req: Request, res: Response){
    Categories.ProductCategories(res)
  },

  async lastReference(req: Request, res: Response){
    Products.lastReference(res)
  },

  async modelSuggestion(req: Request, res: Response){
    const {query}: any = req

    if(query.productName != undefined){
      Products.getModelSuggestion(query.productName, res)
    } else {
      res.status(400).json({
        code: 400,
        message: "está faltando o product name"
      })
    }
  },

  async create(req: Request, res: Response){
    const {body}: any = req

    if(body.params != undefined){
      Products.create(body.params, res)
    } else {
      res.status(400).json({
        code: 400,
        message: "está faltando os valores dos produtos nos parametros"
      })
    }
  },

  async createKits(req: Request, res: Response){
    const {body}: any = req

    if(body.params != undefined){
      Products.createKits(body.params, res)
    } else {
      res.status(400).json({
        code: 400,
        message: "está faltando os valores dos produtos nos parametros"
      })
    }
  },

  async edit(req: Request, res: Response){

    const {params, body}: any = req

    if(params.reference != undefined && body.params != undefined){
      Products.edit(body.params, res)
    } else {
      res.status(400).json({
        code: 400,
        message: "está faltando a referencia ou os parametros"
      })
    }

  },

  async delete(req: Request, res: Response){

    const {params}: any = req

    if(params.reference != undefined){
      Products.delete(params.reference, res)
    } else {
      res.status(400).json({
        code: 400,
        message: "está faltando a referencia"
      })
    }
  }
  
};