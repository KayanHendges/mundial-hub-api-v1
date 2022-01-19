import axios from "axios";
import { Response } from "express";
import Connect from "../../database/Connect";
import OAuth2Tray from "../Auth/OAuth2Tray";
import Requests from "../Tray/Requests";

interface IProductsList {
    hubId: number;
    productName: string;
}

interface IList {
}

class List implements IList {

    async list(params: any, res: Response){

        const search: string = params.search

        const page = params.page.length > 0 ? parseInt(params.page) : 1
        const perPage = params.perPage.length > 0 ? parseInt(params.perPage) : 20

        const orderCollum = params.orderBy.length > 0 ? params.orderBy : 'p.hub_id'
        const order = params.order.length > 0 ? params.order : 'DESC'
        const store = params.store.length > 0 ? parseInt(params.store) : 668385
        
        const showKits = params.showKits.length > 0 && store == 668385 ? parseInt(params.showKits) : 0

        const rowStart = (page-1) * perPage

        const collums = 'p.hub_id, t.tray_product_id, p.reference, p.product_name, p.picture_source_1, p.picture_source_1_90, t.tray_stock, t.tray_price, t.tray_promotional_price, t.start_promotion, t.end_promotion'

        const kitCollums = `p.product_name, p.reference, t.tray_stock, p.picture_source_1, p.picture_source_1_90, t.tray_price, t.tray_promotional_price`

        const tables = 'FROM produtos p JOIN tray_produtos t ON p.hub_id = t.hub_id'

        const orderBy = `ORDER BY ${orderCollum} ${order}`

        let sql = `SELECT
        ${collums}
        ${tables}
        WHERE t.tray_store_id=${store} AND p.is_kit=0
        ${orderBy}
        LIMIT ${rowStart}, ${perPage}`
        let sqlCount = `SELECT COUNT(*) ${tables} WHERE t.tray_store_id=${store} AND p.is_kit=0`

        if(search.length > 0){

            if(parseInt(search) > 0 && search.length == 4){ // se for 4, se trata da referencia

                sql = `SELECT 
                ${collums}
                ${tables} 
                WHERE t.tray_store_id=${store} AND p.reference=${search} AND p.is_kit=0
                ${orderBy}`

                sqlCount = `SELECT COUNT(*) ${tables} WHERE t.tray_store_id=${store} AND p.reference=${search} AND p.is_kit=0`

            } else {

                if(search.split(' ').length > 1){

                    const words = search.split(' ').map(word => {
                        return `${word}%`
                    })

                    sql = `SELECT
                    ${collums}
                    ${tables}
                    WHERE t.tray_store_id=${store} AND p.is_kit=0 AND p.product_name LIKE '%${words.join('')}'
                    ${orderBy}`

                    sqlCount = `SELECT COUNT(*) ${tables} WHERE t.tray_store_id=${store} AND p.is_kit=0 AND product_name LIKE '%${words.join('')}'`

                } else {
                    
                    sql = `SELECT
                    ${collums}
                    ${tables}
                    WHERE t.tray_store_id=${store} AND p.is_kit=0 AND p.product_name LIKE '%${search}%' 
                    ${orderBy} 
                    LIMIT ${rowStart}, ${perPage}`

                    sqlCount = `SELECT COUNT(*) ${tables} WHERE t.tray_store_id=${store} AND p.is_kit=0 AND product_name LIKE '%${search}%'`

                }
            }
        }

        const products: any[] = await getProductList(sql).then(response => {return response})
        const productsLength: any = await getResultLength(sqlCount).then(response => {return response})
        const productWithKits = await getKits(products, showKits)

        const dataReturn = {
            produtos: productWithKits,
            numero_produtos: productsLength,
            limite_pagina: perPage,
            pagina: page,
            numero_paginas: Math.ceil(productsLength/perPage)
        }
        
        res.status(200).json(dataReturn)

        async function getProductList(sql: string): Promise<any[]>{
            return new Promise((resolve, reject) => {
                Connect.query(sql, (erro, resultados) => {
                    if(erro){
                        console.log(erro)
                    } else {
                        resolve(resultados)
                    }
                })
            })
        }

        async function getResultLength(sql: string){
            return new Promise((resolve, reject) => {
                Connect.query(sql, (erro, resultado) => {
                    if(erro){
                        console.log(erro)
                    } else {
                        var productsLength = JSON.stringify(resultado[0])
                        productsLength = productsLength.replace('{"COUNT(*)":', '')
                        productsLength = productsLength.replace('}', '')
                        
                        resolve(productsLength)
                    }
                })
            })
        }

        async function getKits(products: any[], showKits: number){
            return new Promise((resolve, reject) => {
                if(showKits == 1){
                    const referenceList = getReference(products)
                    const sql = `SELECT
                    ${kitCollums}
                    ${tables} 
                    WHERE p.is_kit=1 and reference in (${referenceList}) ORDER BY p.reference DESC, p.product_name ASC`

                    Connect.query(sql, (erro, resultados) => {
                        if(erro){
                            console.log(erro)
                        } else {
                            if(resultados.length > 0){
                                resolve(insertKits(products, resultados))
                            } else {
                                resolve(products.map(product => {
                                    return {...product, kits: []}
                                }))
                            }
                        }
                    })
                } else {
                    resolve(products.map(product => {
                        return {...product, kits: []}
                    }))
                }
            })
        }

        function getReference(products: any[]){
            const referenceList = products.map(product => {
                return product.reference
            })
            return referenceList
        }

        function insertKits(products: any[], kits: any[]){
            const productList = products.map(product => {
                return {
                    ...product,
                    kits: kits.map(kit => {
                        if(kit.reference == product.reference){
                            return kit
                        } else {
                            return
                        }
                    }).filter((value) => {
                        return value != null
                    })
                }
            })
            return productList
        }
    }

