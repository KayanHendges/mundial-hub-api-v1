import { Request, Response } from 'express';
import ensureAuthenticated from '../../middlewares/ensureAuthenticated';
import Auth from '../../models/Auth/Auth';

export default {
  
  async login(req: Request, res: Response) {
    const {user, password} = req.body.credentials
    
    if(user && password) {
        const auth = new Auth
        auth.login(user, password, res)
    } else {
        res.status(401).json({
            code: 401, 
            message: 'Usuário e senha faltando'
        })
    }
  },

  async checkToken(req: Request, res: Response){

    await ensureAuthenticated(req, res)
    const {name}:any = req.query        
    
    if (name) {
      const auth = new Auth
      auth.checkToken(name, res)
    } else {
        res.status(401).json({
            code: 401,
            message: 'O usuário está faltando'
        })
    }
  },

  async refreshToken(req: Request, res: Response){

    const {name, refresh_token: refreshToken }: any = req.body.credentials

    if(name && refreshToken){
      const auth = new Auth
      auth.refreshToken(name, refreshToken, res)
    } else {
      res.status(401).json({
        code: 401,
        message: "Está faltando o nome ou o refresh token"
      })
    }
  }
};