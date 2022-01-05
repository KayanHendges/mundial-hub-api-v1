import { parseISO } from 'date-fns'
import fs from 'fs'
import Connect from '../../database/Connect'

interface IProduct {
  productId: number;
  productName: string;
  brand: string;
  stock: number;
  price: number;
  additionalCosts: number;
  lastUpdate: Date;
}

interface IProductLocal {
  hubId: number;
  productId: number;
  productName: string;
  brand: string;
  stock: number;
  price: number;
  additionalCosts: number;
  lastUpdate: Date;
}

interface IResponseProducts {
  products: IProduct[]
}

interface IResponseProductsLocal {
  products: IProductLocal[]
}

interface IConvertProducts {
  localStock(): Promise<IResponseProductsLocal>; 
  luperText(request: string): IResponseProducts;
  roddarText(file: string): IResponseProducts;
  roddarImportsText(file: string): IResponseProducts;
}

class ConvertProducts implements IConvertProducts {

  async localStock(): Promise<IResponseProductsLocal>{

    const products = await getAllProducts()

    return {
      products: products
    }

    async function getAllProducts(): Promise<IProductLocal[]>{
      return new Promise(resolve => {
        
        const sql = `SELECT p.hub_id, p.reference, p.product_name, p.brand, t.cost_price
        FROM produtos p JOIN tray_produtos t ON p.hub_id=t.hub_id WHERE p.is_kit=0 AND t.tray_store_id = 668385 AND p.hub_id != 3838`

        Connect.query(sql, (erro, resultado: any[]) => {
          if (erro) {
            console.log(erro)
          } else {
            if (resultado.length > 0) {
              const lastUpdate = new Date()

              const products = resultado.map(product => {
                return {
                  hubId: product.hub_id,
                  productId: product.reference,
                  productName: product.product_name,
                  brand: product.brand,
                  stock: 0,
                  price: product.cost_price,
                  additionalCosts: 0,
                  lastUpdate: lastUpdate,
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

  }
  
  luperText(products: string){

    const textProducts = fs.readFileSync(`./src/files/${products}`, 'utf8').split('\n')

    const fillText: IProduct[] = [] 
    const lastUpdate = parseISO(textProducts[0].replace('\r', ''))
    
    textProducts.map(line => {
      if(line.includes('PNEU') && line.length > 50){
        const splittedLine = line.split(" ")
        const productId = parseInt(splittedLine[0])
        const stock = parseInt(splittedLine[splittedLine.length-1].replace("\r", ''))

        var productName = splittedLine
        productName.splice(0, 1)
        productName.splice(productName.length-1, 1)
        const brand = productName[productName.length-1]

        fillText.push({
          productId: productId,
          productName: productName.join(' '),
          brand: brand,
          stock: stock,
          price: 0,
          additionalCosts: 0,
          lastUpdate: lastUpdate
        })
      }
    })


    return {
      products: fillText
    }
  }

  roddarText(file: string){

    const textProducts = fs.readFileSync(`./src/files/${file}`, 'utf8').split('\n')

    const fillText: IProduct[] = [] 
    const lastUpdate = parseISO(textProducts[0].replace('\r', ''))

    textProducts.map((row, index) => {

      if(row.length > 60){
        const words = row.split(' ')

        const productName: string[] = []

        var startPriceIndex = false
        var price = 0

        words.map((word, i) => {
          if(word == 'R$' && !startPriceIndex){
            startPriceIndex = true
            price = parseFloat((words[i+1].replace('.', '').replace(',', '.')))
          }

          if(i > 0 && !startPriceIndex && (words[i+2] != 'R$' && words[i+1] != 'R$')){
            productName.push(word)
          }

          if(word == "RUNFT\r"){
            const runflat = word.replace('\r', '')
            productName.splice(0, 0, runflat)
          }

          if(word == "RUNFT"){
            productName.splice(0, 0, word)
          }
        })
  
        fillText.push({
          productId: parseInt(words[0]),
          productName: productName.join(' '),
          brand: words[4],
          stock: 4,
          price: price,
          additionalCosts: 0,
          lastUpdate: lastUpdate
        })
      }
    })

    
    fillText.map(product => {
      if(typeof(product.productId) != "number" && product.price < 250){
        console.log(product)
      }
    })

    return {
      products: fillText
    }

  }

  roddarImportsText(file: string){

    const textProducts = fs.readFileSync(`./src/files/${file}`, 'utf8').split('\n')

    const fillText: IProduct[] = [] 
    const lastUpdate = parseISO(textProducts[0].replace('\r', ''))

    textProducts.map((row, index) => {

      if(row.length > 35){
        const words = row.split(' ')

        const productName: string[] = []

        var startPrice = false
        var price = 0

        words.map((word, i) => {

          const crts = word.split('')

          crts.map(crt => {
            if(crt == ','){
              startPrice = true
              price = parseFloat(word.replace(',', '.'))
            }
          })

          if(i > 0 && !startPrice){
            productName.push(word)
          }
        })
  
        fillText.push({
          productId: parseInt(words[0]),
          productName: productName.join(' '),
          brand: words[4],
          stock: 4,
          price: price,
          additionalCosts: 0,
          lastUpdate: lastUpdate
        })
      }
    })

    
    fillText.map(product => {
      if(typeof(product.productId) != "number" && product.price < 250){
        console.log(product)
      }
    })

    return {
      products: fillText
    }

  }

}
  
  export default new ConvertProducts;