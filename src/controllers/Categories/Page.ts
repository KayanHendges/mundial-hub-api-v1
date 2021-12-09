import { Request, Response } from 'express';
import Categories from '../../models/Categories/Categories';
import Page from '../../models/Categories/Page';

export default {

  async getById(req: Request, res: Response){

    const {params}: any = req

    if(params.id){
      const page = new Page
      page.getById(params.id, res)
    } else {
      res.status(400).json({
        code: 400,
        message: 'está faltando o hub_id da categoria'
      })
    }
  }, 

  async createCategory(req: Request, res: Response){
    const {body}: any = req
    
    if(body.category){
      Categories.createCategory(body.values, res)
    } else {
      res.status(400).json({
        code: 400,
        message: 'está faltando a categoria'
      })
    }
  },

  async createSubcategory(req: Request, res: Response){
    const {body, params}: any = req
    
    if(params.parent_id && body.category){
      Categories.createSubcategory(body.values, params.parent_id, res)
    } else {
      res.status(400).json({
        code: 400,
        message: 'está faltando a categoria'
      })
    }
  },
  
  async editCategory(req: Request, res: Response){
    const {body}: any = req

    if(body.category){
      Categories.editCategory(req.body.category, res)
    } else {
      res.status(400).json({
        code: 400,
        message: 'está faltando a categoria'
      })
    }
  },

  async deleteCategory(req: Request, res: Response){
    
    const {params}: any = req

    if(params.hub_id){
      Categories.deleteCategory(req.params.hub_id, res)
    } else {
      res.status(400).json({
        code: 400,
        message: "Está faltando o hub_id da categoria"
      })
    }
  }

};