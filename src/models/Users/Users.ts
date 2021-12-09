import { Response } from "express";
import Connect from "../../database/Connect";

class Users {

    async getCountRequestsTray(res: Response){
        
        const requests = await getCount()

        res.status(200).json({
            code: 200,
            requests: requests
        })

        function getCount(){
            return new Promise(resolve => {
                const sql = `SELECT COUNT(request_id) FROM requisições_tray`
    
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

}

export default Users