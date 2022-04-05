import { Request, response, Response } from 'express';
import Delete from '../../models/Products/Delete';
import CreateProduct from '../../services/Products/Create/Product'
import EditProduct from '../../services/Products/Edit/Product'

export default {
  
  async unitary(req: Request, res: Response){
    
    const { body } = req

    if(body.product && body.hub_id){
        
        await EditProduct.unitary(body.product, body.hub_id)
        .then(response => {
            res.status(201).json({
                code: 201,
                message: 'Produto editado com sucesso'
            })
        })
        .catch(error => {
            res.status(400).json({
                code: 400,
                message: `erro: ${error}`
            })
        })
    } else {
        res.status(400).json({
            code: 400,
            message: 'está faltando o produto no body ou o hub_id'
        })
    }
  },

  async pricing(req: Request, res: Response){
    
    const { body } = req
    
    console.log(body)

    if(body.pricing && body.tray_pricing_id && body.store_id){
        
        await EditProduct.pricing(body.pricing, body.tray_pricing_id, body.store_id)
        .then(response => {
            res.status(201).json({
                code: 201,
                message: 'Produto editado com sucesso'
            })
        })
        .catch(error => {
            res.status(400).json({
                code: 400,
                message: `erro: ${error}`
            })
        })
    } else {
        res.status(400).json({
            code: 400,
            message: 'está faltando o pricing no body ou o pricing_id'
        })
    }
  },

  async kitPricingRules(req: Request, res: Response){
    
    const { body } = req

    if(body.pricing && body.rules && body.tray_pricing_id){
        
        await EditProduct.kitPricingRules(body.pricing, body.rules, body.tray_pricing_id)
        .then(response => {
            res.status(201).json({
                code: 201,
                message: 'Produto editado com sucesso'
            })
        })
        .catch(error => {
            res.status(400).json({
                code: 400,
                message: `erro: ${error}`
            })
        })
    } else {
        res.status(400).json({
            code: 400,
            message: 'está faltando o produto no body ou o hub_id'
        })
    }
  },

  async unitaryTray(req: Request, res: Response){
    
    const { body } = req

    if(body.details && body.pricing && body.tray_id && body.store_id){
        
        await EditProduct.unitaryTray(body.details, body.pricing, body.tray_id, body.store_id)
        .then(response => {
            res.status(201).json({
                code: 201,
                message: 'Produto editado com sucesso'
            })
        })
        .catch(error => {
            res.status(400).json({
                code: 400,
                message: `erro: ${error}`
            })
        })
    } else {
        res.status(400).json({
            code: 400,
            message: 'está faltando o produto no body ou o hub_id'
        })
    }
  },

  async kitTray(req: Request, res: Response){
    
    const { body } = req

    if(body.details && body.pricing && body.rules && body.store_id){
        
        await EditProduct.kitTray(body.details, body.pricing, body.rules, body.store_id)
        .then(response => {
            res.status(201).json({
                code: 201,
                message: 'Produto editado com sucesso'
            })
        })
        .catch(error => {
            res.status(400).json({
                code: 400,
                message: `erro: ${error}`
            })
        })
    } else {
        res.status(400).json({
            code: 400,
            message: 'está faltando o produto no body ou o hub_id'
        })
    }
  },
};