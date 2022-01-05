import { addHours } from "date-fns"
import { Response } from "express"
import Connect from "../../database/Connect"

interface IResponse {
    success: boolean
}

interface IStandartCost {
    standartCost: number;
    costType: string;
}

interface IUpdateProduct {
    productId: number;
    productName: string;
    brand: string;
    stock: number;
    price: number;
    additionalCosts: number;
    lastUpdate: Date;
}

interface IUpdateProductLocal {
    hubId: number;
    productId: number;
    productName: string;
    brand: string;
    stock: number;
    price: number;
    additionalCosts: number;
    lastUpdate: Date;
}

interface ISaveProducts {
    saveProductsDB(products: IUpdateProduct[], providerId: number, res: Response): object;
    saveProductsDBLocal(products: IUpdateProductLocal[], providerId: number, res: Response): object;
}

class SaveProducts implements ISaveProducts {
    async saveProductsDB(products: IUpdateProduct[] | any[], providerId: number, res: Response): Promise<void>{

        const zeroStock = await setZeroStock(providerId)
        const standartCosts = await getStandartCost(providerId)

        if(zeroStock && standartCosts){
            console.log('Estoques zerados')
            // const lastUpdate = new Date()
            const response = await productLoop(products, 0, providerId)
            console.log('fim da operação')
    
            if(response.success){
                res.status(200).json({
                    code: 200,
                    message: 'produtos atualizados com sucesso',
                    products: products
                })
            } else {
                res.status(400).json({
                    code: 400,
                    message: 'houve algum erro no processo de atualização do banco de dados',
                    products: products
                })
            }
        } else {
            res.status(400).json({
                code: 400,
                message: 'erro ao salvar no banco de dados devido a funções anteriores'
            })
        }


        async function productLoop(products: IUpdateProduct[], index: number, providerId: number): Promise<IResponse>{
            return new Promise(async(resolve) => {
                
                console.log(products[index])
                const updateProduct = await update(products[index], providerId)

                if(!updateProduct.success){
                    const createProduct = await create(products[index], providerId)

                    if(createProduct.success){
                        console.log(index+1, " / ", products.length, ' - inserido com sucesso')
                        if(products.length > index+1){
                            resolve(productLoop(products, index+1, providerId))
                        } else {
                            resolve({success: true})
                        }

                    } else {
                        resolve({success: false})
                    }

                } else {
                    console.log(index+1, " / ", products.length, ' - update com sucesso')
                    if(products.length > index+1){
                        resolve(productLoop(products, index+1, providerId))
                    } else {
                        resolve({success: true})
                    }
                }
                
            })
        }

        async function update(product: IUpdateProduct, providerId: number): Promise<IResponse>{
            return new Promise(resolve => {
                
                const productDB = {
                    product_name: product.productName,
                    product_brand: product.brand,
                    product_stock: product.stock,
                    product_price: product.price,
                    additional_costs: product.additionalCosts,
                    last_update: product.lastUpdate
                }

                const sql = `UPDATE providers_products SET ? WHERE product_reference=${product.productId} AND provider_id=${providerId}`

                Connect.query(sql, productDB, (erro, resultado) => {
                    if(erro){
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao salvar no banco de dados'
                        })
                    } else {
                        if(resultado.affectedRows > 0){
                            resolve({success: true})
                        } else {
                            resolve({success: false})
                        }
                    }
                })                
            })
        }

        async function create(product: IUpdateProduct, providerId: number): Promise<IResponse>{
            return new Promise(resolve => {

                const productDB = {
                    provider_id: providerId,
                    hub_id: 0,
                    product_reference: product.productId,
                    product_name: product.productName,
                    product_brand: product.brand,
                    product_stock: product.stock,
                    product_price: product.price,
                    additional_costs: product.additionalCosts,
                    need_create: 0,
                    ignore_product: 0,
                    last_update: product.lastUpdate
                }

                const sql = `INSERT INTO providers_products SET ?`

                Connect.query(sql, productDB, (erro, resultado) => {
                    if(erro){
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao salvar no banco de dados'
                        })
                    } else {
                        resolve({success: true})
                    }
                })                
            })
        }

        async function setZeroStock(providerId: number): Promise<boolean>{
            return new Promise(resolve => {
                const sql = `UPDATE providers_products SET product_stock = 0 WHERE provider_id = ${providerId}`

                Connect.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao zerar o estoques dos produtos vinculados a esse fornecedor'
                        })
                    } else {
                        resolve(true)
                    }
                })
            })
        }

        async function getStandartCost(providerId: number): Promise<IStandartCost>{
            return new Promise(resolve => {
                const sql = `SELECT standart_costs, cost_type FROM providers WHERE provider_id = ${providerId}`

                Connect.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao consultar dados do fornecedor'
                        })
                    } else {
                        resolve({
                            standartCost: resultado[0].standart_costs,
                            costType: resultado[0].cost_type
                        })
                    }
                })
            })
        }
    }

    async saveProductsDBLocal(products: IUpdateProductLocal[] | any[], providerId: number, res: Response): Promise<void>{

        const zeroStock = await setZeroStock(providerId)
        const standartCosts = await getStandartCost(providerId)

        if(zeroStock && standartCosts){
            console.log('Estoques zerados')
            // const lastUpdate = new Date()
            const response = await productLoop(products, 0, providerId)
            console.log('fim da operação')
    
            if(response.success){
                res.status(200).json({
                    code: 200,
                    message: 'produtos atualizados com sucesso',
                    products: products
                })
            } else {
                res.status(400).json({
                    code: 400,
                    message: 'houve algum erro no processo de atualização do banco de dados',
                    products: products
                })
            }
        } else {
            res.status(400).json({
                code: 400,
                message: 'erro ao salvar no banco de dados devido a funções anteriores'
            })
        }


        async function productLoop(products: IUpdateProductLocal[], index: number, providerId: number): Promise<IResponse>{
            return new Promise(async(resolve) => {
                
                const updateProduct = await update(products[index], providerId)

                if(!updateProduct.success){
                    const createProduct = await create(products[index], providerId)

                    if(createProduct.success){
                        console.log(index+1, " / ", products.length, ' - inserido com sucesso')
                        if(products.length > index+1){
                            resolve(productLoop(products, index+1, providerId))
                        } else {
                            resolve({success: true})
                        }

                    } else {
                        resolve({success: false})
                    }

                } else {
                    console.log(index+1, " / ", products.length, ' - update com sucesso')
                    if(products.length > index+1){
                        resolve(productLoop(products, index+1, providerId))
                    } else {
                        resolve({success: true})
                    }
                }
                
            })
        }

        async function update(product: IUpdateProductLocal, providerId: number): Promise<IResponse>{
            return new Promise(resolve => {
                
                const productDB = {
                    hub_id: product.hubId,
                    product_name: product.productName,
                    product_brand: product.brand,
                    product_stock: product.stock,
                    product_price: product.price,
                    additional_costs: product.additionalCosts,
                    last_update: product.lastUpdate
                }

                console.log

                const sql = `UPDATE providers_products SET ? WHERE product_reference=${product.productId} AND provider_id=${providerId}`

                Connect.query(sql, productDB, (erro, resultado) => {
                    if(erro){
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao salvar no banco de dados'
                        })
                    } else {
                        if(resultado.affectedRows > 0){
                            resolve({success: true})
                        } else {
                            resolve({success: false})
                        }
                    }
                })                
            })
        }

        async function create(product: IUpdateProductLocal, providerId: number): Promise<IResponse>{
            return new Promise(resolve => {

                const productDB = {
                    provider_id: providerId,
                    hub_id: product.hubId,
                    product_reference: product.productId,
                    product_name: product.productName,
                    product_brand: product.brand,
                    product_stock: product.stock,
                    product_price: product.price,
                    additional_costs: product.additionalCosts,
                    need_create: 0,
                    ignore_product: 0,
                    last_update: product.lastUpdate
                }

                const sql = `INSERT INTO providers_products SET ?`

                Connect.query(sql, productDB, (erro, resultado) => {
                    if(erro){
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao salvar no banco de dados'
                        })
                    } else {
                        resolve({success: true})
                    }
                })                
            })
        }

        async function setZeroStock(providerId: number): Promise<boolean>{
            return new Promise(resolve => {
                const sql = `UPDATE providers_products SET product_stock = 0 WHERE provider_id = ${providerId}`

                Connect.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao zerar o estoques dos produtos vinculados a esse fornecedor'
                        })
                    } else {
                        resolve(true)
                    }
                })
            })
        }

        async function getStandartCost(providerId: number): Promise<IStandartCost>{
            return new Promise(resolve => {
                const sql = `SELECT standart_costs, cost_type FROM providers WHERE provider_id = ${providerId}`

                Connect.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao consultar dados do fornecedor'
                        })
                    } else {
                        resolve({
                            standartCost: resultado[0].standart_costs,
                            costType: resultado[0].cost_type
                        })
                    }
                })
            })
        }
    }
}

export default new SaveProducts   