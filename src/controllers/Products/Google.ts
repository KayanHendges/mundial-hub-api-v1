import { Request, Response } from "express"
import Google from "../../models/Products/Google"

export default {
    
    async Xml(request: Request, response: Response){

        const xml = await Google.xml()


        response.set('Content-Type', 'text/xml');
        response.type('xml')
        response.send(xml)
    }

}