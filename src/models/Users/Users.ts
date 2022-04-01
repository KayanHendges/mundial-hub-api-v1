import { Response } from "express";
import Connect from "../../database/Connect";
import OAuth2Tray from "../Auth/OAuth2Tray";

class Users {

    async getCountRequestsTray(res: Response){
        
        const requests = await getCount()

        res.status(200).json({
            code: 200,
            requests: requests
        })

        function getCount(){
            return new Promise(resolve => {
                const sql = `SELECT COUNT(request_id) FROM requisições_tray 
                WHERE query LIKE '%mundialpneumaticos%'`
    
                Connect.query(sql, (erro, resultado) => {
                    if(erro){
                        console.log(erro)
                    } else {
                        const result = resultado[0]
                        resolve(result['COUNT(request_id)'])
                    }
                })
            })
        }

    }

    async getProductsAmount(storeId: number): Promise<{total: number}>{
        return new Promise(async(resolve, reject) => {

            const getCredentialsTray = OAuth2Tray.getStoreCredentials(storeId)
            .catch(erro => {
                reject(erro)
                return null
            })

            if(getCredentialsTray == null){return}

            
        })
    }
}

export default new Users