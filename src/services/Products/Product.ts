import { Response } from "express"
import OAuth2Tray from "../../models/Auth/OAuth2Tray"
import TrayProducts from "../Tray/TrayProducts"
import ProductDataBase from "./ProductDataBase"
import Validate, { IPricingInput, IProductInput, IProductKitInput } from "./Validate"

interface ICreateUnitaryResponse {
    hub_id: number;
    tray_product_id: number
}

class Product {
    
    async createUnitary(values: IProductInput, res: Response): Promise<ICreateUnitaryResponse>{
     
        const MundialCredentials = await OAuth2Tray.getStoreCredentials(668385)
        const ScPneusCredentials = await OAuth2Tray.getStoreCredentials(1049898)

        const unitary = await Validate.unitary(values)
        
        const unitaryMundialId = TrayProducts.createUnitary(MundialCredentials, {...unitary.details, ...unitary.pricing.mundial})
        .catch(erro => {
            res.status(400).json({
                code: 400,
                message: erro
            })
            return 0
        })
        // Sem await para fazer mais de uma operação síncrona
        const unitaryScPneusId = TrayProducts.createUnitary(ScPneusCredentials, {...unitary.details, ...unitary.pricing.scpneus})
        .catch(erro => {
            res.status(400).json({
                code: 400,
                message: erro
            })
            return 0
        })
        // Sem await para fazer mais de uma operação síncrona

        if(await unitaryMundialId == 0 && await unitaryScPneusId == 0){}

        const unitaryHubId = await ProductDataBase.insert(unitary.details)
        .catch(erro => {
            res.status(400).json({code: 400, message: erro})
            return 0
        })

        if(unitaryHubId == 0){}

        const pricingMundialId = ProductDataBase.insertPricing({
            ...unitary.pricing.mundial,
            hub_id: unitaryHubId,
            tray_product_id: await unitaryMundialId,
        }, MundialCredentials)
        .catch(erro => {
            res.status(400).json({code: 400, message: erro})
            return 0
        })
        // Sem await para fazer mais de uma operação síncrona

        const pricingScPneusId = ProductDataBase.insertPricing({
            ...unitary.pricing.scpneus,
            hub_id: unitaryHubId,
            tray_product_id: await unitaryScPneusId,
        }, ScPneusCredentials)
        .catch(erro => {
            res.status(400).json({code: 400, message: erro})
            return 0
        })
        // Sem await para fazer mais de uma operação síncrona
        
        if(await pricingMundialId == 0 && await pricingScPneusId == 0){}

        return {
            hub_id: unitaryHubId,
            tray_product_id: await unitaryMundialId
        }

    }

    async createKit(values: IProductKitInput, unitaryPricing: IPricingInput, trayChildrenId: number, res: Response): Promise<ICreateUnitaryResponse>{
     
        const MundialCredentials = await OAuth2Tray.getStoreCredentials(668385)

        const kit = await Validate.kit(values, unitaryPricing)

        const trayId = await TrayProducts.createKit(MundialCredentials, {...kit.details, ...kit.pricing.mundial})
        .catch(erro => {
            res.status(400).json({
                code: 400,
                message: erro
            })
            return 0
        })

        if(trayId == 0){}

        const hubId = await ProductDataBase.insert(kit.details)
        .catch(erro => {
            res.status(400).json({code: 400, message: erro})
            return 0
        })

        if(hubId == 0){}

        const pricingId = await ProductDataBase.insertPricing({
            ...kit.pricing.mundial,
            hub_id: hubId,
            tray_product_id: trayId,
        }, MundialCredentials)
        .catch(erro => {
            res.status(400).json({code: 400, message: erro})
            return 0
        })
        
        if(pricingId == 0){}

        const rulesTray = TrayProducts.createKitRule(MundialCredentials, {
            ...kit.rules,
            tray_product_id: trayChildrenId,
            tray_product_parent_id: trayId
        })
        .then(response => {return true})
        .catch(erro => {
            res.status(400).json({code: 400, message: erro})
            return 0
        })

        const kitRulesId = ProductDataBase.insertKitRules({
            ...kit.rules,
            ...kit.pricing.mundial,
            hub_id: hubId,
            tray_pricing_id: pricingId,
            tray_product_id: trayChildrenId,
            tray_product_parent_id: trayId,
            kit_price: kit.pricing.mundial.tray_promotional_price == 0 ?
            kit.pricing.mundial.tray_price : kit.pricing.mundial.tray_promotional_price 
        })
        .catch(erro => {
            res.status(400).json({code: 400, message: erro})
            return false
        })

        if(await kitRulesId == 0 && await rulesTray == false){}

        return {
            hub_id: hubId,
            tray_product_id: trayId
        }

    }
}

export default new Product