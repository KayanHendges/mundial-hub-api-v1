import Connect from "../../database/Connect"

interface IResponse {
    success: boolean
}

interface IUpdateProduct {
    productId: number;
    productName: string;
    brand: string;
    stock: number;
}

interface ISaveProducts {
    saveProductsDB(products: IUpdateProduct[], providerId: number): object
}

class SaveProducts implements ISaveProducts {
    async saveProductsDB(products: IUpdateProduct[] | any[], providerId: number) {

        
        const response = await productLoop(products, 0, providerId)

        return response.success

        async function productLoop(products: IUpdateProduct[], index: number, providerId: number): Promise<IResponse>{
            return new Promise(async(resolve) => {
                
                const updateProduct = await update(products[index], providerId)
                console.log(updateProduct)

                if(!updateProduct.success){
                    const createProduct = await create(products[index], providerId)

                    if(createProduct.success){
                        if(products.length > index+1){
                            resolve(productLoop(products, index+1, providerId))
                        } else {
                            resolve({success: true})
                        }

                    } else {
                        resolve({success: false})
                    }

                } else {
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
                    product_stock: product.stock
                }

                const sql = `UPDATE providers_products SET ? WHERE product_reference=${product.productId} AND provider_id=${providerId}`

                Connect.query(sql, productDB, (erro, resultado) => {
                    if(erro){
                        console.log(erro)
                    } else {
                        console.log(product.productId, "atualiazados", resultado.affectedRows)
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
                    product_reference: product.productId,
                    product_name: product.productName,
                    product_brand: product.brand,
                    product_stock: product.stock
                }

                const sql = `INSERT INTO providers_products SET ?`

                Connect.query(sql, productDB, (erro, resultado) => {
                    if(erro){
                        console.log(erro)
                    } else {
                        console.log(product.productId, "inserido no banco de dados")
                        resolve({success: true})
                    }
                })                
            })
        }
    }

}

export default SaveProducts