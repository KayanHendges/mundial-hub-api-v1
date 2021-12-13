import { Request, Response } from 'express';
import Freight from '../../models/Freight/Freight';

export default {
  
  async freight(req: Request, res: Response) {

    console.log(req)
    const params = req.query
    console.log('================================')
    console.log(params)

    if(params.token != undefined){
      console.log('passou')
      Freight.freteTray(params, res)
    } else {

      if(params.storeQualifierId != undefined){
        Freight.freteViaVarejo(params, res)
      } else {
        console.log('está faltando parametros')
        res.status(400).json({
          code: 400,
          message: "está faltando parametros"
        })
      }

    }

    
  },
};