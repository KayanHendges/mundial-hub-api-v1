import { getTime } from "date-fns"
import { Request, Response } from "express"
import Connect from "../database/Connect"
import Product from "../services/Products/ProductDataBase"
import sleep from "../services/sleep"
import titleize from "../services/titleize"
import TrayProducts from "../services/Tray/TrayProducts"
import OAuth2Tray from "./Auth/OAuth2Tray"


class Temp {

    async Temp(req: Request, res: Response){    

        const { store_code } = req.query
        const storeCode = parseInt(store_code as string)
        
        if(isNaN(storeCode)){
            res.status(401).json({ message: 'missing store code' })
        }

        const products = await getProducts(storeCode)

        const newProducts = products.map( product => {

            var name = product.product_name.toLowerCase()
            
            name.replaceAll('agrícola', '')
            name.replaceAll('empilhadeira', '')
            name.replaceAll('retroescavadeira', '')
            name.replaceAll('tobata', '')
            name.replaceAll('trator', '')
            name.replaceAll('moto', '')

            var construcaoRadial = ''

            name.split(' ').map( (word, index) => {
                
                word.split('').map((crt, i) => {

                    if(index = 1){
                        if(crt == 'r'){
                            construcaoRadial = 'radial'
                        }
                    }

                })   
            })

            const description = `${titleize(product.product_name)}

            Modelo: ${product.model}
            Marca: ${product.model}
            ${construcaoRadial.length > 0? 'Construção: ': ''}${construcaoRadial.length > 0? construcaoRadial: ''}
            
            Dimensões
            
            Comprimento: ${product.length}
            Altura: ${product.height}
            Largura: ${product.width}
            
            Peso: ${product.weight}
            garantia: 5 anos de garantia
            `

            return {...product, product_description: description.replaceAll("\n", "</br>")}
        })

        for(const i in newProducts){
            console.log('nova operação')
            const index = parseInt(i)
            const product = newProducts[index]
            const description = product.product_description as string

            const start = getTime(new Date())

            const storeCredentials = await OAuth2Tray.getStoreCredentials(storeCode)

            await Product.updateProduct({ hub_id: product.hub_id, product_description: description })
            .catch( err => { throw new Error(err) } )

            if(product.tray_product_id > 0){
                await TrayProducts.updateProduct(
                    storeCredentials,
                    { product_description: description, is_kit: 0 },
                    product.tray_product_id
                )
                .catch( err => { throw new Error(err) } )    
            }

            const end = getTime(new Date())
            const executionTime = end - start
            const timeRemaining = executionTime < 340? 340 - executionTime : 0

            console.log(`${index+1}/${products.length} - product ${product.hub_id} - levou ${executionTime}ms e esperará ${timeRemaining} `)

            await sleep(timeRemaining)

            console.log('esperou, fim da operação')
        }
        
        
        res.send(newProducts)

        function getProducts(storeCode: number): Promise<any[]>{
            return new Promise(async(resolve) => {

                const sql = `SELECT p.hub_id, p.product_name, p.product_description, p.brand, p.model, tp.tray_product_id,
                p.weight, p.width, p.length, p.height
                FROM produtos p JOIN tray_produtos tp ON p.hub_id = tp.hub_id 
                WHERE tp.tray_store_id = ${storeCode} and p.is_kit = 0`
    
                Connect.query(sql, (err, res) => {
                    if(err){
                        console.log(err)
                    } else {
                        resolve(res)
                    }
                })
            })

        }
    }

}

export default new Temp