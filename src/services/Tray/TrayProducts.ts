import axios, { AxiosRequestConfig } from "axios"
import OAuth2Tray from "../../models/Auth/OAuth2Tray"
import Requests from "../../models/Tray/Requests"
import TrayRequestsQueue from "./RequestsQueue"
import { IProductKitPutRule, IProductKitRule, IProductPostUnitary, IProductPutUnitary } from "../../types/tray"


export interface IStore {
    tray_adm_user: string;
    store: string;
    api_address: string;
    access_token: string;
}

class TrayProducts {

    async createUnitary(store: IStore, product: IProductPostUnitary): Promise<number>{
        return new Promise(async(resolve, reject) => {

            // service disabled

            const min = 1000 * 20
            const max = 1000 * 40

            const randomTrayId = Math.floor(Math.random() * (max - min + 1) + min)

            resolve(randomTrayId)

            return

            // just for demonstration

            await TrayRequestsQueue.newRequest()
            .catch(erro => {
                new Error(erro)
            })

            const productObj = {
                Product: {
                    is_kit: 0,
                    ean: product.ean,
                    name: product.product_name,
                    ncm: product.ncm,
                    description: product.product_description,
                    price: product.tray_price,
                    cost_price: product.cost_price,
                    promotional_price: product.tray_promotional_price,
                    start_promotion: product.start_promotion,
                    end_promotion: product.end_promotion,
                    brand:product.brand,
                    model:product.model,
                    weight: product.weight,
                    length: product.length,
                    width: product.width,
                    height: product.height,
                    stock: product.tray_stock,
                    minimum_stock: product.tray_minimum_stock,
                    minimum_stock_alert: '1',
                    category_id: product.tray_main_category_id,
                    available: product.available,
                    availability: product.availability,
                    availability_days: product.availability_days,
                    reference: product.reference,
                    hot: "1",
                    release: "1",
                    related_categories: product.tray_related_categories,
                    picture_source_1: product.picture_source_1,
                    picture_source_2: product.picture_source_2,
                    picture_source_3: product.picture_source_3,
                    picture_source_4: product.picture_source_4,
                    picture_source_5: product.picture_source_5,
                    picture_source_6: product.picture_source_6,
                    metatag:[{type: "description",
                    content: product.product_name,
                    warranty: product.warranty,
                    local:1}],
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
                    const trayId = parseInt(response.data.id)
                    resolve(trayId)
                } else {
                    console.log(response.data)
                    reject(`Erro ao criar. Motivo - ${JSON.stringify(response.data)}`)
                }
            })
            .catch(erro => {
                if(erro?.response?.data?.causes != undefined){
                    console.log(erro?.response?.data?.causes)
                    reject(`Erro ao cadastrar na Tray ${store.tray_adm_user} - Item ${product.reference}. Motivo da tray: ${JSON.stringify(erro?.response?.data?.causes)}`)
                } else {
                    console.log(erro?.response?.data)
                    reject(`Erro ao cadastrar na Tray ${store.tray_adm_user} - Item ${product.reference}. Resposta da Tray: ${JSON.stringify(erro.response.data)}`)
                }
            })
            .finally(() => {
                TrayRequestsQueue.finishRequest()
            })
        })      
    }

    async updateProduct(store: IStore, product: IProductPutUnitary, trayId: number): Promise<void>{
        return new Promise(async(resolve, reject) => {

            // service disabled

            resolve()

            return

            // just for demonstration


            await TrayRequestsQueue.newRequest()
            .catch(erro => {
                new Error(erro)
            })

            const productObj = {
                is_kit: product.is_kit,
                ean: product.ean,
                name: product.product_name,
                ncm: product.ncm,
                description: product.product_description,
                price: product.tray_price,
                cost_price: product.cost_price,
                promotional_price: product.tray_promotional_price,
                start_promotion: product.start_promotion,
                end_promotion: product.end_promotion,
                brand:product.brand,
                model:product.model,
                weight: product.weight,
                length: product.length,
                width: product.width,
                height: product.height,
                stock: product.is_kit == 0? product.tray_stock : undefined,
                minimum_stock: product.tray_minimum_stock,
                minimum_stock_alert: '1',
                category_id: product.tray_main_category_id,
                available: product.available,
                availability: product.availability,
                availability_days: product.availability_days,
                reference: product.reference,
                hot: "1",
                release: "1",
                related_categories: product.tray_related_categories,
                picture_source_1: product.picture_source_1,
                picture_source_2: product.picture_source_2,
                picture_source_3: product.picture_source_3,
                picture_source_4: product.picture_source_4,
                picture_source_5: product.picture_source_5,
                picture_source_6: product.picture_source_6,
                metatag:[{type: "description",
                content: product.product_name,
                warranty: product.warranty,
                local:1}],
            }
            
            removeUndefined(productObj)

            const trayProduct = JSON.stringify({Product: productObj})

            const query = `${store.api_address}/products/${trayId}?access_token=${store.access_token}`
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
                    resolve()
                } else {
                    console.log(response.data)
                    reject(`Erro ao criar. Motivo - ${JSON.stringify(response.data)}`)
                }
            })
            .catch(erro => {
                if(erro?.response?.data?.causes != undefined){
                    console.log(erro?.response?.data?.causes)
                    reject(`Erro ao editar na Tray ${store.tray_adm_user} - Item ${product.reference}. Motivo da tray: ${JSON.stringify(erro?.response?.data?.causes)}`)
                } else {
                    console.log(erro?.response?.data)
                    reject(`Erro ao editar na Tray ${store.tray_adm_user} - Item ${product.reference}. Resposta da Tray: ${JSON.stringify(erro.response.data)}`)
                }
            })
            .finally(() => {
                TrayRequestsQueue.finishRequest()
            })

            function removeUndefined(obj: any){
                Object.keys(obj).forEach(key => {
                    if (obj[key] === undefined) {
                      delete obj[key];
                    }
                });
                return obj
            }
        })
    }

    async createKit(store: IStore, product: IProductPostUnitary): Promise<number>{
        return new Promise(async(resolve, reject) => {

            // service disabled

            const min = 1000 * 20
            const max = 1000 * 40

            const randomTrayId = Math.floor(Math.random() * (max - min + 1) + min)

            resolve(randomTrayId)

            return

            // just for demonstration

            await TrayRequestsQueue.newRequest()
            .catch(erro => {
                new Error(erro)
            })

            const productObj = {
                Product: {
                    is_kit: 1,
                    ean: product.ean,
                    name: product.product_name,
                    ncm: product.ncm,
                    description: product.product_description,
                    price: product.tray_price,
                    cost_price: product.cost_price,
                    // promotional_price: product.tray_promotional_price,
                    // start_promotion: product.start_promotion,
                    // end_promotion: product.end_promotion,
                    brand:product.brand,
                    model:product.model,
                    weight: product.weight,
                    length: product.length,
                    width: product.width,
                    height: product.height,
                    // stock: product.tray_stock,
                    minimum_stock: product.tray_minimum_stock,
                    minimum_stock_alert: '1',
                    category_id: product.tray_main_category_id,
                    available: product.available,
                    availability: product.availability,
                    availability_days: product.availability_days,
                    reference: product.reference,
                    hot: "1",
                    release: "1",
                    related_categories: product.tray_related_categories,
                    picture_source_1: product.picture_source_1,
                    picture_source_2: product.picture_source_2,
                    picture_source_3: product.picture_source_3,
                    picture_source_4: product.picture_source_4,
                    picture_source_5: product.picture_source_5,
                    picture_source_6: product.picture_source_6,
                    metatag:[{type: "description",
                    content: product.product_name,
                    warranty: product.warranty,
                    local:1}],
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
                    const trayId = parseInt(response.data.id)
                    resolve(trayId)
                } else {
                    console.log(response.data)
                    reject(`Erro ao criar. Motivo - ${JSON.stringify(response.data)}`)
                }
            })
            .catch(erro => {
                if(erro?.response?.data?.causes != undefined){
                    console.log(erro?.response?.data?.causes)
                    reject(`Erro ao cadastrar Kit na Tray ${store.tray_adm_user} - Item ${product.reference}. Motivo da tray: ${JSON.stringify(erro?.response?.data?.causes)}`)
                } else {
                    console.log(erro?.response?.data)
                    reject(`Erro ao cadastrar na Tray ${store.tray_adm_user} - Item ${product.reference}. Resposta da Tray: ${JSON.stringify(erro.response.data)}`)
                }
            })
            .finally(() => {
                TrayRequestsQueue.finishRequest()
            })
        })      
    }

    async createKitRule(store: IStore, rule: IProductKitRule): Promise<{success: boolean, message: string}>{
        return new Promise(async(resolve, reject) => {

            // service disabled

            resolve({ success: true, message: 'regra de kit criada com sucesso' })

            return

            // just for demonstration

            await TrayRequestsQueue.newRequest()
            .catch(erro => {
                new Error(erro)
            })

            const rulesObj = JSON.stringify([{
                product_parent_id: rule.tray_product_parent_id,
                product_id: rule.tray_product_id,
                quantity: rule.quantity,
                discount_type: rule.discount_type,
                discount_value: rule.discount_value,
                price_rule: rule.price_rule
            }])

            const query = `${store.api_address}/products/kits/?access_token=${store.access_token}`
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
                resolve({success: true, message: 'regra de kit inserida com sucesso'})
            })
            .catch(erro => {
                if(erro?.response?.data?.causes != undefined){
                    console.log(erro?.response?.data?.causes)
                    reject(`Erro ao criar regras do kit na Tray ${store.tray_adm_user} - Item ${rule.tray_product_parent_id}. Motivo da tray: ${JSON.stringify(erro?.response?.data?.causes)}`)
                } else {
                    console.log(erro?.response?.data)
                    reject(`Erro ao criar regras do kit na Tray ${store.tray_adm_user} - Item ${rule.tray_product_parent_id}. Resposta da Tray: ${JSON.stringify(erro.response.data)}`)
                }
            })
            .finally(() => {
                TrayRequestsQueue.finishRequest()
            })
        })
    }

    async updateKitRules(store:IStore, rules: IProductKitPutRule): Promise<void>{
        return new Promise(async(resolve, reject) => {

            // service disabled

            resolve()

            return

            // just for demonstration

            await TrayRequestsQueue.newRequest()
            .catch(erro => {
                new Error(erro)
            })

            const rulesObj = {
                product_parent_id: rules.tray_product_parent_id,
                product_id: rules.tray_product_id,
                quantity: rules.quantity,
                discount_type: rules.discount_type,
                discount_value: rules.discount_value,
                price_rule: rules.price_rule
            }

            removeUndefined(rulesObj)

            const trayRules = [rulesObj]

            const query = `${store.api_address}/products/kits/?access_token=${store.access_token}`
            Requests.saveRequest(query)

            const config: any = {
                method: 'post',
                url: query,
                headers: { 
                  'Content-Type': 'application/json'
                },
                data: trayRules
            }

            axios(config)
            .then(response => {
                resolve()
            })
            .catch(erro => {
                console.log(erro.response.data, query, trayRules)
                if(erro?.response?.data?.causes != undefined){
                    console.log(erro?.response?.data?.causes)
                    reject(`Erro ao editar regras do kit na Tray ${store.tray_adm_user} - Item ${rules.tray_product_parent_id}. Motivo da tray: ${JSON.stringify(erro?.response?.data?.causes)}`)
                } else {
                    console.log(erro?.response?.data)
                    reject(`Erro ao editar regras do kit na Tray ${store.tray_adm_user} - Item ${rules.tray_product_parent_id}. Resposta da Tray: ${JSON.stringify(erro.response.data)}`)
                }
            })
            .finally(() => {
                TrayRequestsQueue.finishRequest()
            })

            function removeUndefined(obj: any){
                Object.keys(obj).forEach(key => {
                    if (obj[key] === undefined) {
                      delete obj[key];
                    }
                });
                return obj
            }
        })
    }

    async delete(store: IStore, trayId: number): Promise<{success: boolean, message: string}>{
        return new Promise(async(resolve, reject) => {

            // service disabled

            resolve({success: true, message: 'produto exclu??do com sucesso'})

            return

            // just for demonstration

            await TrayRequestsQueue.newRequest()
            .catch(erro => {
                new Error(erro)
            })

            const query = `${store.api_address}/products/${trayId}/?access_token=${store.access_token}`
            Requests.saveRequest(query)

            const config: AxiosRequestConfig = {
                method: 'delete',
                url: query,
                headers: { 
                  'Content-Type': 'application/json'
                },
            }

            axios(config)
            .then(response => {
                resolve({success: true, message: 'produto exclu??do com sucesso'})
            })
            .catch(erro => {
                if(erro?.response?.data?.causes != undefined){
                    console.log(erro?.response?.data?.causes)
                    reject(`Erro ao excluir o produto na Tray ${store.tray_adm_user} - Item ${trayId}. Motivo da tray: ${JSON.stringify(erro?.response?.data?.causes)}`)
                } else {
                    console.log(erro?.response?.data)
                    reject(`Erro ao excluir o produto na Tray ${store.tray_adm_user} - Item ${trayId}. Resposta da Tray: ${JSON.stringify(erro.response.data)}`)
                }
            })
            .finally(() => {
                TrayRequestsQueue.finishRequest()
            })
        })
    }
}

export default new TrayProducts