import { Request, Response } from 'express';
import Users from '../../models/Users/Users';

export default {
  
  async trayRequests(req: Request, res: Response) {
    
    const users = new Users
    users.getCountRequestsTray(res)
  },
};