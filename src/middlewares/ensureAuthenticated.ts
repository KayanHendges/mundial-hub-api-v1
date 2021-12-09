import { Request, Response } from "express";
import { verify } from "jsonwebtoken";

function ensureAuthenticated(request: Request, response: Response): Promise<void>{
    return new Promise((resolve, reject) => {
        const authToken = request.headers.authorization;

        if(!authToken) {
            response.status(401).json({
                code: 401,
                message: "Token is missing"
            })
        } else {

            const [, token] = authToken.split(" ")
                
            try {
                verify(token, "cf2dd495-ea1f-49cf-be17-52d23d900e71")
                resolve()
            } catch(erro: any) {

                const errorMessage = erro.toString()
                if(errorMessage == 'JsonWebTokenError: jwt malformed'){
                    response.status(401).json({
                        code: 401,
                        message: "Token is invalid"
                    })
                }
                if(errorMessage == 'TokenExpiredError: jwt expired'){
                    response.status(401).json({
                        code: 401,
                        message: "Token expired"
                    })
                }
            }
        }
    
    })
}

export default ensureAuthenticated