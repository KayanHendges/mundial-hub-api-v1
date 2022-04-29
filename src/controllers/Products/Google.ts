import { Request, Response } from "express"
import Google from "../../models/Products/Google"

export default {
    
    async Xml(request: Request, response: Response){

        
        try {
            const xml = await Google.xml()

            response.set('Content-Type', 'text/xml');
            response.type('xml')
            response.send(xml)
        } catch (err) {
            response.status(400).json({
                message: 'unexpected error'
            })
        }

    }

}