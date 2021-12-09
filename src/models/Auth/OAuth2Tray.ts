import axios from "axios"
import { addHours, differenceInMinutes, parseISO } from "date-fns"
import Connect from "../../database/Connect"
import Requests from "../Tray/Requests"

class OAuth2Tray {

    async tokenRoutine(){

        const tokens = await getAllTokens()
        await expiredTokens(tokens)
        .then(response => {
            const date = addHours(new Date(), -3)
            console.log("verificações de tokens feitos", date)
        }) 

        setTimeout(() => {
            this.tokenRoutine()
        }, 1800000) //30 minutos

        async function getAllTokens(): Promise<any[]>{
            return new Promise((resolve, reject) => {
                
                const sql = `SELECT * FROM credenciais_tray`

                Connect.query(sql, (erro, resultado: any[]) => {
                    if(erro){
                        console.log(erro)
                    } else {
                        const allTokens: any[] = []
                        
                        resultado.map(token => {
                            if(token.access_token.length > 0){
                                allTokens.push(token)
                            }
                        })
                        resolve(allTokens)
                    }
                })
            })
        }

        async function expiredTokens(tokens: any[]): Promise<void>{
            return new Promise((resolve, reject) => {

                const date = addHours(new Date(), -3)

                tokens.map(token => {
                    const differenceTime = differenceInMinutes(addHours(parseISO(token.date_expiration_access_token), -3), date)
                    if(differenceTime < 31){
                        refreshToken(token)
                    }
                    console.log("loja", token.store, differenceTime, "minutos restantes")
                })
                resolve()
            })
        }

        async function refreshToken(token: any): Promise<string>{
            return new Promise((resolve, reject) => {
                const query = `${token.api_address}/auth?refresh_token=${token.refresh_token}`
                Requests.saveRequest(query)
                
                axios.get(query)
                .then(response => {
                    console.log(response.data)
                    const tokenData = response.data

                    const sql = `UPDATE credenciais_tray SET access_token='${tokenData.access_token}', refresh_token='${tokenData.refresh_token}', date_expiration_access_token='${response.data.date_expiration_access_token}',
                    date_expiration_refresh_token='${response.data.date_expiration_refresh_token}', date_activated='${response.data.date_activated}' WHERE store=${tokenData.store_id}`

                    Connect.query(sql, (erro, resultado) => {
                        if(erro){
                            console.log(erro)
                        } else {
                            console.log("token da loja", tokenData.store_id, "atualizado")
                            resolve(`token da loja, ${tokenData.store_id}, atualizado`)
                        }
                    })
                })
                .catch(erro => console.log(erro.response.data, token.refresh_token))
            })
        }

    }

    async getToken(storeId: any): Promise<any>{
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM credenciais_tray WHERE store=${storeId}`

            Connect.query(sql, (erro, resultado) => {
                if(erro){
                    console.log(erro)
                } else {
                    resolve(resultado[0].access_token)
                }
            })
        })
    }

    async getStoreCredentials(storeId: any): Promise<any>{
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM credenciais_tray WHERE store=${storeId}`

            Connect.query(sql, (erro, resultado) => {
                if(erro){
                    console.log(erro)
                } else {
                    resolve(resultado[0])
                }
            })
        })
    }

}

export default new OAuth2Tray