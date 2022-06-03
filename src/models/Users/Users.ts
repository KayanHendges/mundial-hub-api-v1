import axios from "axios";
import { Response } from "express";
import Connect from "../../database/Connect";
import { IStore } from "../../services/Tray/TrayProducts";
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

            const trayCredentials = await OAuth2Tray.getStoreCredentials(storeId)
            .catch(erro => {
                reject(erro)
                return null
            })

            if(trayCredentials == null){return}

            const totalProducts = await getTrayProductsAmount(trayCredentials)

            resolve({
                total: totalProducts
            })

            async function getTrayProductsAmount(storeCredentials: IStore): Promise<number>{
                return new Promise(async(resolve, reject) => {
                    
                    // service disabled

                    const min = 1000 * 20
                    const max = 1000 * 40

                    const randomTrayId = Math.floor(Math.random() * (max - min + 1) + min)

                    resolve(randomTrayId)

                    return

                    // just for demonstration

                    const query = `${storeCredentials.api_address}/products/`

                    axios.get(query)
                    .then(response => {
                        const responseTray = response.data
                        if(responseTray?.paging?.total){
                            resolve(responseTray.paging.total)
                        } else {
                            reject('tray não retornou o total de produtos')
                        }
                    })
                    .catch(erro => {
                        if(erro.response.data.causes){
                            reject(JSON.stringify(erro.response.data.causes))
                        } else {
                            Error(erro)
                            reject('erro ao fazer a requisição a Tray')
                        }
                    })
                })
            }
        })
    }
}

export default new Users