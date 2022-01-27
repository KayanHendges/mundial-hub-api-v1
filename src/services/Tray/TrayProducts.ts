import axios from "axios"
import OAuth2Tray from "../../models/Auth/OAuth2Tray"
import Requests from "../../models/Tray/Requests"
import { IProductKitRule, IProductPostUnitary } from "../../types/tray"


interface IStore {
    tray_adm_user: string;
    store: string;
    api_address: string;
    access_token: string;
}

class TrayProducts {

    async createUnitary(store: IStore, product: IProductPostUnitary): Promise<number>{
        return new Promise(async(resolve, reject) => {

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
                if(erro.response.data.causes != undefined){
                    console.log(erro.response.data.causes)
                    reject(`Erro ao cadastrar na Tray ${store.tray_adm_user} - Item ${product.reference}. Motivo da tray: ${JSON.stringify(erro.response.data.causes)}`)
                } else {
                    console.log(erro.response.data)
                    reject(`Erro ao cadastrar na Tray ${store.tray_adm_user} - Item ${product.reference}. Resposta da Tray: ${JSON.stringify(erro.response.data)}`)
                }
            })
        })      
    }

    async createKit(store: IStore, product: IProductPostUnitary): Promise<number>{
        return new Promise(async(resolve, reject) => {

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
                if(erro.response.data.causes != undefined){
                    console.log(erro.response.data.causes)
                    reject(`Erro ao cadastrar na Tray ${store.tray_adm_user} - Item ${product.reference}. Motivo da tray: ${JSON.stringify(erro.response.data.causes)}`)
                } else {
                    console.log(erro.response.data)
                    reject(`Erro ao cadastrar na Tray ${store.tray_adm_user} - Item ${product.reference}. Resposta da Tray: ${JSON.stringify(erro.response.data)}`)
                }
            })
        })      
    }

    async createKitRule(store: IStore, rule: IProductKitRule): Promise<{success: boolean, message: string}>{
        return new Promise((resolve, reject) => {

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
                if(erro.response.data.causes != undefined){
                    console.log(erro.response.data.causes)
                    reject(`Erro ao criar regras do kit na Tray ${store.tray_adm_user} - Item ${rule.tray_product_parent_id}. Motivo da tray: ${JSON.stringify(erro.response.data.causes)}`)
                } else {
                    console.log(erro.response.data)
                    reject(`Erro ao criar regras do kit na Tray ${store.tray_adm_user} - Item ${rule.tray_product_parent_id}. Resposta da Tray: ${JSON.stringify(erro.response.data)}`)
                }
            })
        })
    }
}

export default new TrayProducts