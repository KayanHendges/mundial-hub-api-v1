import { response, Response } from "express"
import OAuth2Tray from "../../../models/Auth/OAuth2Tray"
import TrayProducts from "../../Tray/TrayProducts"
import ProductDataBase from "../ProductDataBase"
import Validate, { IPricingInput, IDetailsInput, IProductKitInput, IRulesInput } from "../Validate"

type HubIdResponse = number;

class EditProduct {
    
    async EditUnitary(values: IDetailsInput, hubId: number): Promise<void>{
        return new Promise(async(resolve, reject) => {
            const unitary = await Validate.hubProduct(values)

            await ProductDataBase.updateProduct({...unitary, hub_id: hubId})
            .then( response => {
                resolve()
            })
            .catch(erro => {
                reject(erro)
            })
        })

    }


}

export default new EditProduct