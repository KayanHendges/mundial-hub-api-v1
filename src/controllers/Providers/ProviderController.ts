import { Request, Response } from 'express';
import Providers from '../../models/Providers/Providers';

const users = [
  { name: 'Diego', email: 'diego@rocketseat.com.br' },
];

export default {
  
  async getProviders(req: Request, res: Response) {
    const providers = new Providers

    const providerslist = await providers.getAllProviders()

    res.status(200).json({
        code: 200,
        providers_list: providerslist
    })
  },
};