    async listToLinkProviders(search: string, res: Response){

        var sql = ''

        if(search.length > 0){
            if(parseInt(search) > 0 && (search).length == 4){ // se for 4, se trata da referencia

                sql = `SELECT hub_id, product_name FROM produtos
                WHERE reference=${search} AND is_kit=0
                LIMIT 0, 10`

            } else {

                if(search.split(' ').length > 1){

                    const words = search.split(' ').map(word => {
                        return `${word}%`
                    })

                    sql = `SELECT hub_id, product_name FROM produtos
                    WHERE is_kit=0 AND product_name LIKE '%${words.join('')}'
                    LIMIT 0, 10`

                } else {
                    
                    sql = `SELECT hub_id, product_name FROM produtos
                    WHERE is_kit=0 AND product_name LIKE '%${search}%' 
                    LIMIT 0, 10`
                }
            }
        }

        const products = sql.length > 0 ? await getProductList(sql) : []
        
        res.status(200).json({
            code: 200,
            products: products
        })

        async function getProductList(sql: string): Promise<IProductsList[]>{
            return new Promise((resolve, reject) => {
                Connect.query(sql, (erro, resultados: any[]) => {
                    if(erro){
                        console.log(erro)
                        resolve([])
                    } else {
                        if(resultados.length > 0){
                            const list = resultados.map(result => {
                                return {
                                    hubId: parseInt(result.hub_id),
                                    productName: result.product_name
                                }
                            })
                            resolve(list)
                        } else {
                            resolve([])
                        }
                    }
                })
            })
        }

    }

    async kitsByRef(reference: number, res: Response){

        const sql = `SELECT t.tray_product_id, p.product_name, p.reference, t.tray_stock, p.picture_source_1, p.picture_source_1_90, t.tray_price, t.tray_promotional_price
        FROM produtos p JOIN tray_produtos t ON p.hub_id = t.hub_id
        WHERE p.is_kit=1 AND p.reference=${reference}
        ORDER BY p.product_name ASC`
        
        Connect.query(sql, (erro, resultados) => {
            if(erro){
                console.log(erro)
                res.status(400)
            } else {
                if(resultados.length > 0){
                    res.status(200).json({kits: resultados})
                } else {
                    res.status(400)
                }
            }
        })
    }

    async deleteNoStockTray(res: Response){

        const MundialCredentials = await OAuth2Tray.getStoreCredentials(668385)

        const idsList = await getTrayIds()

        await productLoop(idsList, 0)

        res.send('ok')

        async function getTrayIds(): Promise<any[]>{
            return new Promise(resolve => {

                const sql = `SELECT tray_product_id, hub_id
                FROM tray_produtos
                WHERE tray_stock = 0 AND tray_store_id = 668385 AND tray_product_id > 0
                ORDER BY hub_id DESC`

                Connect.query(sql, (erro, resultado) => {
                    if( erro ) {
                        console.log(erro)
                    } else {
                        if(resultado.length > 0){
                            resolve(resultado)
                        } else {
                            res.send('nenhum produto com estoque')
                        }
                    }
                })

            })
        }

        async function productLoop(list: any[], index: number): Promise<void>{
            return new Promise(async(resolve) => {
                if(list.length > index){

                    await deleteTray(list[index].tray_product_id, MundialCredentials)
                    await updatePricing(list[index].hub_id)
                    await updateRules(list[index].hub_id)

                    console.log(`${list[index].tray_product_id} deletado com sucesso - ${index}/${list.length} restantes`)

                    resolve(productLoop(list, index+1))

                } else {
                    resolve()
                }

            })
        }

        async function deleteTray(trayId: number, storeCredentials: any): Promise<void>{
            return new Promise(resolve => {

                const query = `${storeCredentials.api_address}/products/${trayId}/?access_token=${storeCredentials.access_token}`
                Requests.saveRequest(query)
                
                const config: any = {
                    method: 'delete',
                    url: query,
                }

                axios(config)
                .then(response => {
                    if(response.data.code == 200){
                        resolve()
                    } else {
                        console.log(response.data)
                    }
                })
                .catch(erro => {
                    console.log(erro.response)
                    res.status(400).json({
                        code: 400,
                        message: `Erro ao deletar kit Id Tray ${trayId} - ${storeCredentials.store}, causas: ${erro.response.data}`
                    })
                })


            })
        }

        async function updatePricing(hubId: number): Promise<void>{
            return new Promise(resolve => {
            
                const sql = `UPDATE tray_produtos SET tray_product_id = 0 WHERE hub_id=${hubId}`

                Connect.query(sql, (erro, resultado) => {
                    if( erro ) {
                        console.log(erro)
                    } else {
                        resolve()
                    }
                })
            })
        }

        async function updateRules(hubId: number): Promise<void>{
            return new Promise(resolve => {
            
                const sql = `UPDATE produtos_kits SET tray_product_id = 0, tray_product_parent_id = 0 WHERE hub_id=${hubId}`

                Connect.query(sql, (erro, resultado) => {
                    if( erro ) {
                        console.log(erro)
                    } else {
                        resolve()
                    }
                })
            })
        }
    }
}

export default new List