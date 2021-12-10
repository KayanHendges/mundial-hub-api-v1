import { Router } from 'express';
import Freight from '../../controllers/Freight/Freight';

const freightRouter = Router();

    freightRouter.get('/frete', Freight.freight)

export default freightRouter;