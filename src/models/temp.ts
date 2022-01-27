import { Request, Response } from "express"
import Product from "../services/Products/ProductDataBase"


class Temp {

    async Temp(req: Request, res: Response){        
        
        const product = {
            product_name: 'teste',
        }

        // Product.insert(product)
    }

}

export default new Temp