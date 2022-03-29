import OAuth2Tray from "../../../models/Auth/OAuth2Tray";
import TrayProducts from "../../Tray/TrayProducts";
import ProductDataBase from "../ProductDataBase"
import Validate, { IPricingInput, IDetailsInput, IProductKitInput, IRulesInput } from "../Validate"

type HubIdResponse = number;

class EditProduct {
    
    async unitary(values: IDetailsInput, hubId: number): Promise<void>{
        return new Promise(async(resolve, reject) => {
            const unitary = await Validate.hubProduct(values)

            await ProductDataBase.updateProduct({...unitary, hub_id: hubId},)
            .then( response => {
                resolve()
            })
            .catch(erro => {
                reject(erro)
            })
        })

    }

    async pricing(values: IPricingInput, trayPricingId: number, storeId: number): Promise<void>{
        return new Promise(async(resolve, reject) => {

            const pricing = await Validate.createPricing(values, storeId)
            
            await ProductDataBase.updatePricing({...pricing, tray_product_id: undefined}, `tray_pricing_id = ${trayPricingId}`)
            .then(response => {
                resolve()
            })
            .catch(erro => {
                reject(erro)
            })
        })
    }

    async kitPricingRules(pricing: IPricingInput, kitRules: IRulesInput, trayPricingId: number): Promise<void>{
        return new Promise(async(resolve, reject) => {

            const validatedPricing = Validate.createKitPricing(pricing, kitRules)

            const updatedPricing = ProductDataBase.updatePricing({...await validatedPricing, tray_product_id: undefined}, `tray_pricing_id = ${trayPricingId}`)
            .then(response => {return true})
            .catch(erro => {
                reject(erro)
                return erro
            })

            const updatedRules = ProductDataBase.updateKitRules(kitRules, `tray_pricing_id = ${trayPricingId}`)
            .then(response => {return true})
            .catch(erro => {
                reject(erro)
                return erro
            })

            if(await updatedPricing == true && await updatedRules == true){
                resolve()
            } else {
                reject(`pricing = ${updatedPricing}, rules: ${updatedRules}`)
            }
        })
    }

    async unitaryTray(details: IDetailsInput, pricing: IPricingInput, trayId: number, storeId: number): Promise<void>{
        return new Promise(async(resolve, reject) => {

            const storeCredentials = OAuth2Tray.getStoreCredentials(storeId)
            const unitary = Validate.hubProduct(details)
            const unitaryPricing = Validate.createPricing(pricing, storeId)

            await TrayProducts.updateProduct(await storeCredentials, {...await unitary, ...await unitaryPricing}, trayId)
            .then( response => {
                resolve()
            })
            .catch(erro => {
                reject(erro)
            })
        })

    }

    async kitTray(details: IDetailsInput, pricing: IPricingInput, rules: IRulesInput, storeId: number): Promise<void>{
        return new Promise(async(resolve, reject) => {

            const storeCredentials = OAuth2Tray.getStoreCredentials(storeId)
            const product = Validate.hubProduct(details)
            const productPricing = Validate.createKitPricing(pricing, rules)

            const updatedProduct = TrayProducts.updateProduct(await storeCredentials, {...await product, ...await productPricing}, (await productPricing).tray_product_id)
            .then( response => {
                return true
            })
            .catch(erro => {
                return erro
            })
            
            const updatedRules = TrayProducts.updateKitRules(await storeCredentials, rules)
            .then( response => {
                return true
            })
            .catch(erro => {
                return erro
            })
            
            if(await updatedProduct == true && await updatedRules == true){
                resolve()
            } else {
                reject(`product = ${updatedProduct}, rules: ${updatedRules}`)
            }
        })

    }
}

export default new EditProduct