import { Request, response, Response } from 'express';
import CreateProduct from '../../services/Products/Create/Product'

export default {
  
  async unitary(req: Request, res: Response){
    
    const { body } = req

    if(body.product){
        
        await CreateProduct.createUnitary(body.product)
        .then(response => {
            res.status(201).json({
                code: 201,
                hub_id: response,
                message: 'Produto criado com sucesso'
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
            message: 'está faltando o produto no body'
        })
    }
  },

  async pricing(req: Request, res: Response){
    
    const { body } = req

    if(body.pricing && body.store_id && body.pricing.hub_id != undefined){
        
        await CreateProduct.createPricing(body.pricing, body.store_id)
        .then(response => {
            res.status(201).json({
                code: 201,
                pricing_id: response,
                message: 'Pricing criado com sucesso'
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
            message: 'está faltando o pricing, store_id ou hub_id no body'
        })
    }
  },
  
  async kitPricingRule(req: Request, res: Response){
    const { body } = req

    if(body.pricing && body.kit_rules && body.store_id){
        
        await CreateProduct.createKitPricingRules(body.pricing, body.kit_rules, body.store_id)
        .then(response => {
            res.status(201).json({
                code: 201,
                rule_id: response.rule_id,
                pricing_id: response.pricing_id,
                message: 'Pricing e Rule do kit criado com sucesso'
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
            message: 'está faltando o pricing, store_id ou hub_id no body'
        })
    }
  },

  async unitaryTray(req: Request, res: Response){
    
    const { body } = req

    if(body.product && body.pricing && body.tray_pricing_id && body.store_id){
        
        await CreateProduct.createTrayUnitary(body.product, body.pricing, body.tray_pricing_id, body.store_id)
        .then(response => {
            res.status(201).json({
                code: 201,
                tray_id: response,
                message: 'Produto criado com sucesso'
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
            message: 'está faltando o produto no body'
        })
    }
  },

  async kitTray(req: Request, res: Response){
    
    const { body } = req

    console.log('---------------------------------------------')
    console.log(body)

    if(body.product && body.pricing && body.rules && body.tray_pricing_id && body.store_id && body.rules.tray_product_id > 0){
        
        await CreateProduct.createTrayKit(body.product, body.pricing, body.rules, body.tray_pricing_id, body.store_id)
        .then(response => {
            res.status(201).json({
                code: 201,
                tray_id: response,
                message: 'kit criado na tray com sucesso'
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
            message: 'está faltando o produto no body'
        })
    }
  },
};