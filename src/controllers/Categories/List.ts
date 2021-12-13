import { Request, Response } from 'express';
import Categories from '../../models/Categories/Categories';

export default {

  async all(req: Request, res: Response){

    Categories.listAll(res)

  }

};