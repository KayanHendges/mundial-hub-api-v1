import { Request, Response } from 'express';
import Freight from '../../models/Freight/Freight';

export default {
  
  async freight(req: Request, res: Response) {
    
    const params = req.query
    console.log('================================')
    console.log(params)

    if(params.token != undefined){
      Freight.freteTray(params, res)
    } else {
      res.status(400).json({
        code: 400,
        message: "está faltando parametros"
      })
    }

    if(params.storeQualifierId != undefined){
          Freight.freteViaVarejo(params, res)
      } else {
        res.status(400).json({
          code: 400,
          message: "está faltando parametros"
        })
      }
    },
};