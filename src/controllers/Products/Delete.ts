import { Request, response, Response } from 'express';
import Delete from '../../models/Products/Delete';
import CreateProduct from '../../services/Products/Create/Product'
import EditProduct from '../../services/Products/Edit/Product'

export default {

    async kit(req: Request, res: Response){

    const { body } = req

    if(body.hub_id){
        
        await Delete.kit(body.hub_id)
        .then(response => {
            res.status(201).json({
                code: 201,
                message: 'kit excluído sucesso'
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
            message: 'está faltando o hub_id'
        })
    }
    },

    async unitaryTray(req: Request, res: Response){

        const { body } = req
    
        if(body.reference && body.store_id){
            
            await Delete.unitaryTray(body.reference, body.store_id)
            .then(response => {
                res.status(201).json({
                    code: 201,
                    message: 'unitário excluído sucesso'
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
                message: 'está faltando o hub_id'
            })
        }
    },

    async kitTray(req: Request, res: Response){

        const { body } = req
    
        if(body.tray_pricing_id && body.store_id){
            
            await Delete.kitTray(body.tray_pricing_id, body.store_id)
            .then(response => {
                res.status(201).json({
                    code: 201,
                    message: 'kit excluído com sucesso na tray'
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
                message: 'está faltando o hub_id'
            })
        }
    },
};