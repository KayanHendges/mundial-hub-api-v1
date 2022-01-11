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

interface IProviderProductDetails {
    providerReference: number;
    productName: string;
    hubId: number;
}

interface IProvidersStock {
    providerName: string;
    providerId: number;
    stock: number;
    cost: number;
    additionalCost: string;
    totalCost: number;
}

interface IProviderProductToList {
    providerName: string;
    providerId: number;
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
    lastUpdate?: string;
}

interface IQuery {
    search: string;
    collum: string;
    order: string;
}

interface IProviderProducts {
    getProductsNotLinked(providerId: number, param: string, search: string, res: Response): Promise<void>;
    listProvidersByHubId(hubId: number, res: Response): Promise<void>;
    handleProductsNotLinked(ids: IIds, handleFunction: string, res: Response): Promise<void>;
    listByProviders(providerId: number, query: IQuery, res: Response): void;
    editProviderProduct(providerId: number, productId: number, field: string, value: string | number, res: Response): void;
    getProviderProductByRef(providerId: number, productId: number, res: Response): void;
}

class Products implements IProviderProducts {
    
    async listByProviders(providerId: number, query: IQuery, res: Response){

        const searchQuery = getSearchQuery(query.search)
        const collum = query.collum != undefined ? getCollum(query.collum) : 'p.reference'
        const order = query.order != undefined ? getOrder(query.order) : 'desc' 

        const params = {
            search: searchQuery,
            collum: collum,
            order: order
        }

        const products = await getProducts(providerId, params)

        res.status(200).json({
            code: 200,
            products: products.products,
            count: await getCount(providerId, searchQuery),
            lastUpdate: products.lastUpdate
        })
        
        async function getProducts(providerId: number, params: IQuery): Promise<IProviderProductsList>{
            return new Promise(resolve => {

                const sql = `SELECT pv.provider_id, pv.provider_name, pp.product_reference, p.reference, p.product_name, pp.product_stock, pp.product_price, pv.standart_costs, pv.cost_type, pp.last_update
                FROM produtos p JOIN providers_products pp ON p.hub_id = pp.hub_id JOIN providers pv on pv.provider_id = pp.provider_id
                WHERE pp.provider_id = ${providerId} ${searchQuery}
                ORDER BY ${params.collum} ${params.order}
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
                                    providerId: product.provider_id,
                                    providerName: product.provider_name,
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

        function getCollum(collum: string){
            
            if(collum == 'stock'){
                return 'pp.product_stock'
            }

            if(collum == 'provider_cost'){
                return 'pp.product_price'
            }

            if(collum == 'name'){
                return 'p.product_name'
            }

            if(collum == 'reference'){
                return 'p.reference'
            }

            return 'p.reference'

        }

        function getOrder(collum: string){
            
            if(collum == 'asc'){
                return collum
            }

            if(collum == 'desc'){
                return collum
            }

            return 'desc'

        }
    }

    async listProvidersByHubId(hubId: number, res: Response){

        const providers = await getProviders(hubId)

        res.status(200).json({
            code: 200,
            providers: providers
        })

        async function getProviders(hubId: number): Promise<IProvidersStock[]>{
            return new Promise(resolve => {

                const sql = `SELECT pv.provider_id, pv.provider_name, pv.standart_costs, pv.cost_type, pp.product_stock, pp.product_price
                FROM providers_products pp JOIN providers pv ON pp.provider_id=pv.provider_id
                WHERE pp.hub_id=${hubId} AND pp.product_stock > 0
                ORDER BY pp.product_stock DESC, pp.product_price ASC` 

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
                                    providerId: product.provider_id,
                                    providerName: product.provider_name,
                                    stock: product.product_stock,
                                    cost: product.product_price,
                                    additionalCost: getAdditionalCost(product.standart_costs, product.cost_type),
                                    totalCost: calcTotalCost(product.product_price, product.standart_costs, product.cost_type)
                                }
                            })

                            resolve(products)
                        } else {
                            resolve([])
                        }
                    }
                })                
            })
        }

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

    async getProviderProductByRef(providerId: number, productId: number, res: Response){

        const product = await getProduct(providerId, productId)
        
        res.status(200).json({
            code: 200,
            product: product
        })

        async function getProduct(providerId: number, productId: number): Promise<IProviderProductDetails>{
            return new Promise(resolve => {
                
                const sql = `SELECT product_reference, product_name, hub_id
                FROM providers_products WHERE provider_id=${providerId} AND product_reference=${productId}`

                Connect.query(sql, (erro, resultado: any[]) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao conectar ao banco de dados'
                        })
                    } else {
                        if(resultado.length > 0){
                            resolve({
                                providerReference: resultado[0].product_reference,
                                productName: resultado[0].product_name,
                                hubId: resultado[0].hub_id
                            })
                        } else {
                            res.status(404).json({
                                code: 404,
                                message: 'nenhum produto encontrado com esse id'
                            })
                        }
                    }
                })
            })
        }
    }

    async editProviderProduct(providerId: number, productId: number, field: string, value: string | number, res: Response){

        await updateDB(providerId, productId, field, value)

        res.status(200).json({
            code: 200,
            message: 'produto alterado com sucesso'
        })

        async function updateDB(providerId: number, productId: number, field: string, value: string | number): Promise<void>{
            return new Promise(resolve => {

                const values = {
                    last_update: new Date()
                }

                const sql = `UPDATE providers_products 
                SET ${field} = ${value}, ?
                WHERE provider_id = ${providerId} AND product_reference = ${productId}`

                Connect.query(sql, values, (erro, resultado) => {
                    if (erro) {
                        console.log(erro)
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao atualizar no banco de dados'
                        })
                    } else {
                        if(resultado.affectedRows > 0){
                            resolve()
                        } else {
                            console.log(erro)
                            res.status(404).json({
                                code: 404,
                                message: 'nenhum produto encontrado com esse id'
                            })
                        }
                    }
                })
            })
        }

    }
}

export default new Products