import axios from "axios"
import { Response } from "express"
import Connect from "../../database/Connect"
import OAuth2Tray from "../Auth/OAuth2Tray"
import Requests from "../Tray/Requests"


class Products {

    async unitary(reference: number, res: Response){
        
        const sqlProduct = `SELECT hub_id, ean, ncm, product_name, product_description, brand, model, weight, length, width, height, main_category_id, related_categories, availability, availability_days, reference, picture_source_1, picture_source_2, picture_source_3, picture_source_4, picture_source_5, picture_source_6, comments FROM produtos WHERE reference=${reference}`
        
        const product = await getProduct(sqlProduct)
        const mundialPricing = await getPricing(product.hub_id, 668385)
        const scpneusPricing = await getPricing(product.hub_id, 1049898)

        res.status(200).json({
            code: 200,
            product: {
                hubId: product.hub_id,
                ean: product.ean,
                ncm: product.ncm,
                name: product.product_name,
                description: product.product_description == null ? '' : product.product_description,
                pricing: {
                    mundial: {
                        tray_id: mundialPricing.tray_product_id,
                        cost: mundialPricing.cost_price,
                        profit: mundialPricing.profit >= 2 ? mundialPricing.profit : mundialPricing.profit == 0 ? 0 : (mundialPricing.profit*100)-100,
                        price: mundialPricing.tray_price,
                        promotionalPrice: mundialPricing.tray_promotional_price,
                        startPromotion: mundialPricing.start_promotion == '0000-00-00 00:00:00' ? '' : mundialPricing.start_promotion,
                        endPromotion: mundialPricing.end_promotion == '0000-00-00 00:00:00' ? '' : mundialPricing.end_promotion,
                        stock: mundialPricing.tray_stock
                    },
                    scpneus: {
                        tray_id: scpneusPricing.tray_product_id,
                        cost: scpneusPricing.cost_price,
                        profit: scpneusPricing.profit >= 2 ? scpneusPricing.profit : scpneusPricing.profit == 0 ? 0 : (scpneusPricing.profit*100)-100,
                        price: scpneusPricing.tray_price,
                        promotionalPrice: scpneusPricing.tray_promotional_price,
                        startPromotion: scpneusPricing.start_promotion == '0000-00-00 00:00:00' ? '' : scpneusPricing.start_promotion,
                        endPromotion: scpneusPricing.end_promotion == '0000-00-00 00:00:00' ? '' : scpneusPricing.end_promotion,
                        stock: scpneusPricing.tray_stock
                    }
                },
                brand: product.brand,
                model: product.model,
                weight: product.weight,
                length: product.length,
                width: product.width,
                height: product.height,
                mainCategoryId: product.main_category_id,
                related_categories: (product.related_categories.length > 0 ? product.related_categories.split(',') : []).map((category: string) => {
                    return parseInt(category)
                }),
                availability: product.availability,
                availabilityDays: product.availability_days,
                reference: product.reference,
                images: [
                    {imageUrl: product.picture_source_1},
                    {imageUrl: product.picture_source_2},
                    {imageUrl: product.picture_source_3},
                    {imageUrl: product.picture_source_4},
                    {imageUrl: product.picture_source_5},
                    {imageUrl: product.picture_source_6}
                ],
                comments: product.comments == null ? '' : product.comments,
            }
        })

        async function getProduct(sql: string): Promise<any>{
            return new Promise(async(resolve) => {
                Connect.query(sql, (erro, resultado) => {
                    if(erro){
                        console.log(erro)
                        res.status(400).json({code: 400, message: 'problemas ao se conectar ao banco de dados'})
                    } else {
                        if(resultado.length > 0){
                            resolve(resultado[0])
                        } else {
                            res.status(400).json({code: 400, message: `nenhum produto encontrado com a referencia ${reference}`})
                        }
                    }
                })
            })
        }

        async function getPricing(hubId: number, store: number): Promise<any>{
            return new Promise(resolve => {

                const sql = `SELECT tray_product_id, cost_price, profit, tray_price, tray_promotional_price, start_promotion, end_promotion, tray_stock FROM tray_produtos WHERE hub_id=${hubId} AND tray_store_id=${store}`

                Connect.query(sql, (erro, resultado) => {
                    if(erro){
                        console.log(erro)
                        res.status(400).json({code: 400, message: 'problemas ao se conectar ao banco de dados'})
                    } else {
                        if(resultado.length > 0){
                            resolve(resultado[0])
                        } else {
                            resolve({
                                tray_product_id: 0,
                                cost_price: 0,
                                profit: 0,
                                tray_price: 0,
                                tray_promotional_price: 0,
                                start_promotion: '',
                                end_promotion: '',
                                tray_stock: 0
                            })
                        }
                    }
                })
            })
        }

    }

