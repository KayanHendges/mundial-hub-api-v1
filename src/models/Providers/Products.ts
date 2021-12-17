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

interface IProviderProducts {
    getProductsNotLinked(providerId: number, param: string, search: string, res: Response): Promise<void>;
    handleProductsNotLinked(ids: IIds, handleFunction: string, res: Response): Promise<void>;
}

class Products implements IProviderProducts {
    
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
                    WHERE provider_id=${providerId} AND hub_id=0 AND ignore_product=0 AND need_create=0  ${search}
                    ORDER BY product_name ASC LIMIT 0,10`
                }

                if(param == 'create'){
                    sql = `SELECT product_reference, product_name FROM providers_products 
                    WHERE provider_id=${providerId} AND hub_id=0 AND ignore_product=0 AND need_create=1 ${search}
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
                    WHERE provider_id=${providerId} AND hub_id=0 AND need_create=0 AND ignore_product=0 ${search}`
                }

                if(param == "create"){
                    sql = `SELECT count(provider_product_id) FROM providers_products 
                    WHERE provider_id=${providerId} AND hub_id=0 AND need_create=1 AND ignore_product=0 ${search}`
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