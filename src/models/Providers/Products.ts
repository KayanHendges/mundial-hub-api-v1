import { format } from "date-fns"
import { Response } from "express"
import Connect from "../../database/Connect"

interface IProviderProduct {
    providerReference: number;
    providerName: string;
}

interface IIds {
    providerReference: number;
    hubId: number;
}

interface IProviderProductToList {
    providerReference: number;
    reference: string;
    productName: string;
    stock: number;
    cost: number;
    additionalCost: string;
    totalCost: number;
}

interface IProviderProductsList {
    products: IProviderProductToList[]
    lastUpdate: string;
}

interface IProviderProducts {
    getProductsNotLinked(providerId: number, param: string, search: string, res: Response): Promise<void>;
    handleProductsNotLinked(ids: IIds, handleFunction: string, res: Response): Promise<void>;
    listByProviders(providerId: number, search: string, res: Response): void;
}

class Products implements IProviderProducts {
    
    async listByProviders(providerId: number, search: string, res: Response){

        const searchQuery = getSearchQuery(search)

        const products = await getProducts(providerId, searchQuery)

        res.status(200).json({
            code: 200,
            products: products.products,
            count: await getCount(providerId, searchQuery),
            lastUpdate: products.lastUpdate
        })
        
        async function getProducts(providerId: number, search: string): Promise<IProviderProductsList>{
            return new Promise(resolve => {

                const sql = `SELECT pp.product_reference, p.reference, p.product_name, pp.product_stock, pp.product_price, pv.standart_costs, pv.cost_type, pp.last_update
                FROM produtos p JOIN providers_products pp ON p.hub_id = pp.hub_id JOIN providers pv on pv.provider_id = pp.provider_id
                WHERE pp.provider_id = ${providerId} ${search}
                LIMIT 0, 20`

                Connect.query(sql, (erro, resultado: any[]) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao se conectar ao banco de dados'
                        })
                    } else {
                        if(resultado.length > 0){
                            const products = resultado.map(product => {
                                return {
                                    providerReference: product.product_reference,
                                    reference: product.reference,
                                    productName: product.product_name,
                                    stock: product.product_stock,
                                    cost: product.product_price,
                                    additionalCost: getAdditionalCost(product.standart_costs, product.cost_type),
                                    totalCost: calcTotalCost(product.product_price, product.standart_costs, product.cost_type)
                                }
                            })

                            var lastUpdate = '0000-00-00 00:00:00'

                            if(typeof(resultado[0].last_update) != 'string'){
                                lastUpdate = format(resultado[0].last_update, 'yyyy-MM-dd hh:mm:ss').toString()
                            }

                            resolve({products: products, lastUpdate: lastUpdate})
                        } else {
                            resolve({products: [], lastUpdate: '0000-00-00 00:00:00'})
                        }
                    }
                })
                
                function getAdditionalCost(cost: number, costType: string): string{
                    if(cost == 0){
                        return ''
                    }
                    
                    if(costType == '$' || costType == '%'){
                        return `${cost}${costType}`
                    }

                    return ''
                }