    async kits(reference: string, res: Response){
        
        const kit2 = await getKit(2)
        const kit4 = await getKit(4)

        res.status(200).json({
            code: 200,
            kit2: {
                hubId: kit2.hub_id,
                trayId: kit2.tray_product_id,
                name: kit2.product_name,
                description: kit2.product_description == null ? '' : kit2.product_description,
                images: [
                    {imageUrl: kit2.picture_source_1},
                    {imageUrl: kit2.picture_source_2},
                    {imageUrl: kit2.picture_source_3},
                    {imageUrl: kit2.picture_source_4},
                    {imageUrl: kit2.picture_source_5},
                    {imageUrl: kit2.picture_source_6}
                ],
                rules: {
                    discountType: kit2.discount_type,
                    discountValue: kit2.discount_value.toString().replace(".", ","),
                    priceRule: kit2.price_rule,
                }
            },
            kit4: {
                hubId: kit4.hub_id,
                trayId: kit4.tray_product_id,
                name: kit4.product_name,
                description: kit4.product_description == null ? '' : kit4.product_description,
                images: [
                    {imageUrl: kit4.picture_source_1},
                    {imageUrl: kit4.picture_source_2},
                    {imageUrl: kit4.picture_source_3},
                    {imageUrl: kit4.picture_source_4},
                    {imageUrl: kit4.picture_source_5},
                    {imageUrl: kit4.picture_source_6}
                ],
                rules: {
                    discountType: kit4.discount_type,
                    discountValue: kit4.discount_value.toString().replace(".", ","),
                    priceRule: kit4.price_rule,
                }
            }
        })        

        async function getKit(quantity: number): Promise<any>{
            return new Promise(resolve => {
                const sql = `SELECT
                t.hub_id, t.tray_product_id, p.product_name, p.product_description,
                p.picture_source_1, p.picture_source_2, p.picture_source_3, p.picture_source_4, p.picture_source_5, p.picture_source_6,
                k.discount_type, k.discount_value, k.price_rule 
                FROM tray_produtos t JOIN produtos_kits k ON t.tray_pricing_id=k.tray_pricing_id JOIN produtos p ON p.hub_id=t.hub_id WHERE t.tray_store_id=668385 AND p.reference=${reference} AND k.quantity=${quantity}`

                Connect.query(sql, (erro, resultado) => {
                    if(erro){
                        console.log(erro)
                        res.status(400).json({ code: 400, message: 'erro ao se conectar ao banco de dados' })
                    } else {
                        if(resultado.length > 0){
                            resolve(resultado[0])
                        } else {
                            resolve({
                                hub_id: 0,
                                tray_product_id: 0,
                                product_name: '',
                                product_description: '',
                                picture_source_1: '',
                                picture_source_2: '',
                                picture_source_3: '',
                                picture_source_4: '',
                                picture_source_5: '',
                                picture_source_6: '',
                                discount_type: '%',
                                discount_value: quantity == 2 ? '2,5' : '5',
                                price_rule: '2',
                            })
                        }
                    }
                })
            })
        }
    }

