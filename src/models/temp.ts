import axios from "axios"
import { Response } from "express"
import Connect from "../database/Connect"
import OAuth2Tray from "./Auth/OAuth2Tray"
import Requests from "./Tray/Requests"


class Temp {

    async updateSizes(res: Response){        
        
        const unitaryList = await getUnitaryList()
        await productLoop(unitaryList, 1449)

        res.send(unitaryList)

        async function getUnitaryList(): Promise<any[]>{
            return new Promise(resolve => {

                const sql = `SELECT reference, weight, height, length, width FROM produtos WHERE is_kit=0`

                Connect.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                    } else {
                        resolve(resultado)
                    }
                })

            })
        }

        async function productLoop(list: any[], index: number): Promise<void>{
            return new Promise(async(resolve) => {

                console.log(list[index].reference, '-----', index+1, '/', list.length, ' ', ((100/list.length)*(index+1)).toFixed(2), '%')
                const product = await getKitId(list[index])

                if(product.success && product.kit2 != undefined) {
                    await postTrayUnitary(list[index], product.kit2, 2)
                    console.log('kit2 ok!')
                }

                if(product.success && product.kit4 != undefined) {
                    await postTrayUnitary(list[index], product.kit4, 4)
                    console.log('kit4 ok!')
                }

                if(list.length > index+1){
                    setTimeout(() => {
                        resolve(productLoop(list, index+1))
                    }, 600);
                } else {
                    resolve()
                }

            })
        }

        async function getKitId(unitary: any): Promise<any>{
            return new Promise(resolve => {
                const sql = `SELECT t.tray_product_id, p.hub_id
                FROM produtos p JOIN tray_produtos t ON p.hub_id = t.hub_id
                WHERE p.is_kit=1 AND t.tray_store_id=668385 AND p.reference=${unitary.reference}
                ORDER BY p.product_name ASC`

                Connect.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                    } else {
                        console.log(resultado.length)
                        if(resultado.length == 0){
                            resolve({ success: false })
                        }
                        if(resultado.length == 1){
                            resolve({
                                success: true,
                                kit2: {
                                    trayId: resultado[0].tray_product_id,
                                    hubId: resultado[0].hub_id
                                }
                            })
                        }
                        if(resultado.length == 2){
                            resolve({
                                success: true,
                                kit2: {
                                    trayId: resultado[0].tray_product_id,
                                    hubId: resultado[0].hub_id
                                },
                                kit4: {
                                    trayId: resultado[1].tray_product_id,
                                    hubId: resultado[1].hub_id
                                }
                            })
                        }
                        resolve({ success: false })
                    }
                })
            })
        }

        async function postTrayUnitary(unitary: any, kit: any, quantity: number): Promise<any>{
            return new Promise(async(resolve, reject) => {

                const MundialCredentials = await OAuth2Tray.getStoreCredentials(668385)


                const productObj = {
                    Product: {
                        weight: unitary.weight*quantity,
                        length: unitary.length,
                        width: unitary.width*quantity,
                        height: unitary.height
                    }
                }

                const query = `${MundialCredentials.api_address}/products/${kit.trayId}?access_token=${MundialCredentials.access_token}`
                Requests.saveRequest(query)

                const config: any = {
                    method: 'put',
                    url: query,
                    headers: { 
                      'Content-Type': 'application/json'
                    },
                    data: productObj
                }

                axios(config)
                .then(response => {
                    if(response.data.code == 200){
                        resolve(saveDB(unitary, kit, quantity))
                    } else {
                        console.log(response.data)
                    }
                })
                .catch(erro => {
                    console.log(erro.response.data.causes)
                })
            })
        }

        async function saveDB(unitary: any, kit: any, quantity: number){
            return new Promise(resolve => {
            
                const values = {
                    weight: unitary.weight*quantity,
                    length: unitary.length,
                    width: unitary.width*quantity,
                    height: unitary.height
                }

                const sql = `UPDATE produtos SET ? WHERE hub_id=${kit.hubId}`
            
                Connect.query(sql, values, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                    } else {
                        resolve({ success: true })
                    }
                })
            })
        }
    }

}

export default new Temp