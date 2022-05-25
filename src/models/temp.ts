import { Request, response, Response } from "express"
import Connect from "../database/Connect"
import fs from 'fs';
import TrayProducts from "../services/Tray/TrayProducts";
import OAuth2Tray from "./Auth/OAuth2Tray";
import ProductDataBase from "../services/Products/ProductDataBase";
import { getTime } from "date-fns";
import axios from "axios";
import sleep from "../services/sleep";

class Temp {

    async Temp(req: Request, res: Response){    

        const errorProducts = fs.readFileSync(`./src/files/google-errors-products.txt`, 'utf8',)
        const getCredentials = OAuth2Tray.getStoreCredentials(1049898)
        const getwhiteListProducts = getWhiteList(errorProducts)
        const getAllProducts = getProductsToDelete()

        const { "0": whiteList, "1": allProducts, "2": storeCredentiasl } = await Promise.all([
            getwhiteListProducts,
            getAllProducts,
            getCredentials
        ])

        const productsToHandle = []

        allProducts.map( product => {
            var isWhiteProduct = false
            whiteList.map( whiteProduct => {
                if(product.hub_id == whiteProduct.hub_id){
                    isWhiteProduct = true
                }
            })
            if(!isWhiteProduct){
                productsToHandle.push(product)
            }
        })


        console.log(allProducts.length, productsToHandle.length, whiteList.length)

        await deleteLoop(productsToHandle, 0)

        res.send(productsToHandle)

        async function deleteLoop(list: any[], index: number): Promise<void>{
            return new Promise(async(resolve) => {
                if(list.length > index){
                    resolve()
                    return
                }

                const start = getTime(new Date())
                const product = list[index]

                if(!product){
                    resolve()
                    return
                }

                const deleted = await TrayProducts.delete(storeCredentiasl, product.tray_product_id)
                .then(response => { return true })
                .catch( err => { console.log('erro ao excluir', product.tray_product_id); return false } )

                if(!deleted){
                    resolve()
                    return
                }

                const sqlCondition = `tray_store_id = 1049898 and tray_pricing_id = ${product.tray_pricing_id}`

                const updated = await ProductDataBase.updatePricing({ tray_product_id: 0 }, sqlCondition)
                .then(response => { return true })
                .catch( err => { console.log('erro ao atualizar', product.tray_product_id); return false } )

                const end = getTime(new Date())
                const executionTime = end - start

                console.log(`${Math.ceil(( ((index+1)/list.length) * 100 ))}% ${index+1}/${list.length} - concluído em ${executionTime} ms`)

                setTimeout(() => {
                    resolve(deleteLoop(list, index + 1))
                }, 340 - executionTime)

            })
        }

        async function getWhiteList(errorProducts: string): Promise<any[]>{
            return new Promise((resolve, reject) => {
                const sql = `SELECT *
                FROM produtos p JOIN tray_produtos tp ON p.hub_id=tp.hub_id
                WHERE p.is_kit = 0 AND tp.tray_store_id = 1049898 AND tray_product_id NOT IN (${errorProducts})
                AND p.ean NOT LIKE ''`
                
                Connect.query(sql, (err, result) => {
    
                    if(err){
                        console.log(err)
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
                
            })
        }

        async function getProductsToDelete(): Promise<any[]>{
            return new Promise((resolve, reject) => {
                const sql = `SELECT *
                FROM produtos p JOIN tray_produtos tp ON p.hub_id=tp.hub_id
                WHERE p.is_kit = 0 AND tp.tray_store_id = 1049898 AND tray_product_id > 0`
                
                Connect.query(sql, (err, result) => {
    
                    if(err){
                        console.log(err)
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
                
            })
        }
    }

    async Temp2(req: Request, res: Response){    

        const trayProducts = []

        const getCredentials = OAuth2Tray.getStoreCredentials(1049898)
        const getAllProducts = getProductsToDelete()

        const { "0": allProducts, "1": storeCredentials  } = await Promise.all([
            getAllProducts,
            getCredentials
        ])

        await getTrayProducts(storeCredentials, 1)
        .catch(err => { console.log(err) })

        const productsToHandle = []

        trayProducts.map(trayProduct => {
            var isIncluded = false
            allProducts.map(product => {
                if(product.tray_product_id == trayProduct){
                    isIncluded = true
                }
            })
            if(!isIncluded){
                productsToHandle.push(trayProduct)
            }
        })
        
        console.log(productsToHandle.length)

        res.send(productsToHandle)

        async function deleteLoop(list: any[], index: number): Promise<void>{
            return new Promise(async(resolve) => {
                if(list.length > index){
                    resolve()
                    return
                }

                const start = getTime(new Date())
                const product = list[index]

                if(!product){
                    resolve()
                    return
                }

                const deleted = await TrayProducts.delete(storeCredentials, product.tray_product_id)
                .then(response => { return true })
                .catch( err => { console.log('erro ao excluir', product.tray_product_id); return false } )

                if(!deleted){
                    resolve()
                    return
                }

                const sqlCondition = `tray_store_id = 1049898 and tray_pricing_id = ${product.tray_pricing_id}`

                const updated = await ProductDataBase.updatePricing({ tray_product_id: 0 }, sqlCondition)
                .then(response => { return true })
                .catch( err => { console.log('erro ao atualizar', product.tray_product_id); return false } )

                const end = getTime(new Date())
                const executionTime = end - start

                console.log(`${Math.ceil(( ((index+1)/list.length) * 100 ))}% ${index+1}/${list.length} - concluído em ${executionTime} ms`)

                setTimeout(() => {
                    resolve(deleteLoop(list, index + 1))
                }, 340 - executionTime)

            })
        }

        async function getTrayProducts(store: any, page: number): Promise<void>{
            return new Promise((resolve, reject) => {
                
                const query = `${store.api_address}/products/?page=${page}&limit=50&access_token=${store.access_token}`

                const config: any = {
                    method: 'get',
                    url: query,
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                }

                axios(config)
                .then(async(response) => {

                    const products = response?.data?.Products
                    if(products.length == 0){
                        resolve()
                        return
                    }

                    products?.map( product => {
                        const id = parseInt(product.Product.id)
                        trayProducts.push(id)
                    })

                    await sleep(340)

                    resolve(getTrayProducts(store, page + 1))
                })
                .catch(erro => {
                    reject(erro)
                })
                    
            })
        }

        async function getProductsToDelete(): Promise<any[]>{
            return new Promise((resolve, reject) => {
                const sql = `SELECT *
                FROM produtos p JOIN tray_produtos tp ON p.hub_id=tp.hub_id
                WHERE p.is_kit = 0 AND tp.tray_store_id = 1049898 AND tray_product_id > 0`
                
                Connect.query(sql, (err, result) => {
    
                    if(err){
                        console.log(err)
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
                
            })
        }
    }
}

export default new Temp