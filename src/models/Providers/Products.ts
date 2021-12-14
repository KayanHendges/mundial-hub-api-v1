import { Response } from "express"
import Connect from "../../database/Connect"

interface IProviderProduct {
    providerReference: number;
    providerName: string;
}

interface IProviderProducts {
    getProductsNotLinked(providerId: number, res: Response): Promise<void>
}

class Products implements IProviderProducts {
    
    async getProductsNotLinked(providerId: number, res: Response){

        const products = await getProvidersProducts(providerId)
        const count = await getCount(providerId)

        res.status(200).json({
            code: 200,
            products: products,
            count: count
        })
        
        async function getProvidersProducts(providerId: number): Promise<IProviderProduct[]>{
            return new Promise(resolve => {
                const sql = `SELECT product_reference, product_name FROM providers_products WHERE provider_id=${providerId} AND hub_id IS NULL LIMIT 0,10`

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

        async function getCount(providerId: number): Promise<number>{
            return new Promise(resolve => {
                const sql = `SELECT count(provider_product_id) FROM providers_products WHERE provider_id=${providerId} AND hub_id IS NULL LIMIT 0,10`
    
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

}

export default new Products