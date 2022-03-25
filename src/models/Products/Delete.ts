import TrayProducts from "../../services/Tray/TrayProducts"
import ProductDataBase from "../../services/Products/ProductDataBase"
import OAuth2Tray from "../Auth/OAuth2Tray"
import Connect from "../../database/Connect"

interface ITrayIdDelete {
    trayProductId: number,
    storeId: number
}

class Delete {

    async kit(hubId: number): Promise<void>{
        return new Promise(async(resolve, reject) => {

            const mundialCredentials = OAuth2Tray.getStoreCredentials(668385)
            const scpneusCredentials = OAuth2Tray.getStoreCredentials(1049898)

            const trayIdList = await checkTrayId(hubId)
            .catch(erro => {
                reject(erro)
                return null
            })

            if(trayIdList == null){return}

            await deleteTrayloop(trayIdList, 0)

            const deleteRules = await ProductDataBase.deleteKitRules(`hub_id = ${hubId}`)
            const deletePricing = await ProductDataBase.deletePricing(`hub_id = ${hubId}`)
            const deleteProduct = await ProductDataBase.deleteProduct(`hub_id = ${hubId}`)

            resolve()

            async function checkTrayId(hubId: number): Promise<ITrayIdDelete[]>{
                return new Promise(async(resolve, reject) => {

                    const list: ITrayIdDelete[] = []

                    const pricingList = await ProductDataBase.getPricing({hub_id: hubId}, false)
                    .catch(erro => {
                        reject(erro)
                        return null
                    })

                    pricingList?.map(pricing => {
                        if(pricing.tray_product_id){
                            if(pricing.tray_product_id > 0){
                                list.push({
                                    trayProductId: pricing.tray_product_id,
                                    storeId: pricing.tray_store_id
                                })
                            }
                        }
                    })

                    return list
                })
            }

            async function deleteTrayloop(list: ITrayIdDelete[], index: number): Promise<void>{
                return new Promise(async(resolve, reject) => {
                    if(list.length > index){

                        const store = list[index].storeId == 668385? mundialCredentials : scpneusCredentials
                        await TrayProducts.delete(await store, list[index].trayProductId)
                        setTimeout(() => {
                            resolve(deleteTrayloop(list, index+1))
                        }, 330)
                    } else {
                        resolve()
                    }
                })
            }
        })
    }
    
    async unitaryTray(reference: string, storeId: number): Promise<void>{
        return new Promise(async(resolve, reject) => {
            
            const storeCredentials = OAuth2Tray.getStoreCredentials(storeId)

            const hubIdList = await ProductDataBase.getProduct({reference: reference}, false)
            .then(response => {
                const list: number[] = []
                response.map(product => {
                    list.push(product.hub_id)
                })
                return list
            })
            .catch(erro => {
                reject(erro)
                return false
            })
            if(hubIdList == false){return}

            const trayIdList = await getTrayId(hubIdList as number[], storeId)

            await deleteTrayloop(trayIdList, 0)

            resolve()

            async function getTrayId(hubIdList: number[], storeId: number): Promise<number[]>{
                return new Promise(async(resolve, reject) => {

                    const sql = `SELECT tray_product_id 
                    WHERE hub_id IN (${hubIdList.join(',')}) AND tray_store_id = ${storeId}
                    ORDER BY tray_product_id ASC`

                    Connect.query(sql, (erro, resultado) => {
                        if ( erro ){
                            console.log(erro)
                            resolve([])
                        } else {
                            const list = resultado?.map((result: any) => {
                                return result.tray_product_id
                            })
                            resolve(list)
                        }
                    })
                })
            }

            async function deleteTrayloop(list: number[], index: number): Promise<void>{
                return new Promise(async(resolve, reject) => {
                    if(list.length > index){
                        await TrayProducts.delete(await storeCredentials, list[index])
                        await ProductDataBase.updatePricing({tray_product_id: 0}, `tray_product_id = ${list[index]} AND tray_store_i = ${storeId}`)
                        await ProductDataBase.updateKitRules({tray_product_parent_id: 0}, `tray_product_parent_id = ${list[index]} AND tray_store_i = ${storeId}`)
                        setTimeout(() => {
                            resolve(deleteTrayloop(list, index+1))
                        }, 300) 
                    } else {
                        resolve()
                    }
                })
            }
        })
    }

    async kitTray(trayPricingId: number, storeId: number): Promise<void>{
        return new Promise(async(resolve, reject) => {
            
            const storeCredentials = OAuth2Tray.getStoreCredentials(storeId)
            const {tray_product_id} = await ProductDataBase.getPricing({tray_pricing_id: trayPricingId}, true, storeId)
            const trayDelete = await TrayProducts.delete(await storeCredentials, tray_product_id as number)
            .then(response => {
                return true
            })
            .catch(erro => {
                reject(erro)
            })
            if(trayDelete == true){

                const updatedPricing = ProductDataBase.updatePricing({tray_product_id: 0}, `tray_pricing_id = ${trayPricingId}`)
                .then(response => {
                    return true
                })
                .catch(erro => {
                    return erro
                })
                const updatedRules = ProductDataBase.updateKitRules({tray_product_parent_id: 0}, `tray_pricing_id = ${trayPricingId}`)
                .then(response => {
                    return true
                })
                .catch(erro => {
                    return erro
                })

                if(await updatedRules == true && await await updatedRules == true ){
                    resolve()
                } else {
                    reject(`pricing - ${updatedPricing}, rules - ${updatedRules} `)
                }

            } else {
                return
            }

        })
    }
}

export default new Delete