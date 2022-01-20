import axios from "axios"
import { format, parseISO } from "date-fns"
import { Response } from "express"
import Connect from "../../database/Connect"
import Datetime from "../../services/datetime"
import OAuth2Tray from "../Auth/OAuth2Tray"
import Requests from "../Tray/Requests"
import ConvertCategories from "../Categories/ConvertCategories"

interface ProductIds {
    hubId: number;
    trayId: number;
    isKit: number;
}

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

    async create(values: any, res: Response){

        const MundialCredentials = await OAuth2Tray.getStoreCredentials(668385)
        const ScPneusCredentials = await OAuth2Tray.getStoreCredentials(1049898)

        const unitary = await validateUnitary(values.unitary)
        const kit2 = await validateKit(values.unitary, values.kit2, 2)
        const kit4 = await validateKit(values.unitary, values.kit4, 4)

        const unitaryMundial = await postTrayUnitary(unitary.product, unitary.pricing.mundial, MundialCredentials)
        const unitaryScPneus = await postTrayUnitary(unitary.product, unitary.pricing.scpneus, ScPneusCredentials)
        const unitaryDB = unitaryMundial.success && unitaryScPneus.success ? await saveUnitaryDB(unitary) : res.status(400).json({
            code: 400,
            message: 'erro ao salvar unitário e/ou precificação no banco de dados'
        })

        const kit2Mundial = kit2 == false ? false : await postTrayKit(kit2.kit, kit2.pricing.mundial, kit2.rules, 2)
        const kit4Mundial = kit4 == false ? false : await postTrayKit(kit4.kit, kit4.pricing.mundial, kit4.rules, 4)
        
        res.status(201).json({
            code: 200,
            message: 'produto salvo com sucesso'
        })

        async function validateUnitary(unitary: any): Promise<any>{

            const object = {
                product: {
                    is_kit: 0,
                    ean: unitary.ean,
                    ncm: unitary.ncm,
                    product_name: unitary.name,
                    product_description: unitary.description,
                    brand: unitary.brand,
                    model: unitary.model,
                    weight: parseInt(unitary.weight),
                    length: parseInt(unitary.length),
                    width: parseInt(unitary.width),
                    height: parseInt(unitary.height),
                    main_category_id: unitary.mainCategoryId,
                    related_categories: unitary.related_categories.length > 0 ? unitary.related_categories.join() : '',
                    available: 1,
                    release_date: '',
                    availability: unitary.availability,
                    availability_days: parseInt(unitary.availabilityDays),
                    reference: unitary.reference,
                    picture_source_1: unitary.images[0].imageUrl,
                    picture_source_2: unitary.images[1].imageUrl,
                    picture_source_3: unitary.images[2].imageUrl,
                    picture_source_4: unitary.images[3].imageUrl,
                    picture_source_5: unitary.images[4].imageUrl,
                    picture_source_6: unitary.images[5].imageUrl,
                    type: 'description',
                    content: unitary.name,
                    virtual_product: '',
                    creation_date: await Datetime(),
                    modified: await Datetime(),
                    comments: unitary.comments
                },
                pricing: {
                    mundial: {
                        is_kit: 0,
                        cost_price: parseFloat(unitary.pricing.mundial.cost.replace(',', '.')),
                        profit: typeof(unitary.pricing.mundial.profit) == "string" ? parseFloat(unitary.pricing.mundial.profit.replace(',', '.')) : unitary.pricing.mundial.profit,
                        tray_price: parseFloat(unitary.pricing.mundial.price.replace(',', '.')),
                        tray_promotional_price: parseFloat(unitary.pricing.mundial.promotionalPrice.replace(',', '.')),
                        start_promotion: unitary.pricing.mundial.startPromotion.length > 0 ? format(parseISO(unitary.pricing.mundial.startPromotion), 'yyyy-MM-dd 00:00:00' ) : '',
                        end_promotion: unitary.pricing.mundial.startPromotion.length > 0 ? format(parseISO(unitary.pricing.mundial.endPromotion), 'yyyy-MM-dd 00:00:00' ) : '',
                        tray_stock: parseInt(unitary.pricing.mundial.stock),
                        tray_minimum_stock: 1,
                        tray_main_category_id: await ConvertCategories.hubMainCategoryToTray(unitary.mainCategoryId, 668385),
                        tray_related_categories: unitary.related_categories.length > 0 ? (await ConvertCategories.hubRelatedCategoriesToTray(unitary.related_categories, 668385)).join() : '',
                        modified: await Datetime()
                    },
                    scpneus: {
                        is_kit: 0,
                        cost_price: parseFloat(unitary.pricing.scpneus.cost.replace(',', '.')),
                        profit: typeof(unitary.pricing.scpneus.profit) == "string" ? parseFloat(unitary.pricing.scpneus.profit.replace(',', '.')) : unitary.pricing.scpneus.profit,
                        tray_price: parseFloat(unitary.pricing.scpneus.price.replace(',', '.')),
                        tray_promotional_price: parseFloat(unitary.pricing.scpneus.promotionalPrice.replace(',', '.')),
                        start_promotion: unitary.pricing.scpneus.startPromotion.length > 0 ? format(parseISO(unitary.pricing.scpneus.startPromotion), 'yyyy-MM-dd 00:00:00' ) : '',
                        end_promotion: unitary.pricing.scpneus.startPromotion.length > 0 ? format(parseISO(unitary.pricing.scpneus.endPromotion), 'yyyy-MM-dd 00:00:00' ) : '',
                        tray_stock: parseInt(unitary.pricing.scpneus.stock),
                        tray_minimum_stock: 1,
                        tray_main_category_id: await ConvertCategories.hubMainCategoryToTray(unitary.mainCategoryId, 1049898),
                        tray_related_categories: unitary.related_categories.length > 0 ? (await ConvertCategories.hubRelatedCategoriesToTray(unitary.related_categories, 1049898)).join() : '',
                        modified: await Datetime()
                    }
                }, 
            }

            return object
        }

        async function validateKit(unitary: any, kit: any, quantity: any): Promise<any>{

            function kitPrice(price: any, priceRule: any, discountType: any, discountValue: any){
                if(price == 0){
                    return price
                }
                if(parseInt(priceRule) == 1) {
                    return price
                }
                if(parseInt(priceRule) == 2) {
                    if(discountType == '$'){
                        return price-discountValue
                    }
                    if(discountType == '%'){
                        return price-(price*discountValue/100)
                    }
                }
            }

            const relatedCategories = unitary.related_categories 
            relatedCategories.push(520)
            relatedCategories.push(quantity == 2 ? 581 : 540)

            const object = {
                kit: {
                    is_kit: 1,
                    ean: unitary.ean,
                    ncm: unitary.ncm,
                    product_name: kit.name,
                    product_description: kit.description,
                    brand: unitary.brand,
                    model: unitary.model,
                    weight: parseInt(unitary.weight)*quantity,
                    length: parseInt(unitary.length),
                    width: parseInt(unitary.width)*quantity,
                    height: parseInt(unitary.height),
                    main_category_id: unitary.mainCategoryId,
                    related_categories: unitary.related_categories.length > 0 ? unitary.related_categories.join() : '',
                    availability: unitary.availability,
                    availability_days: parseInt(unitary.availabilityDays),
                    reference: unitary.reference,
                    picture_source_1: kit.images[0].imageUrl,
                    picture_source_2: kit.images[1].imageUrl,
                    picture_source_3: kit.images[2].imageUrl,
                    picture_source_4: kit.images[3].imageUrl,
                    picture_source_5: kit.images[4].imageUrl,
                    picture_source_6: kit.images[5].imageUrl,
                    release_date: '',
                    type: 'description',
                    content: kit.name,
                    virtual_product: '',
                    modified: await Datetime(),
                    creation_date: await Datetime(),
                    comments: unitary.comments
                },
                pricing: {
                    mundial: {
                        modified: await Datetime(),
                        is_kit: 1,
                        cost_price: parseFloat(unitary.pricing.mundial.cost.replace(',', '.'))*quantity,
                        profit: (typeof(unitary.pricing.mundial.profit) == "string" ? parseFloat(unitary.pricing.mundial.profit.replace(',', '.')) : unitary.pricing.mundial.profit),
                        tray_price: kitPrice(
                            parseFloat(unitary.pricing.mundial.price.replace(',', '.'))*quantity,
                            kit.rules.priceRule,
                            kit.rules.discountType,
                            parseFloat(kit.rules.discountValue.replace(',', '.'))
                            ),
                        tray_promotional_price: unitary.pricing.mundial.promotionalPrice.length > 0 ? kitPrice(
                            parseFloat(unitary.pricing.mundial.promotionalPrice.replace(',', '.'))*quantity,
                            kit.rules.priceRule,
                            kit.rules.discountType,
                            parseFloat(kit.rules.discountValue.replace(',', '.'))
                            ) : '',
                        start_promotion: unitary.pricing.mundial.startPromotion.length > 0 ? format(parseISO(unitary.pricing.mundial.startPromotion), 'yyyy-MM-dd 00:00:00' ) : '',
                        end_promotion: unitary.pricing.mundial.startPromotion.length > 0 ? format(parseISO(unitary.pricing.mundial.endPromotion), 'yyyy-MM-dd 00:00:00' ) : '',
                        tray_stock: parseInt(unitary.pricing.mundial.stock) == 0 ? 0 : Math.floor(parseInt(unitary.pricing.mundial.stock)/quantity),
                        tray_minimum_stock: 1,
                        tray_main_category_id: await ConvertCategories.hubMainCategoryToTray(unitary.mainCategoryId, 668385),
                        tray_related_categories: unitary.related_categories.length > 0 ? (await ConvertCategories.hubRelatedCategoriesToTray(relatedCategories, 668385)).join() : ''
                    },
                },
                rules: {
                    quantity: quantity,
                    discount_type: kit.rules.discountType,
                    discount_value: typeof(kit.rules.discountValue) == 'string' ? parseFloat(kit.rules.discountValue.replace(',', '.')) : parseFloat(kit.rules.discountValue) ,
                    price_rule: kit.rules.priceRule,
                    modified: await Datetime(),
                    creation_date: await Datetime(),
                }
            }

            return object
        }

        async function postTrayUnitary(product: any, pricing: any, store: any): Promise<any>{
            return new Promise(async(resolve, reject) => {

                const productObj = {
                    Product: {
                        is_kit: 0,
                        ean: product.ean,
                        name: product.product_name,
                        ncm: product.ncm,
                        description: product.product_description,
                        price: pricing.tray_price,
                        cost_price: pricing.cost_price,
                        promotional_price: pricing.tray_promotional_price,
                        start_promotion: pricing.start_promotion,
                        end_promotion: pricing.end_promotion,
                        brand:product.brand,
                        model:product.model,
                        weight: product.weight,
                        length: product.length,
                        width: product.width,
                        height: product.height,
                        stock: pricing.tray_stock,
                        minimum_stock: pricing.tray_minimum_stock,
                        minimum_stock_alert: '1',
                        category_id: pricing.tray_main_category_id,
                        available: product.available,
                        availability: product.availability,
                        availability_days: product.availability_days,
                        reference: product.reference,
                        hot: "1",
                        release: "1",
                        // additional_button: "0",
                        related_categories: pricing.tray_related_categories.length > 0 ? pricing.tray_related_categories.split(',') : [],
                        // release_date: "",
                        picture_source_1: product.picture_source_1,
                        picture_source_2: product.picture_source_2,
                        picture_source_3: product.picture_source_3,
                        picture_source_4: product.picture_source_4,
                        picture_source_5: product.picture_source_5,
                        picture_source_6: product.picture_source_6,
                        metatag:[{type: "description",
                        content: product.product_name,
                        local:1}],
                        // virtual_product: product.virtual_product
                    }
                }
                const trayProduct = JSON.stringify(productObj)

                const query = `${store.api_address}/products/?access_token=${store.access_token}`
                Requests.saveRequest(query)

                const config: any = {
                    method: 'post',
                    url: query,
                    headers: { 
                      'Content-Type': 'application/json'
                    },
                    data: trayProduct
                }

                axios(config)
                .then(response => {
                    if(response.data.code == 201){
                        resolve({
                            success: true,
                            id: response.data.id
                        })
                    } else {
                        console.log(response.data)
                    }
                })
                .catch(erro => {
                    console.log(erro)
                    console.log(erro.response.data.causes)
                    res.status(400).json({
                        code: 400,
                        message: `Erro ao criar unitário na Tray ${store.tray_adm_user}, causas: ${erro.response.data}`
                    })
                })
            })
        }

        async function saveUnitaryDB(product: any): Promise<any>{
            return new Promise(async(resolve) => {

                const sql = `INSERT INTO produtos SET ?`

                Connect.query(sql, product.product, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao salvar unitário no banco de dados'
                        })
                    } else {
                        const hubId = resultado.insertId
                        resolve(saveUnitaryPricingDB(product, product.pricing.mundial, MundialCredentials, hubId, unitaryMundial.id))
                    }
                })
            })
        }

        async function saveUnitaryPricingDB(product: any, pricing: any, store: any, hubId: any, trayId: any): Promise<any>{
            return new Promise(async(resolve) => {

                const pricingSql = {
                    ...pricing,
                    tray_store_id: store.store,
                    tray_adm_user: store.tray_adm_user,
                    hub_id: hubId,
                    tray_product_id: trayId
                }

                const sql = `INSERT INTO tray_produtos SET ?` 
                
                Connect.query(sql, pricingSql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: `erro ao salvar a precificação do unitário com tray_product_id=${trayId}`
                        })
                    } else {
                        if (store.store == 668385){
                            resolve(saveUnitaryPricingDB(product, product.pricing.scpneus, ScPneusCredentials, hubId, unitaryScPneus.id))
                        }
                        if (store.store == 1049898) {
                            resolve({success: true})
                        }
                    }
                })
            })
        }

        async function postTrayKit(kit: any, pricing: any, rules: any, quantity: any): Promise<any>{
            return new Promise(async(resolve) => {
                const productObj = {
                    Product: {
                        is_kit: 1,
                        ean: kit.ean,
                        name: kit.product_name,
                        ncm: kit.ncm,
                        description: kit.product_description,
                        price: pricing.tray_price,
                        cost_price: pricing.cost_price,
                        // promotional_price: pricing.tray_promotional_price,
                        // start_promotion: pricing.start_promotion,
                        // end_promotion: pricing.end_promotion,
                        brand:kit.brand,
                        model:kit.model,
                        weight: kit.weight,
                        length: kit.length,
                        width: kit.width,
                        height: kit.height,
                        // stock: pricing.tray_stock,
                        category_id: pricing.tray_main_category_id,
                        available: 1,
                        availability: kit.availability,
                        availability_days: kit.availability_days,
                        reference: kit.reference,
                        hot: "1",
                        release: "1",
                        // additional_button: "0",
                        related_categories: pricing.tray_related_categories.length > 0 ? pricing.tray_related_categories.split(',') : [],
                        release_date: "",
                        picture_source_1: kit.picture_source_1,
                        picture_source_2: kit.picture_source_2,
                        picture_source_3: kit.picture_source_3,
                        picture_source_4: kit.picture_source_4,
                        picture_source_5: kit.picture_source_5,
                        picture_source_6: kit.picture_source_6,
                        metatag:[{type: "description",
                        content: kit.product_name,
                        local:1}],
                        // virtual_product: kit.virtual_product
                    }
                }
                const trayProduct = JSON.stringify(productObj)

                const query = `${MundialCredentials.api_address}/products/?access_token=${MundialCredentials.access_token}`
                Requests.saveRequest(query)

                const config: any = {
                    method: 'post',
                    url: query,
                    headers: { 
                      'Content-Type': 'application/json'
                    },
                    data: trayProduct
                }

                axios(config)
                .then(response => {
                    if(response.data.code == 201){
                        resolve(saveKitDB(kit, pricing, rules, response.data.id))
                    } else {
                        console.log(response.data)
                    }
                })
                .catch(erro => {
                    console.log(erro.response.data.causes)
                    res.status(400).json({
                        code: 400,
                        message: `Erro ao criar kit Tray mundial, causas: ${JSON.stringify(erro.response.data.causes)}`
                    })
                })
            })
        }

        async function saveKitDB(kit: any, pricing: any, rules: any, trayId: any): Promise<any>{
            return new Promise(async(resolve) => {

                const sql = `INSERT INTO produtos SET ?`

                Connect.query(sql, kit, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: `erro ao salvar o kit no banco de dados`
                        })
                    } else {
                        const hubId = resultado.insertId
                        resolve(saveKitPricingDB(kit, pricing, rules, hubId, trayId))
                    }
                })
            })
        }

        async function saveKitPricingDB(kit: any, pricing: any, rules: any, hubId: any, trayId: any): Promise<any>{
            return new Promise(async(resolve) => {
                const sql = `INSERT INTO tray_produtos SET ?`

                const pricingSql = {
                    ...pricing,
                    tray_store_id: MundialCredentials.store,
                    tray_adm_user: MundialCredentials.tray_adm_user,
                    hub_id: hubId,
                    tray_product_id: trayId,
                }

                Connect.query(sql, pricingSql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: `erro ao salvar o pricing do kit hub_id ${kit.hub_id} no banco de dados`
                        })
                    } else {
                        const trayPricingId = resultado.insertId
                        resolve(postTrayRules(kit, pricing, rules, hubId, trayId, trayPricingId))
                    }
                })
            })
        }

        async function postTrayRules(kit: any, pricing: any, rules: any, hubId: any, trayId: any, trayPricingId: any): Promise<any>{
            return new Promise(async(resolve) => {

                const rulesObj = JSON.stringify([{
                    product_parent_id: trayId,
                    product_id: unitaryMundial.id,
                    quantity: rules.quantity,
                    discount_type: rules.discount_type,
                    discount_value: rules.discount_value,
                    price_rule: parseInt(rules.price_rule)
                }])

                const query = `${MundialCredentials.api_address}/products/kits/?access_token=${MundialCredentials.access_token}`
                Requests.saveRequest(query)

                const config: any = {
                    method: 'post',
                    url: query,
                    headers: { 
                      'Content-Type': 'application/json'
                    },
                    data: rulesObj
                }

                axios(config)
                .then(response => {
                    if(response.data.code == 201){
                        resolve(saveRulesDB(kit, pricing, rules, hubId, trayId, trayPricingId, response.data.id))
                    } else {
                        console.log(response.data)
                    }
                })
                .catch(erro => {
                    console.log(erro)
                    console.log(erro.response.data.causes)
                    res.status(400).json({
                        code: 400,
                        message: `Erro ao salvar regras do kit Id Tray ${pricing.tray_product_id} - 668385, causas: ${erro.response.data}`
                    })
                })
            })
        }

        async function saveRulesDB(kit: any, pricing: any, rules: any, hubId: any, trayId: any, trayPricingId: any, trayRuleId: any): Promise<any>{
            return new Promise(async(resolve) => {

                const ruleDB = {
                    tray_rule_id: trayRuleId,
                    tray_pricing_id: trayPricingId,
                    tray_product_id: unitaryMundial.id,
                    tray_product_parent_id: trayId,
                    hub_id: hubId,
                    quantity: rules.quantity,
                    kit_price: pricing.tray_promotional_price == 0 ? pricing.tray_price : pricing.tray_promotional_price, 
                    discount_type: rules.discount_type,
                    discount_value: rules.discount_value,
                    price_rule: rules.price_rule,
                    modified: await Datetime(),
                    creation_date: await Datetime()
                }

                const sql = `INSERT INTO produtos_kits SET ?`

                Connect.query(sql, ruleDB, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: `erro ao salvar regra do kit ${kit.quantity} no banco de dados`
                        })
                    } else {
                        resolve({success: true})
                    }
                })
            })
        }
    }

    async createKits(values: any, res: Response){

        const MundialCredentials = await OAuth2Tray.getStoreCredentials(668385)
        const kit = await (validateKit(values.unitary, values.kit, values.quantity))

        const kitTray = await postTrayKit(kit.kit, kit.pricing.mundial, kit.rules, values.quantity)

        if(kitTray.success){
            res.status(201).json({
                code: 201,
                message: `kit ${values.quantity} criado com sucesso`
            })
        } else {
            res.status(400).json({
                code: 400,
                message: `erro ao criar kit ${values.quantity}`
            })
        }
        
        async function validateKit(unitary: any, kit: any, quantity: any): Promise<any>{

            function kitPrice(price: any, priceRule: any, discountType: any, discountValue: any): any{
                if(price == 0){
                    return price
                }
                if(parseInt(priceRule) == 1) {
                    return price
                }
                if(parseInt(priceRule) == 2) {
                    if(discountType == '$'){
                        return price-discountValue
                    }
                    if(discountType == '%'){
                        return price-(price*discountValue/100)
                    }
                }
            }

            const relatedCategories = unitary.related_categories 
            relatedCategories.push(520)
            relatedCategories.push(quantity == 2 ? 581 : 540)

            const object = {
                kit: {
                    is_kit: 1,
                    ean: unitary.ean,
                    ncm: unitary.ncm,
                    product_name: kit.name,
                    product_description: kit.description,
                    brand: unitary.brand,
                    model: unitary.model,
                    weight: parseInt(unitary.weight)*quantity,
                    length: parseInt(unitary.length),
                    width: parseInt(unitary.width)*quantity,
                    height: parseInt(unitary.height),
                    main_category_id: unitary.mainCategoryId,
                    related_categories: unitary.related_categories.length > 0 ? unitary.related_categories.join() : '',
                    availability: unitary.availability,
                    availability_days: parseInt(unitary.availabilityDays),
                    reference: unitary.reference,
                    picture_source_1: kit.images[0].imageUrl,
                    picture_source_2: kit.images[1].imageUrl,
                    picture_source_3: kit.images[2].imageUrl,
                    picture_source_4: kit.images[3].imageUrl,
                    picture_source_5: kit.images[4].imageUrl,
                    picture_source_6: kit.images[5].imageUrl,
                    release_date: '',
                    type: 'description',
                    content: kit.name,
                    virtual_product: '',
                    modified: await Datetime(),
                    creation_date: await Datetime(),
                    comments: unitary.comments
                },
                pricing: {
                    mundial: {
                        modified: await Datetime(),
                        is_kit: 1,
                        cost_price: parseFloat(unitary.pricing.mundial.cost.replace(',', '.'))*quantity,
                        profit: (typeof(unitary.pricing.mundial.profit) == "string" ? parseFloat(unitary.pricing.mundial.profit.replace(',', '.')) : unitary.pricing.mundial.profit),
                        tray_price: kitPrice(
                            parseFloat(unitary.pricing.mundial.price.replace(',', '.'))*quantity,
                            kit.rules.priceRule,
                            kit.rules.discountType,
                            parseFloat(kit.rules.discountValue.replace(',', '.'))
                            ),
                        tray_promotional_price: unitary.pricing.mundial.promotionalPrice.length > 0 ? kitPrice(
                            parseFloat(unitary.pricing.mundial.promotionalPrice.replace(',', '.'))*quantity,
                            kit.rules.priceRule,
                            kit.rules.discountType,
                            parseFloat(kit.rules.discountValue.replace(',', '.'))
                            ) : '',
                        start_promotion: unitary.pricing.mundial.startPromotion.length > 0 ? format(parseISO(unitary.pricing.mundial.startPromotion), 'yyyy-MM-dd 00:00:00' ) : '',
                        end_promotion: unitary.pricing.mundial.startPromotion.length > 0 ? format(parseISO(unitary.pricing.mundial.endPromotion), 'yyyy-MM-dd 00:00:00' ) : '',
                        tray_stock: parseInt(unitary.pricing.mundial.stock) == 0 ? 0 : Math.floor(parseInt(unitary.pricing.mundial.stock)/quantity),
                        tray_minimum_stock: 1,
                        tray_main_category_id: await ConvertCategories.hubMainCategoryToTray(unitary.mainCategoryId, 668385),
                        tray_related_categories: unitary.related_categories.length > 0 ? (await ConvertCategories.hubRelatedCategoriesToTray(relatedCategories, 668385)).join() : ''
                    },
                },
                rules: {
                    quantity: quantity,
                    discount_type: kit.rules.discountType,
                    discount_value: typeof(kit.rules.discountValue) == 'string' ? parseFloat(kit.rules.discountValue.replace(',', '.')) : parseFloat(kit.rules.discountValue) ,
                    price_rule: kit.rules.priceRule,
                    modified: await Datetime(),
                    creation_date: await Datetime(),
                }
            }

            return object
        }

        async function postTrayKit(kit: any, pricing: any, rules: any, quantity: any): Promise<any>{
            return new Promise(async(resolve) => {
                const productObj = {
                    Product: {
                        is_kit: 1,
                        ean: kit.ean,
                        name: kit.product_name,
                        ncm: kit.ncm,
                        description: kit.product_description,
                        price: pricing.tray_price,
                        cost_price: pricing.cost_price,
                        // promotional_price: pricing.tray_promotional_price,
                        // start_promotion: pricing.start_promotion,
                        // end_promotion: pricing.end_promotion,
                        brand:kit.brand,
                        model:kit.model,
                        weight: kit.weight,
                        length: kit.length,
                        width: kit.width,
                        height: kit.height,
                        // stock: pricing.tray_stock,
                        category_id: pricing.tray_main_category_id,
                        available: 1,
                        availability: kit.availability,
                        availability_days: kit.availability_days,
                        reference: kit.reference,
                        hot: "1",
                        release: "1",
                        // additional_button: "0",
                        related_categories: pricing.tray_related_categories.length > 0 ? pricing.tray_related_categories.split(',') : [],
                        release_date: "",
                        picture_source_1: kit.picture_source_1,
                        picture_source_2: kit.picture_source_2,
                        picture_source_3: kit.picture_source_3,
                        picture_source_4: kit.picture_source_4,
                        picture_source_5: kit.picture_source_5,
                        picture_source_6: kit.picture_source_6,
                        metatag:[{type: "description",
                        content: kit.product_name,
                        local:1}],
                        // virtual_product: kit.virtual_product
                    }
                }
                const trayProduct = JSON.stringify(productObj)

                const query = `${MundialCredentials.api_address}/products/?access_token=${MundialCredentials.access_token}`
                Requests.saveRequest(query)

                const config: any = {
                    method: 'post',
                    url: query,
                    headers: { 
                      'Content-Type': 'application/json'
                    },
                    data: trayProduct
                }

                axios(config)
                .then(response => {
                    if(response.data.code == 201){
                        resolve(saveKitDB(kit, pricing, rules, response.data.id))
                    } else {
                        console.log(response.data)
                    }
                })
                .catch(erro => {
                    console.log(erro.response.data.causes)
                    res.status(400).json({
                        code: 400,
                        message: `Erro ao criar kit Tray mundial, causas: ${JSON.stringify(erro.response.data.causes)}`
                    })
                })
            })
        }

        async function saveKitDB(kit: any, pricing: any, rules: any, trayId: any): Promise<any>{
            return new Promise(async(resolve) => {

                const sql = `INSERT INTO produtos SET ?`

                Connect.query(sql, kit, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: `erro ao salvar o kit no banco de dados`
                        })
                    } else {
                        const hubId = resultado.insertId
                        resolve(saveKitPricingDB(kit, pricing, rules, hubId, trayId))
                    }
                })
            })
        }

        async function saveKitPricingDB(kit: any, pricing: any, rules: any, hubId: any, trayId: any): Promise<any>{
            return new Promise(async(resolve) => {
                const sql = `INSERT INTO tray_produtos SET ?`

                const pricingSql = {
                    ...pricing,
                    tray_store_id: MundialCredentials.store,
                    tray_adm_user: MundialCredentials.tray_adm_user,
                    hub_id: hubId,
                    tray_product_id: trayId,
                }

                Connect.query(sql, pricingSql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: `erro ao salvar o pricing do kit hub_id ${kit.hub_id} no banco de dados`
                        })
                    } else {
                        const trayPricingId = resultado.insertId
                        resolve(postTrayRules(kit, pricing, rules, hubId, trayId, trayPricingId))
                    }
                })
            })
        }

        async function postTrayRules(kit: any, pricing: any, rules: any, hubId: any, trayId: any, trayPricingId: any): Promise<any>{
            return new Promise(async(resolve) => {

                const rulesObj = JSON.stringify([{
                    product_parent_id: trayId,
                    product_id: values.unitary.pricing.mundial.tray_id,
                    quantity: rules.quantity,
                    discount_type: rules.discount_type,
                    discount_value: rules.discount_value,
                    price_rule: parseInt(rules.price_rule)
                }])

                const query = `${MundialCredentials.api_address}/products/kits/?access_token=${MundialCredentials.access_token}`
                Requests.saveRequest(query)

                const config: any = {
                    method: 'post',
                    url: query,
                    headers: { 
                      'Content-Type': 'application/json'
                    },
                    data: rulesObj
                }

                axios(config)
                .then(response => {
                    if(response.data.code == 201){
                        resolve(saveRulesDB(kit, pricing, rules, hubId, trayId, trayPricingId, response.data.id))
                    } else {
                        console.log(response.data)
                    }
                })
                .catch(erro => {
                    console.log(erro)
                    console.log(erro.response.data.causes)
                    res.status(400).json({
                        code: 400,
                        message: `Erro ao salvar regras do kit Id Tray ${trayId} - 668385, causas: ${erro.response.data}`
                    })
                })
            })
        }

        async function saveRulesDB(kit: any, pricing: any, rules: any, hubId: any, trayId: any, trayPricingId: any, trayRuleId: any): Promise<any>{
            return new Promise(async(resolve) => {

                const ruleDB = {
                    tray_rule_id: trayRuleId,
                    tray_pricing_id: trayPricingId,
                    tray_product_id: values.unitary.pricing.mundial.tray_id,
                    tray_product_parent_id: trayId,
                    hub_id: hubId,
                    quantity: rules.quantity,
                    kit_price: pricing.tray_promotional_price == 0 ? pricing.tray_price : pricing.tray_promotional_price, 
                    discount_type: rules.discount_type,
                    discount_value: rules.discount_value,
                    price_rule: rules.price_rule,
                    modified: await Datetime(),
                    creation_date: await Datetime()
                }

                const sql = `INSERT INTO produtos_kits SET ?`

                Connect.query(sql, ruleDB, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: `erro ao salvar regra do kit ${kit.quantity} no banco de dados`
                        })
                    } else {
                        resolve({success: true})
                    }
                })
            })
        }
    }

    async edit(values: any, res: Response){

        const MundialCredentials = await OAuth2Tray.getStoreCredentials(668385)
        const ScPneusCredentials = await OAuth2Tray.getStoreCredentials(1049898)

        const unitary = await validateUnitary(values.unitary)
        const kit2 = await validateKit(values.unitary, values.kit2, 2)
        const kit4 = await validateKit(values.unitary, values.kit4, 4)

        console.log(values.handleTray)

        if(values.handleTray == 'delete'){

            await deleteTray(kit4.pricing.mundial.tray_product_id, MundialCredentials)
            await deleteTrayIdKitRules(kit4.kit, kit4.pricing.mundial, kit4.rules)
            await deleteTrayIdPricingDB(kit4.kit, kit4.pricing.mundial)
            await deleteTrayIdDB(kit4.kit)

            await deleteTray(kit2.pricing.mundial.tray_product_id, MundialCredentials)
            await deleteTrayIdKitRules(kit2.kit, kit2.pricing.mundial, kit2.rules)
            await deleteTrayIdPricingDB(kit2.kit, kit4.pricing.mundial)
            await deleteTrayIdDB(kit2.kit)

            await deleteTray(unitary.pricing.mundial.tray_product_id, MundialCredentials)
            await deleteTrayIdPricingDB(unitary.product, unitary.pricing.mundial)
            
            await updateSCPneusPricingDB(unitary.product, unitary.pricing.scpneus, 1049898)
            
            await deleteTrayIdDB(unitary.product)

            res.status(200).json({
                code: 200,
                message: 'produto salvo com sucesso'
            })

        }

        if(values.handleTray == 'create'){

            const recreatedUnitaryMundial = await repostTrayUnitary(unitary.product, unitary.pricing.mundial, MundialCredentials)
            const unitaryScPneus = await postTrayUnitary(unitary.product, unitary.pricing.scpneus, ScPneusCredentials)
            const unitaryDB = recreatedUnitaryMundial.success && unitaryScPneus.success ? await updateProductDB(unitary.product) : res.status(400).json({
                code: 400,
                message: 'erro ao salvar unitário e/ou precificação no banco de dados'
            })

            await updateUnitaryTrayIdPricing(unitary.product, unitary.pricing.mundial, recreatedUnitaryMundial.id, 668385)
            await updateUnitaryTrayIdPricing(unitary.product, unitary.pricing.scpneus, unitary.pricing.scpneus.tray_product_id, 1049898)

            await repostTrayKit(kit2.kit, kit2.pricing.mundial, kit2.rules, recreatedUnitaryMundial.id)
            await repostTrayKit(kit4.kit, kit4.pricing.mundial, kit4.rules, recreatedUnitaryMundial.id)

            res.status(200).json({
                code: 200,
                message: 'produto salvo com sucesso'
            })

        }

        if(values.handleTray == 'edit') {
            const unitaryMundial = await postTrayUnitary(unitary.product, unitary.pricing.mundial, MundialCredentials)
            const unitaryScPneus = await postTrayUnitary(unitary.product, unitary.pricing.scpneus, ScPneusCredentials)
            const unitaryDB = unitaryMundial.success && unitaryScPneus.success ? await saveUnitaryDB(unitary) : res.status(400).json({
                code: 400,
                message: 'erro ao salvar unitário e/ou precificação no banco de dados'
            })
    
            const kit2Mundial = kit2 == false ? false : await postTrayKit(kit2.kit, kit2.pricing.mundial, kit2.rules, 2)
            const kit4Mundial = kit4 == false ? false : await postTrayKit(kit4.kit, kit4.pricing.mundial, kit4.rules, 4)
            
            res.status(200).json({
                code: 200,
                message: 'produto salvo com sucesso'
            })
        }


        async function validateUnitary(unitary: any): Promise<any>{

            
            const object = {
                product: {
                    hub_id: unitary.hubId,
                    ean: unitary.ean,
                    ncm: unitary.ncm,
                    product_name: unitary.name,
                    product_description: unitary.description,
                    brand: unitary.brand,
                    model: unitary.model,
                    weight: unitary.weight,
                    length: unitary.length,
                    width: unitary.width,
                    height: unitary.height,
                    main_category_id: unitary.mainCategoryId,
                    related_categories: unitary.related_categories.length > 0 ? unitary.related_categories.join() : '',
                    availability: unitary.availability,
                    availability_days: parseInt(unitary.availabilityDays),
                    reference: unitary.reference,
                    picture_source_1: unitary.images[0].imageUrl,
                    picture_source_2: unitary.images[1].imageUrl,
                    picture_source_3: unitary.images[2].imageUrl,
                    picture_source_4: unitary.images[3].imageUrl,
                    picture_source_5: unitary.images[4].imageUrl,
                    picture_source_6: unitary.images[5].imageUrl,
                    modified: await Datetime(),
                    comments: unitary.comments
                },
                pricing: {
                    mundial: {
                        tray_product_id: unitary.pricing.mundial.tray_id,
                        cost_price: parseFloat(unitary.pricing.mundial.cost.replace(',', '.')),
                        profit: typeof(unitary.pricing.mundial.profit) == "string" ? parseFloat(unitary.pricing.mundial.profit.replace(',', '.')) : unitary.pricing.mundial.profit,
                        tray_price: parseFloat(unitary.pricing.mundial.price.replace(',', '.')),
                        tray_promotional_price: parseFloat(unitary.pricing.mundial.promotionalPrice.replace(',', '.')),
                        start_promotion: unitary.pricing.mundial.startPromotion.length > 0 ? format(parseISO(unitary.pricing.mundial.startPromotion), 'yyyy-MM-dd 00:00:00' ) : '',
                        end_promotion: unitary.pricing.mundial.startPromotion.length > 0 ? format(parseISO(unitary.pricing.mundial.endPromotion), 'yyyy-MM-dd 00:00:00' ) : '',
                        tray_stock: parseInt(unitary.pricing.mundial.stock),
                        tray_main_category_id: await ConvertCategories.hubMainCategoryToTray(unitary.mainCategoryId, 668385),
                        tray_related_categories: unitary.related_categories.length > 0 ? (await ConvertCategories.hubRelatedCategoriesToTray(unitary.related_categories, 668385)).join() : ''
                    },
                    scpneus: {
                        tray_product_id: unitary.pricing.scpneus.tray_id,
                        cost_price: parseFloat(unitary.pricing.scpneus.cost.replace(',', '.')),
                        profit: typeof(unitary.pricing.scpneus.profit) == "string" ? parseFloat(unitary.pricing.scpneus.profit.replace(',', '.')) : unitary.pricing.scpneus.profit,
                        tray_price: parseFloat(unitary.pricing.scpneus.price.replace(',', '.')),
                        tray_promotional_price: parseFloat(unitary.pricing.scpneus.promotionalPrice.replace(',', '.')),
                        start_promotion: unitary.pricing.scpneus.startPromotion.length > 0 ? format(parseISO(unitary.pricing.scpneus.startPromotion), 'yyyy-MM-dd 00:00:00' ) : '',
                        end_promotion: unitary.pricing.scpneus.startPromotion.length > 0 ? format(parseISO(unitary.pricing.scpneus.endPromotion), 'yyyy-MM-dd 00:00:00' ) : '',
                        tray_stock: parseInt(unitary.pricing.scpneus.stock),
                        tray_main_category_id: await ConvertCategories.hubMainCategoryToTray(unitary.mainCategoryId, 1049898),
                        tray_related_categories: unitary.related_categories.length > 0 ? (await ConvertCategories.hubRelatedCategoriesToTray(unitary.related_categories, 1049898)).join() : ''
                
                    }
                },  
            }

            return object
        }

        async function validateKit(unitary: any, kit: any, quantity: any): Promise<any>{

            function kitPrice(price: any, priceRule: any, discountType: any, discountValue: any): any{
                if(price == 0){
                    return price
                }
                if(parseInt(priceRule) == 1) {
                    return price
                }
                if(parseInt(priceRule) == 2) {
                    if(discountType == '$'){
                        return price-discountValue
                    }
                    if(discountType == '%'){
                        return price-(price*discountValue/100)
                    }
                }
            }
            
            const relatedCategories = unitary.related_categories 
            relatedCategories.push(520)
            relatedCategories.push(quantity == 2 ? 581 : 540)

            const object = {
                kit: {
                    hub_id: kit.hubId,
                    ean: unitary.ean,
                    ncm: unitary.ncm,
                    product_name: kit.name,
                    product_description: kit.description,
                    brand: unitary.brand,
                    model: unitary.model,
                    weight: parseInt(unitary.weight)*quantity,
                    length: parseInt(unitary.length),
                    width: parseInt(unitary.width)*quantity,
                    height: parseInt(unitary.height),
                    main_category_id: quantity == 2 ? 581 : 540,
                    related_categories: unitary.related_categories.length > 0 ? unitary.related_categories.join() : '',
                    availability: unitary.availability,
                    availability_days: parseInt(unitary.availabilityDays),
                    reference: unitary.reference,
                    picture_source_1: kit.images[0].imageUrl,
                    picture_source_2: kit.images[1].imageUrl,
                    picture_source_3: kit.images[2].imageUrl,
                    picture_source_4: kit.images[3].imageUrl,
                    picture_source_5: kit.images[4].imageUrl,
                    picture_source_6: kit.images[5].imageUrl,
                    modified: await Datetime(),
                    comments: unitary.comments
                },
                pricing: {
                    mundial: {
                        modified: await Datetime(),
                        tray_product_id: kit.trayId,
                        cost_price: parseFloat(unitary.pricing.mundial.cost.replace(',', '.'))*quantity,
                        profit: (typeof(unitary.pricing.mundial.profit) == "string" ? parseFloat(unitary.pricing.mundial.profit.replace(',', '.')) : unitary.pricing.mundial.profit),
                        tray_price: kitPrice(
                            parseFloat(unitary.pricing.mundial.price.replace(',', '.'))*quantity,
                            kit.rules.priceRule,
                            kit.rules.discountType,
                            parseFloat(kit.rules.discountValue.replace(',', '.'))
                            ),
                        tray_promotional_price: unitary.pricing.mundial.promotionalPrice.length > 0 ? kitPrice(
                            parseFloat(unitary.pricing.mundial.promotionalPrice.replace(',', '.'))*quantity,
                            kit.rules.priceRule,
                            kit.rules.discountType,
                            parseFloat(kit.rules.discountValue.replace(',', '.'))
                            ) : '',
                        start_promotion: unitary.pricing.mundial.startPromotion.length > 0 ? format(parseISO(unitary.pricing.mundial.startPromotion), 'yyyy-MM-dd 00:00:00' ) : '',
                        end_promotion: unitary.pricing.mundial.startPromotion.length > 0 ? format(parseISO(unitary.pricing.mundial.endPromotion), 'yyyy-MM-dd 00:00:00' ) : '',
                        tray_stock: parseInt(unitary.pricing.mundial.stock) == 0 ? 0 : Math.floor(parseInt(unitary.pricing.mundial.stock)/quantity),
                        tray_main_category_id: await ConvertCategories.hubMainCategoryToTray(unitary.mainCategoryId, 668385),
                        tray_related_categories: unitary.related_categories.length > 0 ? (await ConvertCategories.hubRelatedCategoriesToTray(relatedCategories, 668385)).join() : ''
                    },
                },
                rules: {
                    quantity: quantity,
                    hub_id: kit.hubId,
                    discount_type: kit.rules.discountType,
                    discount_value: typeof(kit.rules.discountValue) == 'string' ? parseFloat(kit.rules.discountValue.replace(',', '.')) : parseFloat(kit.rules.discountValue) ,
                    price_rule: kit.rules.priceRule,
                }
            }

            return object
        }

        // just edit functions

        async function postTrayUnitary(product: any, pricing: any, store: any): Promise<any>{
            return new Promise(async(resolve, reject) => {

                const productObjImg = {
                    Product: {
                        // is_kit: 0,
                        ean: product.ean,
                        name: product.product_name,
                        ncm: product.ncm,
                        description: product.product_description,
                        price: pricing.tray_price,
                        cost_price: pricing.cost_price,
                        promotional_price: pricing.tray_promotional_price,
                        start_promotion: pricing.start_promotion,
                        end_promotion: pricing.end_promotion,
                        brand:product.brand,
                        model:product.model,
                        weight: product.weight,
                        length: product.length,
                        width: product.width,
                        height: product.height,
                        stock: pricing.tray_stock,
                        category_id: pricing.tray_main_category_id,
                        // available: product.available,
                        availability: product.availability,
                        availability_days: product.availability_days,
                        reference: product.reference,
                        // hot: "1",
                        // release: "1",
                        // additional_button: "0",
                        related_categories: pricing.tray_related_categories.length > 0 ? pricing.tray_related_categories.split(',') : [],
                        // release_date: "",
                        picture_source_1: product.picture_source_1,
                        picture_source_2: product.picture_source_2,
                        picture_source_3: product.picture_source_3,
                        picture_source_4: product.picture_source_4,
                        picture_source_5: product.picture_source_5,
                        picture_source_6: product.picture_source_6,
                        metatag:[{type: "description",
                        content: product.product_name,
                        local:1}],
                        minimum_stock_alert: '1',
                        minimum_stock: 1,
                        // virtual_product: product.virtual_product
                    }
                }

                const productObj = { // no update images
                    Product: {
                        // is_kit: 0,
                        ean: product.ean,
                        name: product.product_name,
                        ncm: product.ncm,
                        description: product.product_description,
                        price: pricing.tray_price,
                        cost_price: pricing.cost_price,
                        promotional_price: pricing.tray_promotional_price,
                        start_promotion: pricing.start_promotion,
                        end_promotion: pricing.end_promotion,
                        brand:product.brand,
                        model:product.model,
                        weight: product.weight,
                        length: product.length,
                        width: product.width,
                        height: product.height,
                        stock: pricing.tray_stock,
                        category_id: pricing.tray_main_category_id,
                        // available: product.available,
                        availability: product.availability,
                        availability_days: product.availability_days,
                        reference: product.reference,
                        // hot: "1",
                        // release: "1",
                        // additional_button: "0",
                        related_categories: pricing.tray_related_categories.length > 0 ? pricing.tray_related_categories.split(',') : [],
                        // release_date: "",
                        metatag:[{type: "description",
                        content: product.product_name,
                        local:1}],
                        minimum_stock_alert: '1',
                        minimum_stock: 1,
                        // virtual_product: product.virtual_product
                    }
                }

                const trayProduct = JSON.stringify(values.updateImages ? productObjImg : productObj)

                const query = `${store.api_address}/products/${pricing.tray_product_id}?access_token=${store.access_token}`
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
                        message: `Erro ao editar produto Id Tray ${pricing.tray_product_id} - ${store.tray_adm_user}, causas: ${erro.response.data}`
                    })
                })
            })
        }

        async function saveUnitaryDB(product: any): Promise<any>{
            return new Promise(async(resolve) => {
                const sql = `UPDATE produtos SET ? WHERE hub_id=${product.product.hub_id}`

                Connect.query(sql, product.product, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao salvar unitário no banco de dados'
                        })
                    } else {
                        resolve(saveUnitaryPricingDB(product, product.pricing.mundial, 668385))
                    }
                })
            })
        }

        async function saveUnitaryPricingDB(product: any, pricing: any, store: any): Promise<any>{
            return new Promise(async(resolve) => {
                const sql = `UPDATE tray_produtos SET ? WHERE tray_product_id=${pricing.tray_product_id} AND tray_store_id=${store}` 
                
                Connect.query(sql, pricing, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: `erro ao salvar a precificação do unitário com tray_product_id=${pricing.tray_product_id}`
                        })
                    } else {
                        if (store == 668385){
                            resolve(saveUnitaryPricingDB(product, product.pricing.scpneus, 1049898))
                        }
                        if (store == 1049898) {
                            resolve({success: true})
                        }
                    }
                })
            })
        }

        async function postTrayKit(kit: any, pricing: any, rules: any, quantity: any): Promise<any>{
            return new Promise(async(resolve) => {
                const productObjImg = {
                    Product: {
                        // is_kit: 0,
                        ean: kit.ean,
                        name: kit.product_name,
                        ncm: kit.ncm,
                        description: kit.product_description,
                        // price: pricing.tray_price,
                        // cost_price: pricing.cost_price,
                        // promotional_price: pricing.tray_promotional_price,
                        // start_promotion: pricing.start_promotion,
                        // end_promotion: pricing.end_promotion,
                        brand:kit.brand,
                        model:kit.model,
                        weight: kit.weight,
                        length: kit.length,
                        width: kit.width,
                        height: kit.height,
                        // stock: pricing.tray_stock,
                        category_id: pricing.tray_main_category_id,
                        // available: kit.available,
                        availability: kit.availability,
                        availability_days: kit.availability_days,
                        reference: kit.reference,
                        // hot: "1",
                        // release: "1",
                        // additional_button: "0",
                        related_categories: pricing.tray_related_categories.length > 0 ? pricing.tray_related_categories.split(',') : [],
                        // release_date: "",
                        picture_source_1: kit.picture_source_1,
                        picture_source_2: kit.picture_source_2,
                        picture_source_3: kit.picture_source_3,
                        picture_source_4: kit.picture_source_4,
                        picture_source_5: kit.picture_source_5,
                        picture_source_6: kit.picture_source_6,
                        metatag:[{type: "description",
                        content: kit.product_name,
                        local:1}],
                        // virtual_product: kit.virtual_product
                    }
                }

                const productObj = {
                    Product: {
                        // is_kit: 0,
                        ean: kit.ean,
                        name: kit.product_name,
                        ncm: kit.ncm,
                        description: kit.product_description,
                        // price: pricing.tray_price,
                        // cost_price: pricing.cost_price,
                        // promotional_price: pricing.tray_promotional_price,
                        // start_promotion: pricing.start_promotion,
                        // end_promotion: pricing.end_promotion,
                        brand:kit.brand,
                        model:kit.model,
                        weight: kit.weight,
                        length: kit.length,
                        width: kit.width,
                        height: kit.height,
                        // stock: pricing.tray_stock,
                        category_id: pricing.tray_main_category_id,
                        // available: kit.available,
                        availability: kit.availability,
                        availability_days: kit.availability_days,
                        reference: kit.reference,
                        // hot: "1",
                        // release: "1",
                        // additional_button: "0",
                        related_categories: pricing.tray_related_categories.length > 0 ? pricing.tray_related_categories.split(',') : [],
                        // release_date: "",
                        metatag:[{type: "description",
                        content: kit.product_name,
                        local:1}],
                        // virtual_product: kit.virtual_product
                    }
                }

                const trayProduct = JSON.stringify(values.updateImages ? productObjImg : productObj)

                const query = `${MundialCredentials.api_address}/products/${pricing.tray_product_id}?access_token=${MundialCredentials.access_token}`
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
                        resolve(saveKitDB(kit, pricing, rules, quantity))
                    } else {
                        console.log(response.data)
                    }
                })
                .catch(erro => {
                    console.log(erro.response.data.causes)
                    res.status(400).json({
                        code: 400,
                        message: `Erro ao salvar kit Id Tray ${pricing.tray_product_id} - 668385, causas: ${erro.response.data}`
                    })
                })
            })
        }

        async function saveKitDB(kit: any, pricing: any, rules: any, quantity: any): Promise<any>{
            return new Promise(async(resolve) => {

                const sql = `UPDATE produtos SET ? WHERE hub_id=${kit.hub_id}`

                Connect.query(sql, kit, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: `erro ao salvar o kit hub_id ${kit.hub_id} no banco de dados`
                        })
                    } else {
                        resolve(saveKitPricingDB(kit, pricing, rules, quantity))
                    }
                })
            })
        }

        async function saveKitPricingDB(kit: any, pricing: any, rules: any, quantity: any): Promise<any>{
            return new Promise(async(resolve) => {
                const sql = `UPDATE tray_produtos SET ? WHERE tray_product_id=${pricing.tray_product_id} AND tray_store_id=668385`

                Connect.query(sql, pricing, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: `erro ao salvar o pricing do kit hub_id ${kit.hub_id} no banco de dados`
                        })
                    } else {
                        resolve(postTrayRules(kit, pricing, rules, quantity))
                    }
                })
            })
        }

        async function postTrayRules(kit: any, pricing: any, rules: any, quantity: any): Promise<any>{
            return new Promise(async(resolve) => {

                const rulesObj = JSON.stringify([{
                    product_parent_id: pricing.tray_product_id,
                    product_id: unitary.pricing.mundial.tray_product_id,
                    quantity: quantity,
                    discount_type: rules.discount_type,
                    discount_value: rules.discount_value,
                    price_rule: parseInt(rules.price_rule)
                }])

                const query = `${MundialCredentials.api_address}/products/kits/?access_token=${MundialCredentials.access_token}`
                Requests.saveRequest(query)

                const config: any = {
                    method: 'post',
                    url: query,
                    headers: { 
                      'Content-Type': 'application/json'
                    },
                    data: rulesObj
                }

                axios(config)
                .then(response => {
                    if(response.data.code == 201){
                        resolve(saveRulesDB(kit, pricing, rules))
                    } else {
                        console.log(response.data)
                    }
                })
                .catch(erro => {
                    console.log(erro)
                    console.log(erro.response.data.causes)
                    if(erro.response.data.causes[0] == 'It is not possible to change the products of the kit, the same is related to a Free Market announcement.'){
                        resolve(saveRulesDB(kit, pricing, rules))
                    } else {
                        res.status(400).json({
                            code: 400,
                            message: `Erro ao salvar regras do kit Id Tray ${pricing.tray_product_id} - 668385, causas: ${erro.response.data.causes}`
                        })
                    }
                })
            })
        }

        async function saveRulesDB(kit: any, pricing: any, rules: any): Promise<any>{
            return new Promise(async(resolve) => {

                const ruleDB = {
                    kit_price: pricing.tray_promotional_price == 0 ? pricing.tray_price : pricing.tray_promotional_price, 
                    discount_type: rules.discount_type,
                    discount_value: rules.discount_value,
                    price_rule: rules.price_rule
                }

                const sql = `UPDATE produtos_kits SET ? WHERE hub_id=${kit.hub_id}`

                Connect.query(sql, ruleDB, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: `erro ao salvar regra do kit hub_id ${kit.hub_id} no banco de dados`
                        })
                    } else {
                        resolve({success: true})
                    }
                })
            })
        }

        // delete functions

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
                    
                    if(erro.response.data.causes[0] == 'Invalid parameter id.'){
                        resolve()
                    } else {
                        res.status(400).json({
                            code: 400,
                            message: `Erro ao deletar kit Id Tray ${trayId} - ${storeCredentials.store}, causas: ${JSON.stringify(erro.response.data)}`
                        })
                    }
                })


            })
        }

        async function deleteTrayIdKitRules(kit: any, pricing: any, rules: any): Promise<any>{
            return new Promise(async(resolve) => {

                const ruleDB = {
                    tray_product_id: 0,
                    tray_product_parent_id: 0,
                    kit_price: pricing.tray_promotional_price == 0 ? pricing.tray_price : pricing.tray_promotional_price, 
                    discount_type: rules.discount_type,
                    discount_value: rules.discount_value,
                    price_rule: rules.price_rule
                }

                const sql = `UPDATE produtos_kits SET ? WHERE hub_id=${kit.hub_id}`

                Connect.query(sql, ruleDB, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: `erro ao salvar regra do kit hub_id ${kit.hub_id} no banco de dados`
                        })
                    } else {
                        resolve({success: true})
                    }
                })
            })
        }

        async function deleteTrayIdPricingDB(kit: any, pricing: any): Promise<void>{
            return new Promise(async(resolve) => {

                const noIdPricing = {
                    ...pricing,
                    tray_product_id: 0,
                }

                const sql = `UPDATE tray_produtos SET ? WHERE hub_id=${kit.hub_id} AND tray_store_id=668385`

                Connect.query(sql, noIdPricing, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: `erro ao salvar o pricing do kit hub_id ${kit.hub_id} no banco de dados`
                        })
                    } else {
                        resolve()
                    }
                })
            })
        }

        async function updateSCPneusPricingDB(product: any, pricing: any, store: any): Promise<any>{
            return new Promise(async(resolve) => {
                const sql = `UPDATE tray_produtos SET ? WHERE hub_id=${product.hub_id} AND tray_store_id=${store}` 
                
                Connect.query(sql, pricing, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: `erro ao salvar a precificação do unitário com tray_product_id=${pricing.tray_product_id}`
                        })
                    } else {
                        resolve({success: true})
                    }
                })
            })
        }

        async function deleteTrayIdDB(product: any): Promise<void>{
            return new Promise(async(resolve) => {

                const sql = `UPDATE produtos SET ? WHERE hub_id=${product.hub_id}`

                Connect.query(sql, product, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: `erro ao salvar o product hub_id ${product.hub_id} no banco de dados`
                        })
                    } else {
                        resolve()
                    }
                })
            })
        }

        // recreate functions 

        async function repostTrayUnitary(product: any, pricing: any, store: any): Promise<any>{
            return new Promise(async(resolve, reject) => {

                const productObj = {
                    Product: {
                        is_kit: 0,
                        ean: product.ean,
                        name: product.product_name,
                        ncm: product.ncm,
                        description: product.product_description,
                        price: pricing.tray_price,
                        cost_price: pricing.cost_price,
                        promotional_price: pricing.tray_promotional_price,
                        start_promotion: pricing.start_promotion,
                        end_promotion: pricing.end_promotion,
                        brand:product.brand,
                        model:product.model,
                        weight: product.weight,
                        length: product.length,
                        width: product.width,
                        height: product.height,
                        stock: pricing.tray_stock,
                        minimum_stock: pricing.tray_minimum_stock,
                        minimum_stock_alert: '1',
                        category_id: pricing.tray_main_category_id,
                        available: 1,
                        availability: product.availability,
                        availability_days: product.availability_days,
                        reference: product.reference,
                        hot: "1",
                        release: "1",
                        // additional_button: "0",
                        related_categories: pricing.tray_related_categories.length > 0 ? pricing.tray_related_categories.split(',') : [],
                        // release_date: "",
                        picture_source_1: product.picture_source_1,
                        picture_source_2: product.picture_source_2,
                        picture_source_3: product.picture_source_3,
                        picture_source_4: product.picture_source_4,
                        picture_source_5: product.picture_source_5,
                        picture_source_6: product.picture_source_6,
                        metatag:[{type: "description",
                        content: product.product_name,
                        local:1}],
                        // virtual_product: product.virtual_product
                    }
                }
                const trayProduct = JSON.stringify(productObj)

                const query = `${store.api_address}/products/?access_token=${store.access_token}`
                Requests.saveRequest(query)

                const config: any = {
                    method: 'post',
                    url: query,
                    headers: { 
                      'Content-Type': 'application/json'
                    },
                    data: trayProduct
                }

                axios(config)
                .then(response => {
                    if(response.data.code == 201){
                        resolve({
                            success: true,
                            id: response.data.id
                        })
                    } else {
                        console.log(response.data)
                    }
                })
                .catch(erro => {
                    console.log(erro)
                    console.log(erro.response.data.causes)
                    res.status(400).json({
                        code: 400,
                        message: `Erro ao criar unitário na Tray ${store.tray_adm_user}, causas: ${erro.response.data}`
                    })
                })
            })
        }

        async function updateProductDB(product: any): Promise<void>{
            return new Promise(async(resolve) => {

                const sql = `UPDATE produtos SET ? WHERE hub_id=${product.hub_id}`

                Connect.query(sql, product, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: `erro ao salvar o product hub_id ${product.hub_id} no banco de dados`
                        })
                    } else {
                        resolve()
                    }
                })
            })
        }

        async function updateUnitaryTrayIdPricing(product: any, pricing: any, trayId: number, store: any): Promise<any>{
            return new Promise(async(resolve) => {

                const newPricing = {
                    ...pricing,
                    tray_product_id: trayId
                }

                const sql = `UPDATE tray_produtos SET ? WHERE hub_id=${product.hub_id} AND tray_store_id=${store}` 

                Connect.query(sql, newPricing, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: `erro ao salvar a precificação do unitário com tray_product_id=${pricing.tray_product_id}`
                        })
                    } else {
                        resolve({success: true})
                    }
                })
            })
        }

        async function repostTrayKit(kit: any, pricing: any, rules: any, trayId: number): Promise<any>{
            return new Promise(async(resolve) => {

                const productObj = {
                    Product: {
                        is_kit: 1,
                        ean: kit.ean,
                        name: kit.product_name,
                        ncm: kit.ncm,
                        description: kit.product_description,
                        price: pricing.tray_price,
                        cost_price: pricing.cost_price,
                        // promotional_price: pricing.tray_promotional_price,
                        // start_promotion: pricing.start_promotion,
                        // end_promotion: pricing.end_promotion,
                        brand:kit.brand,
                        model:kit.model,
                        weight: kit.weight,
                        length: kit.length,
                        width: kit.width,
                        height: kit.height,
                        // stock: pricing.tray_stock,
                        category_id: pricing.tray_main_category_id,
                        available: 1,
                        availability: kit.availability,
                        availability_days: kit.availability_days,
                        reference: kit.reference,
                        hot: "1",
                        release: "1",
                        // additional_button: "0",
                        related_categories: pricing.tray_related_categories.length > 0 ? pricing.tray_related_categories.split(',') : [],
                        release_date: "",
                        picture_source_1: kit.picture_source_1,
                        picture_source_2: kit.picture_source_2,
                        picture_source_3: kit.picture_source_3,
                        picture_source_4: kit.picture_source_4,
                        picture_source_5: kit.picture_source_5,
                        picture_source_6: kit.picture_source_6,
                        metatag:[{type: "description",
                        content: kit.product_name,
                        local:1}],
                        // virtual_product: kit.virtual_product
                    }
                }
                const trayProduct = JSON.stringify(productObj)

                const query = `${MundialCredentials.api_address}/products/?access_token=${MundialCredentials.access_token}`
                Requests.saveRequest(query)

                const config: any = {
                    method: 'post',
                    url: query,
                    headers: { 
                      'Content-Type': 'application/json'
                    },
                    data: trayProduct
                }

                axios(config)
                .then(response => {
                    if(response.data.code == 201){
                        resolve(updateKitDB(kit, pricing, rules, trayId, response.data.id))
                    } else {
                        console.log(response.data)
                    }
                })
                .catch(erro => {
                    console.log(erro.response.data.causes)
                    res.status(400).json({
                        code: 400,
                        message: `Erro ao criar kit Tray mundial, causas: ${JSON.stringify(erro.response.data.causes)}`
                    })
                })
            })
        }

        async function updateKitDB(kit: any, pricing: any, rules: any, trayId: number, trayParentId: number): Promise<any>{
            return new Promise(async(resolve) => {

                const sql = `UPDATE produtos SET ? WHERE hub_id=${kit.hub_id}`

                Connect.query(sql, kit, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: `erro ao salvar o kit no banco de dados`
                        })
                    } else {
                        resolve(updateKitPricingDB(kit, pricing, rules, trayId, trayParentId))
                    }
                })
            })
        }

        async function updateKitPricingDB(kit: any, pricing: any, rules: any, trayId: any, trayParentId: number): Promise<any>{
            return new Promise(async(resolve) => {
                const sql = `UPDATE tray_produtos SET ? WHERE hub_id=${kit.hub_id}`

                const pricingSql = {
                    ...pricing,
                    tray_product_id: trayParentId,
                }

                Connect.query(sql, pricingSql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: `erro ao salvar o pricing do kit hub_id ${kit.hub_id} no banco de dados`
                        })
                    } else {
                        resolve(repostTrayRules(kit, pricing, rules, trayId, trayParentId))
                    }
                })
            })
        }

        async function repostTrayRules(kit: any, pricing: any, rules: any, trayId: any, trayParentId: any): Promise<any>{
            return new Promise(async(resolve) => {

                console.log(rules)

                const rulesObj = JSON.stringify([{
                    product_parent_id: trayParentId,
                    product_id: trayId,
                    quantity: rules.quantity,
                    discount_type: rules.discount_type,
                    discount_value: rules.discount_value,
                    price_rule: parseInt(rules.price_rule)
                }])

                const query = `${MundialCredentials.api_address}/products/kits/?access_token=${MundialCredentials.access_token}`
                Requests.saveRequest(query)

                const config: any = {
                    method: 'post',
                    url: query,
                    headers: { 
                      'Content-Type': 'application/json'
                    },
                    data: rulesObj
                }

                axios(config)
                .then(response => {
                    if(response.data.code == 201){
                        resolve(updateRulesDB(kit, pricing, rules, trayId, trayParentId))
                    } else {
                        console.log(response.data)
                    }
                })
                .catch(erro => {
                    console.log(erro)
                    console.log(erro.response.data.causes)
                    res.status(400).json({
                        code: 400,
                        message: `Erro ao salvar regras do kit Id Tray ${trayId} - 668385, causas: ${erro.response.data}`
                    })
                })
            })
        }

        async function updateRulesDB(kit: any, pricing: any, rules: any, trayId: number, trayParentId: number): Promise<any>{
            return new Promise(async(resolve) => {

                const ruleDB = {
                    tray_product_parent_id: trayParentId,
                    tray_product_id: trayId,
                    kit_price: pricing.tray_promotional_price == 0 ? pricing.tray_price : pricing.tray_promotional_price, 
                    discount_type: rules.discount_type,
                    discount_value: rules.discount_value,
                    price_rule: rules.price_rule
                }

                const sql = `UPDATE produtos_kits SET ? WHERE hub_id=${kit.hub_id}`

                Connect.query(sql, ruleDB, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: `erro ao salvar regra do kit hub_id ${kit.hub_id} no banco de dados`
                        })
                    } else {
                        resolve({success: true})
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

        console.log('aqui foi')

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

    async lastReference(res: Response){
        const sql = `SELECT reference FROM produtos ORDER BY reference DESC LIMIT 0,1`

        Connect.query(sql, (erro, resultado) => {
            if(erro){
                console.log(erro)
            } else {
                const lastReference = (parseInt(resultado[0].reference) + 1)
                res.status(200).json(lastReference.toString())
            }
        })
    }

    async getModelSuggestion(productName: any, res: Response){
        const splittedName: any[] = productName.toUpperCase().split(" ")
        const possibleBrand = splittedName[(splittedName.length-1)]
        var tyreSize = ""
        var hasTyreSize = false
        var possibleModel: any = []
        var loadIndex = false
        if(splittedName[0] == "PNEU" || splittedName[0] == "PNEUS"){
            splittedName.map((word: string, index) => {
                var darkList = [
                    "LB", "Lb", "lb", "Letra", "LETRA", "Letras", "LETRAS", "Branca", "BRANCAS"
                ]
                var numbers = ["1","2","3","4","5","6","7","8","9","0"]
                var loadIndexCrts = ["L", "N", "Q", "R", "S", "T", "H", "V", "W", "Y", "Z", "Y"]
                var sizeCrts = ["/", "R", "-"]
                var lastLetter = ""
                word.split('').map((letter, index) => {
                    if(numbers.indexOf(lastLetter) > -1 && loadIndexCrts.indexOf(letter) > -1 && hasTyreSize){
                        loadIndex = true
                    }
                    if(sizeCrts.indexOf(lastLetter) > -1 && numbers.indexOf(letter) > -1 && !hasTyreSize){
                        tyreSize = word
                    }
                    if(index == (word.length-1)){
                        lastLetter = ""
                    } else {
                        lastLetter = letter
                    }
                })
                if(hasTyreSize && !loadIndex && possibleModel.length < 3 && darkList.indexOf(word) < 0){
                    possibleModel.push(word)
                }
                if(tyreSize.length > 1){
                    hasTyreSize = true
                }
            })
        }
    
        var brand: any = {categoryName: ""}
        var model: any = {categoryName: ""}
        var modelParents: any[] = []
        var vehicleParents: any[] = []
        var sizeParents: any[] = []
        var HubRelatedCategories: any[] = []

        if(possibleModel.length > 0){
            possibleModel = possibleModel.join(" ")
            model = await getCategory(possibleModel).then(response => {return response})
            modelParents = await getParents(model.categoryParentId, [model.categoryId]).then(response => {return response})        
        }

        console.log(tyreSize)

        if(tyreSize.length > 0){
            const size = await getCategory(tyreSize).then(response => {return response})
            vehicleParents = await getVehicleParent(size.categoryName).then(response => {return response})
            sizeParents = await getParents(size.categoryParentId, [size.categoryId]).then(response => {return response})
        }

        if(possibleBrand.length > 0 && model.categoryName.length > 0){
            brand = await getCategory(possibleBrand).then(response => {return response})
        }

        const trayRelatedCategories = [...vehicleParents, ...modelParents, ...sizeParents]

        if(trayRelatedCategories.length){
            HubRelatedCategories = await getRelatedHubCategories(trayRelatedCategories).then(response => {return response})
        }

        res.status(200).json({
            brand: brand.categoryName,
            model: model.categoryName,
            relatedCategories: HubRelatedCategories
        })

        async function getCategory(possibleCategory: string): Promise<any>{
            return new Promise((resolve, reject) => {
                if(possibleCategory.length > 0){
                    const sql = `SELECT * from categorias WHERE category_name LIKE '%${possibleCategory}%'`
                    Connect.query(sql, (erro, resultado) => {
                        if(erro){
                            console.log(erro)
                        } else {
                            if(resultado.length > 0){
                                resolve({
                                    categoryName: resultado[0].category_name,
                                    categoryId: resultado[0].tray_category_id,
                                    categoryParentId: resultado[0].tray_category_parent_id
                                })
                            } else {
                                resolve({
                                    categoryName: "",
                                    categoryId: 0,
                                    categoryParentId: 0,
                                })
                            }
                        }
                    })
                } else {
                    resolve('')
                }
            })
        }

        async function getParents(categoryId: any, relatedCategories: any[]): Promise<any>{
            return new Promise((resolve, reject) => {
                console.log(categoryId, relatedCategories)
                if(categoryId == 0){
                    resolve([])
                } else {
                    const sql = `SELECT * FROM categorias WHERE tray_category_id = ${categoryId}`
    
                    Connect.query(sql, (erro, resultado) => {
                        if(erro){
                            console.log(erro)
                        } else {
                            const related_categories = [...relatedCategories, resultado[0].tray_category_id]
                            if(resultado[0].tray_category_parent_id > 0){
                                resolve(getParents(resultado[0].tray_category_parent_id, related_categories))
                            } else {
                                resolve(related_categories)
                            }
                        }
                    })
                }
            })
        }

        async function getVehicleParent(size: string): Promise<any>{
            return new Promise((resolve, reject) => {
                const sql = `SELECT t.tray_related_categories 
                FROM produtos p JOIN tray_produtos t ON p.hub_id = t.hub_id
                WHERE p.product_name LIKE '%${size}%'`

                Connect.query(sql, (erro, resultado) => {
                    if(erro){
                        console.log(erro)
                    } else {
                        if(resultado.length > 0){
                            resolve(getCategoryVehicleType(resultado[0].tray_related_categories))
                        } else {
                            resolve([])
                        }
                    }
                })
            })
        }

        async function getCategoryVehicleType(productRelatedCategories: any): Promise<any>{
            return new Promise((resolve, reject) => {
                const sql = `SELECT tray_category_id, tray_category_parent_id 
                FROM categorias 
                WHERE tray_category_id in (${productRelatedCategories.toString()})`

                Connect.query(sql, (erro, resultado: any[]) => {
                    if(erro){
                        console.log(erro)
                    } else {
                        if(resultado.length > 0){
                            const categoryId: any[] = []
                            resultado.map(category => {
                                if(category.tray_category_parent_id == 1){
                                    categoryId.push(category.tray_category_id)
                                }
                            })
                            if(categoryId.length > 0){
                                resolve([1, categoryId[0]])
                            } else {
                                resolve([])
                            }
                        } else {
                            resolve([])
                        }
                    }
                })
            })
        }

        async function getRelatedHubCategories(relatedCategories: any): Promise<any>{
            return new Promise((resolve, reject) => {
                if(relatedCategories.length > 0){
                    const sql = `SELECT hub_category_id FROM categorias WHERE tray_category_id IN (${relatedCategories}) ORDER BY hub_category_id ASC`
    
                    Connect.query(sql, (erro, resultado: any[]) => {
                        if(erro){
                            console.log(erro)
                        } else {
                            const relatedCategories = resultado.map(id => {
                                return id.hub_category_id
                            })
                            resolve(relatedCategories)
                        }
                    })
                } else {
                    resolve([])
                }
            })
        }
    }

    async delete(reference: any, res: Response){
        const MundialCredentials = await OAuth2Tray.getStoreCredentials(668385)
        const ScPneusCredentials = await OAuth2Tray.getStoreCredentials(1049898)

        const mundialId = await getTrayIds(reference, 668385)
        const scpneusId = await getTrayIds(reference, 1049898)

        await mundialLoop(mundialId, 0)
        await deleteTray(scpneusId[0].trayId, ScPneusCredentials)

        await deleteDB(mundialId, 'produtos_kits')
        await deleteDB(mundialId, 'tray_produtos')
        await deleteDB(mundialId, 'produtos')

        await unlinkProvidersProducts(mundialId)

        res.status(200).json({
            code: 200,
            message: `Produto ${reference} excluído com sucesso`
        })

        async function getTrayIds(reference: string, store: number): Promise<ProductIds[]>{
            return new Promise(resolve => {
                const sql = `SELECT p.hub_id, t.tray_product_id, p.is_kit
                FROM produtos p JOIN tray_produtos t ON p.hub_id=t.hub_id
                WHERE p.reference = ${reference} AND t.tray_store_id = ${store}
                ORDER BY p.hub_id DESC`
            
                Connect.query(sql, (erro, resultado: any[]) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao procurar pelo tray_id e hub_id no banco de dados'
                        })
                    } else {
                        if (resultado.length > 0) {
                            const idList = resultado.map( result => {
                                return {
                                    hubId: result.hub_id,
                                    trayId: result.tray_product_id,
                                    isKit: result.is_kit
                                }
                            })

                            resolve(idList)
                        } else {
                            resolve([])
                        }
                    }
                })
            })
        }

        async function mundialLoop(list: ProductIds[], index: number): Promise<void>{
            return new Promise(async(resolve) => {

                if(list.length > 0 && list.length > index){

                    await deleteTray(list[index].trayId, MundialCredentials)

                    resolve(mundialLoop(list, index+1))
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

        async function deleteDB(idList: ProductIds[], table: string): Promise<void>{
            return new Promise(resolve => {
                
                const ids = idList.map(id => {
                    return id.hubId
                })

                const sql = `DELETE FROM ${table}
                WHERE hub_id IN (${ids.join(',')})`

                Connect.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: `erro ao deletar no banco de dados ${table}`
                        })
                    } else {
                        resolve()
                    }
                })
            })
        }

        async function unlinkProvidersProducts(idList: ProductIds[]): Promise<void>{
            return new Promise(resolve => {
                const ids = idList.map(id => {
                    return id.hubId
                })
    
                const sql = `UPDATE providers_products SET hub_id = 0 WHERE hub_id IN (${ids.join(',')})`
    
                Connect.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: `erro ao desvincular aos produtos dos fornecedores no banco de dados`
                        })
                    } else {
                        resolve()
                    }
                })
            })
        }
    }
}

export default new Products