import { parseISO } from 'date-fns'
import fs from 'fs'

interface IProduct {
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

interface IConvertProducts {
  luperText(request: string): IResponseProducts;
  roddarText(file: string): IResponseProducts;
}

class ConvertProducts implements IConvertProducts {
  
  luperText(products: string){

    const textProducts = fs.readFileSync(`./src/files/${products}`, 'utf8').split('\n')

    const fillText: IProduct[] = [] 
    const lastUpdate = parseISO(textProducts[0])
    
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
    const lastUpdate = parseISO(textProducts[0])

    textProducts.map((row, i) => {

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

}
  
  export default new ConvertProducts;