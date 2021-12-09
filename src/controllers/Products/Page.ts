import { Request, Response } from 'express';
import Categories from '../../models/Categories/Categories';
import Products from '../../models/Products/Products';

export default {
  
  async unitary(req: Request, res: Response){
    console.log('unitary')

    const {params}: any = req
    console.log(params)

    if(params.reference != undefined){
      const products = new Products
      products.unitary(params.reference, res)
    } else {
      res.status(400).json({code: 400, message: 'está faltando a referencia do produto'})
    }
  },

  async kits(req: Request, res: Response){
    console.log('kits')

    const {params}: any = req

    if(params.reference != undefined){
      const products = new Products
      products.kits(params.reference, res)
    } else {
      res.status(400).json({code: 400, message: 'está faltando a referencia do produto'})
    }
  },

  async categories(req: Request, res: Response){
    console.log('categories')
    const categories = new Categories
    categories.ProductCategories(res)
  }
  
};