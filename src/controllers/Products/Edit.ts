import { Request, response, Response } from 'express';
import CreateProduct from '../../services/Products/Create/Product'
import EditProduct from '../../services/Products/Edit/Product'

export default {
  
  async unitary(req: Request, res: Response){
    
    const { body } = req

    if(body.product, body.hub_id){
        
        await EditProduct.EditUnitary(body.product, body.hub_id)
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