                function calcTotalCost(price: number, cost: number, costType: string): number{
                    if(cost == 0){
                        return price
                    }

                    if(costType == '$'){
                        return price + cost
                    }
                    
                    if(costType == '%'){
                        return parseFloat((price * ((cost/100)+1)).toFixed(2))
                    }

                    return price
                }
            })
        }

        async function getCount(providerId: number, search: string): Promise<number>{
            return new Promise(resolve => {
                
                const sql = `SELECT count(pp.provider_product_id)
                FROM produtos p JOIN providers_products pp ON p.hub_id = pp.hub_id JOIN providers pv on pv.provider_id = pp.provider_id
                WHERE pp.provider_id = ${providerId} ${search}`            

                Connect.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao conectar ao banco de dados'
                        })
                    } else {
                        if(resultado.length > 0){
                            var productsLength = JSON.stringify(resultado[0])
                            productsLength = productsLength.replace('{"count(pp.provider_product_id)":', '')
                            productsLength = productsLength.replace('}', '')
                            resolve(parseInt(productsLength))
                        } else {
                            resolve(0)
                        }
                    }
                })
            })
        }

        function getSearchQuery(search: string){

            var onlyNumber = true
            
            search.split('').map(crt => {
                if(isNaN(parseInt(crt))){
                    onlyNumber = false
                }
            })

            if(search.length == 4 && onlyNumber){
                return `AND p.reference = ${search}`
            }

            if(search.length > 0){
                const words = search.split(' ').map(word => {
                    return `${word}%`
                })

                return `AND p.product_name LIKE '%${words.join('')}'`
            } else {
                return ''
            }
        }
    }

    async getProductsNotLinked(providerId: number, param: string, search: string, res: Response){

        const searchName = () => {
            if(search.length > 0){
                const words = search.split(' ').map(word => {
                    return `${word}%`
                })

                return `AND product_name LIKE '%${words.join('')}'`
            } else {
                return ''
            }
        }

        const products = await getProvidersProducts(providerId, param, searchName())
        const count = await getCount(providerId, param, searchName())

        res.status(200).json({
            code: 200,
            products: products,
            count: count
        })
        
        async function getProvidersProducts(providerId: number, param: string, search: string): Promise<IProviderProduct[]>{
            return new Promise(resolve => {

                var sql = ``

                if(param == 'link'){
                    sql = `SELECT product_reference, product_name FROM providers_products 
                    WHERE provider_id=${providerId} AND hub_id=0 AND ignore_product=0 AND need_create=0 AND product_stock > 0 ${search}
                    ORDER BY product_name ASC LIMIT 0,10`
                }

                if(param == 'create'){
                    sql = `SELECT product_reference, product_name FROM providers_products 
                    WHERE provider_id=${providerId} AND hub_id=0 AND ignore_product=0 AND need_create=1 AND product_stock > 0 ${search}
                    ORDER BY product_name ASC LIMIT 0,10`
                }                

                
                Connect.query(sql, (erro, resultado: any[]) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao conectar ao banco de dados'
                        })
                    } else {
                        if(resultado.length > 0){
                            const result = resultado.map(product => {
                                return {
                                    providerReference: product.product_reference,
                                    providerName: product.product_name
                                }
                            })
                            resolve(result)
                        } else {
                            resolve([])
                        }
                    }
                })
            })
        }

        async function getCount(providerId: number, param: string, search: string): Promise<number>{
            return new Promise(resolve => {
                
                var sql = ''

                if(param == "link"){
                    sql = `SELECT count(provider_product_id) FROM providers_products 
                    WHERE provider_id=${providerId} AND hub_id=0 AND need_create=0 AND ignore_product=0 AND product_stock > 0 ${search}`
                }

                if(param == "create"){
                    sql = `SELECT count(provider_product_id) FROM providers_products 
                    WHERE provider_id=${providerId} AND hub_id=0 AND need_create=1 AND ignore_product=0 AND product_stock > 0 ${search}`
                }                

                Connect.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao conectar ao banco de dados'
                        })
                    } else {
                        if(resultado.length > 0){
                            var productsLength = JSON.stringify(resultado[0])
                            productsLength = productsLength.replace('{"count(provider_product_id)":', '')
                            productsLength = productsLength.replace('}', '')
                            resolve(parseInt(productsLength))
                        } else {
                            resolve(0)
                        }
                    }
                })
            })
        }
    }

    async handleProductsNotLinked({providerReference, hubId}: IIds, handleFunction: string, res: Response){
        console.log(handleFunction, providerReference, hubId)
        if(handleFunction == 'ignore'){
            if(providerReference > 0){
                ignoreDB(providerReference)
            } else {
                res.status(400).json({
                    code: 400,
                    message: 'o providerReference deve ser maior que 0'
                })
            }
        }

        if(handleFunction == 'needCreate'){
            if(providerReference > 0){
                needCreateDB(providerReference)
            } else {
                res.status(400).json({
                    code: 400,
                    message: 'o providerReference deve ser maior que 0'
                })
            }
        }
        
        if(handleFunction == 'link'){
            if(providerReference > 0 && hubId > 0){
                link(providerReference, hubId)
            } else {
                res.status(400).json({
                    code: 400,
                    message: 'o providerReference e o hubId deve ser maior que 0'
                })
            }
        }

        async function ignoreDB(providerReference: number): Promise<void>{
            const sql = `UPDATE providers_products SET ignore_product=1 WHERE product_reference=${providerReference}`

            Connect.query(sql, (erro, resultado: any) => {
                if (erro) {
                    console.log(erro)
                    res.status(400).json({
                        code: 400,
                        message: `erro ao alterar o ${providerReference} ao banco de dados`
                    })
                } else {
                    res.status(200).json({
                        code: 200,
                        message: `${providerReference} ignorado com sucesso`
                    })
                }
            })
        }

        async function needCreateDB(providerReference: number): Promise<void>{
            const sql = `UPDATE providers_products SET need_create=1 WHERE product_reference=${providerReference}`

            Connect.query(sql, (erro, resultado: any) => {
                if (erro) {
                    console.log(erro)
                    res.status(400).json({
                        code: 400,
                        message: `erro ao alterar o ${providerReference} ao banco de dados`
                    })
                } else {
                    res.status(200).json({
                        code: 200,
                        message: `${providerReference} incluído como não cadastrado ainda`
                    })
                }
            })
        }

        async function link(providerReference: number, hubId: number): Promise<void>{
            const sql = `UPDATE providers_products SET need_create=0, hub_id=${hubId} WHERE product_reference=${providerReference}`

            Connect.query(sql, (erro, resultado: any) => {
                if (erro) {
                    console.log(erro)
                    res.status(400).json({
                        code: 400,
                        message: `erro ao alterar o ${providerReference} ao banco de dados`
                    })
                } else {
                    res.status(200).json({
                        code: 200,
                        message: `${providerReference} vinculado ao Id ${hubId} com sucesso`
                    })
                }
            })
        }
    }

}

export default new Products