    async updateImages(reference: number, res: Response){

        const MundialCredentials = await OAuth2Tray.getStoreCredentials(668385)
        const ScPneusCredentials = await OAuth2Tray.getStoreCredentials(1049898)

        const products = await getProducts(reference)
        const productScPneus = await getProductScPneus(reference)

        await productLoop(products, 0)
        await postTraySC(productScPneus)

        res.status(200).json({
            code: 200,
            message: 'imagens atualizadas com sucesso'
        })

        async function getProducts(reference: number): Promise<any>{
            return new Promise(resolve => {
                const sql = `SELECT t.hub_id, t.tray_product_id
                FROM produtos p JOIN tray_produtos t ON p.hub_id = t.hub_id
                WHERE p.reference = ${reference} AND t.tray_store_id = 668385`

                Connect.query(sql, (erro, resultados) => {
                    if(erro){
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao se conectar ao banco de dados'
                        })
                        console.log(erro)
                    } else {
                        if(resultados.length > 0){
                            resolve(resultados)
                        } else {
                            res.status(400).json({
                                code: 400,
                                message: 'erro ao se conectar ao banco de dados'
                            })
                        }
                    }
                })
            })
        }

        async function getProductScPneus(reference: number): Promise<any>{
            return new Promise(resolve => {
                const sql = `SELECT t.tray_product_id, p.picture_source_1, p.picture_source_2, p.picture_source_3, p.picture_source_4,
                p.picture_source_5, p.picture_source_6
                FROM produtos p JOIN tray_produtos t ON p.hub_id = t.hub_id
                WHERE p.reference = ${reference} AND p.is_kit=0 AND t.tray_store_id = 1049898`

                Connect.query(sql, (erro, resultados) => {
                    if(erro){
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao se conectar ao banco de dados'
                        })
                        console.log(erro)
                    } else {
                        if(resultados.length > 0){
                            resolve(resultados[0])
                        } else {
                            res.status(400).json({
                                code: 400,
                                message: 'erro ao se conectar ao banco de dados'
                            })
                        }
                    }
                })
            })
        }

        async function productLoop(list: any[], index: number): Promise<void>{
            return new Promise(async(resolve) => {
                await getImages(list[index])
                setTimeout(() => {
                    if(list.length > index+1){
                        resolve(productLoop(list, index+1))
                    } else {
                        resolve()
                    }
                }, 340)
            })
        }

        async function getImages(product: any){
            return new Promise(resolve => {
                
                const query = `${MundialCredentials.api_address}/products/${product.tray_product_id}?access_token=${MundialCredentials.access_token}`
                Requests.saveRequest(query)

                axios.get(query)
                .then(response => {
                    if(response.data.Product != undefined){
                        const productImages = response.data.Product.ProductImage
                        const images = {
                            picture_source_1: productImages[0] != undefined ? productImages[0].https : "",
                            picture_source_1_90: productImages[0] ? productImages[0].thumbs[90].https : "",
                            picture_source_2: productImages[1] != undefined ? productImages[1].https : "",
                            picture_source_2_90: productImages[1] ? productImages[1].thumbs[90].https : "",
                            picture_source_3: productImages[2] != undefined ? productImages[2].https : "",
                            picture_source_3_90: productImages[2] ? productImages[2].thumbs[90].https : "",
                            picture_source_4: productImages[3] != undefined ? productImages[3].https : "",
                            picture_source_4_90: productImages[3] ? productImages[3].thumbs[90].https : "",
                            picture_source_5: productImages[4] != undefined ? productImages[4].https : "",
                            picture_source_5_90: productImages[4] ? productImages[4].thumbs[90].https : "",
                            picture_source_6: productImages[5] != undefined ? productImages[5].https : "",
                            picture_source_6_90: productImages[5] ? productImages[5].thumbs[90].https : "", 
                        }
                        resolve(saveImagesDB(product, images))
                    } else {
                        console.log(response.data)
                        res.status(400).json({
                            code: 400,
                            message: `erro ao procurar imagens na tray com id ${product.tray_product_id}`
                        })
                    }
                }).catch(erro => {
                    console.log(erro)
                    res.status(400).json({
                        code: 400,
                        message: `erro ao procurar imagens na tray com id ${product.tray_product_id}`
                    })
                })
            })
        }

        async function saveImagesDB(product: any, images: any): Promise<any>{
            return new Promise(resolve => {
                const sql = `UPDATE produtos SET ? WHERE hub_id = ${product.hub_id}`
    
                Connect.query(sql, images, (erro, resultado) => {
                    if(erro){
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao se conectar ao banco de dados ao salvar imagens'
                        })
                    } else {
                        resolve({success: true, images: images})
                    }
                })
            })
        }

        async function postTraySC(product: any): Promise<any>{
            return new Promise(async(resolve, reject) => {

                const productObj = {
                    Product: {
                        picture_source_1: product.picture_source_1,
                        picture_source_2: product.picture_source_2,
                        picture_source_3: product.picture_source_3,
                        picture_source_4: product.picture_source_4,
                        picture_source_5: product.picture_source_5,
                        picture_source_6: product.picture_source_6,
                    }
                }
                const trayProduct = JSON.stringify(productObj)

                const query = `${ScPneusCredentials.api_address}/products/${product.tray_product_id}?access_token=${ScPneusCredentials.access_token}`
                Requests.saveRequest(query)

                const config: any = {
                    method: 'put',
                    url: query,
                    headers: { 
                      'Content-Type': 'application/json'
                    },
                    data: trayProduct
                }

                axios(config)
                .then(response => {
                    if(response.data.code == 200){
                        resolve({
                            success: true
                        })
                    } else {
                        console.log(response.data)
                    }
                })
                .catch(erro => {
                    console.log(erro.response.data.causes)
                    res.status(400).json({
                        code: 400,
                        message: `Erro ao atualiazar produto Id Tray ${product.tray_product_id} na SC Pneus, causas: ${erro.response.data}`
                    })
                })
            })
        }
    }

}

export default Products