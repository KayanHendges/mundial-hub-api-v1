import { addHours } from "date-fns"
import Connect from "../../database/Connect"

class Requests {

    saveRequest(query: string): any{
        const datetime = addHours(new Date(), -3)

        const values = {
            query_time: datetime,
            query: query
        }
        const sql = `INSERT INTO requisições_tray SET ?`
        
        Connect.query(sql, values, (erro, resultado) => {
            if(erro){
                console.log('erro ao salvar request')
                console.log(erro)
            }
        })
    }

    async resetCountRequests(): Promise<void>{
        return new Promise(async(resolve) => {

            const sql = `TRUNCATE TABLE requisições_tray`

            Connect.query(sql, (erro, resultado) => {
                if(erro){
                    console.log(erro)
                    resolve()
                } else {
                    console.log(`logs de requisições da Tray excluídas`, resultado)
                    resolve()
                }
            })
        })
    }

}

export default new Requests