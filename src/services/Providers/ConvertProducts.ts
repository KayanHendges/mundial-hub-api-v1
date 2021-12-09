import fs from 'fs'

interface IConvertProducts {
  luperText(request: string): object;
}

class ConvertProducts implements IConvertProducts {
  
  luperText(products: string){

    const textProducts = fs.readFileSync(`./src/files/${products}`, 'utf8').split('\n')

    const fillText: any[] = [] 
    
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
          stock: stock
        })
      }
    })


    return {
      products: fillText
    }
  }

}
  
  export default ConvertProducts;