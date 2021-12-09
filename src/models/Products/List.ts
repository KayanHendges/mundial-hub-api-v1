import { Response } from "express";
import Connect from "../../database/Connect";

class ProductsList {

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
}

export default ProductsList