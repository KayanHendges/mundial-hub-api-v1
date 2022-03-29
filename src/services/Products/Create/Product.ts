import { response, Response } from "express"
import OAuth2Tray from "../../../models/Auth/OAuth2Tray"
import TrayProducts from "../../Tray/TrayProducts"
import ProductDataBase from "../ProductDataBase"
import Validate, { IPricingInput, IDetailsInput, IProductKitInput, IRulesInput } from "../Validate"

type HubIdResponse = number;

class CreateProduct {
    
    async createUnitary(values: IDetailsInput): Promise<HubIdResponse>{
        return new Promise(async(resolve, reject) => {
            const unitary = await Validate.hubProduct(values)

            await ProductDataBase.insert(unitary)
            .then( response => {
                resolve(response)
            })
            .catch(erro => {
                reject(erro)
            })
        })

    }

    async createPricing(values: IPricingInput, storeId: number): Promise<number>{
        return new Promise(async(resolve, reject) => {
            
            const storeCredentials = OAuth2Tray.getStoreCredentials(storeId)

            const unitary = await Validate.createPricing(values, storeId)

            await ProductDataBase.insertPricing(unitary, await storeCredentials)
            .then( response => {
                resolve(response)
            })
            .catch(erro => {
                reject(erro)
            })

        })
    }

    async createKitPricingRules(unitaryPricing: IPricingInput, kitRules: IRulesInput, storeId: number): 
    Promise<{ pricing_id: number, rules_id: number  }>{
        return new Promise(async(resolve, reject) => {
            const storeCredentials = OAuth2Tray.getStoreCredentials(storeId)
    
            const pricing = await Validate.createKitPricing(unitaryPricing, kitRules)
            const pricingId = await ProductDataBase.insertPricing(pricing, await storeCredentials)
            .catch(erro => {
                reject(erro)
                return 0
            })

            if(pricingId == 0){ return }
    
            const ruleId = await ProductDataBase.insertKitRules({
                ...kitRules,
                hub_id: unitaryPricing.hub_id,
                kit_price: pricing.tray_promotional_price > 0? pricing.tray_promotional_price : pricing.tray_price,
                tray_pricing_id: pricingId,
                tray_product_id: kitRules.tray_product_id? kitRules.tray_product_id : 0,
                tray_product_parent_id: unitaryPricing.tray_product_id? unitaryPricing.tray_product_id : 0,
            })
            .catch(erro => {
                reject(erro)
                return 0
            })

            if(ruleId == 0){ return }

            resolve({
                pricing_id: pricingId,
                rules_id: ruleId
            })
        })

    }

    async createTrayUnitary(unitaryDetails: IDetailsInput, unitaryPricing: IPricingInput, trayPricingId: number, storeId: number): Promise<number>{
        return new Promise(async(resolve, reject) => {

            const storeCredentials = OAuth2Tray.getStoreCredentials(storeId)

            const unitary = Validate.hubProduct(unitaryDetails)
            const pricing = Validate.createPricing(unitaryPricing, storeId)
            
            const trayId = await TrayProducts.createUnitary(await storeCredentials, {... await unitary, ...await pricing})
            .catch(erro => {
                reject(erro)
                return 0
            })

            if(trayId == 0){ return }

            await ProductDataBase.updatePricing({tray_product_id: trayId}, `tray_pricing_id = ${trayPricingId}`)
            .then(response => {
                resolve(trayId)
            })
            .catch(erro => {
                reject(`Criado na tray com id = ${trayId}, porém erro ao atualizar o banco de dados: ${erro}`)
            })
        })
    }

    async createTrayKit(unitaryDetails: IDetailsInput, unitaryPricing: IPricingInput, kitRules: IRulesInput, trayPricingId: number, storeId: number): Promise<number>{
        return new Promise(async(resolve, reject) => {

            const storeCredentials = OAuth2Tray.getStoreCredentials(storeId)

            const details = Validate.hubProduct(unitaryDetails)
            const pricing = Validate.createKitPricing(unitaryPricing, kitRules)
            
            const trayParentId = await TrayProducts.createKit(await storeCredentials, {... await details, ...await pricing})
            .catch(erro => {
                reject(erro)
                return 0
            })

            if(trayParentId == 0){ return }

            const updatedPricing = ProductDataBase.updatePricing({tray_product_id: trayParentId}, `tray_pricing_id = ${trayPricingId}`)
            .then(response => {
                return true
            })
            .catch(erro => {
                reject(erro)
                return false
            })
            
            const updatedKitRules = ProductDataBase.updateKitRules({
                tray_product_parent_id: trayParentId,
                tray_product_id: kitRules.tray_product_id
            }, `tray_pricing_id=${trayPricingId}`)
            .then(response => {
                return true
            })
            .catch(erro => {
                reject(erro)
                return false
            })


            const kitRuleTray = TrayProducts.createKitRule(await storeCredentials, {...kitRules, tray_product_id: kitRules.tray_product_id as number, tray_product_parent_id: trayParentId})
            .then(response => {
                return true
            })
            .catch(erro => {
                reject(erro)
                return false
            })

            if (await updatedPricing && await updatedKitRules && await kitRuleTray){
                resolve(trayParentId)
            } else {
                reject('erro desconhecido')
            }
        })
    }

}

export default new CreateProduct