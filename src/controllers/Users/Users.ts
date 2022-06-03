import { Request, Response } from 'express';
import Users from '../../models/Users/Users';
import Product from '../../services/Products/ProductDataBase'
import fs from 'fs';

type Products = {
  produto: string;
  reference: string;
  sizes: string | null;
  weight: number | null;
  volumes: string;
  totalPrice: string;
}

export default {
  
  async trayRequests(req: Request, res: Response) {
    
    Users.getCountRequestsTray(res)
  },

  async trayProductsAmount(req: Request, res: Response) {
    
    const { store_id } = req.query

    if(store_id){

      const products = await Users.getProductsAmount(parseInt(store_id as string))
      .then(response => {
        const products = response
        res.status(200).json({
          code: 200,
          products
        })
      })
      .catch(erro => {
        res.status(404).json({
          code: 404,
          message: erro
        })
      })
      
    } else {
      res.status(400).json({
        code: 400,
        message: 'está faltando o store_id como parametro'
      })
    }
  },

  async medida(req: Request, res: Response) {

    const txtProducts = fs.readFileSync(`./src/files/products.txt`, 'utf8').split('\n')

    const products: Products[] = []
    const eachWeight: any[] = []
    var totalWeight: number = 0

    txtProducts.map(product => {
      const name: string[] = []
      const splitted = product.split(' ') 
      var reference = ''
      var volumes = ''
      var totalPrice = ''

      splitted.map((letter, index) => {
        if(index <= 1){
          name.push(letter)
        }

        if(splitted[index+2] == 'UN'){
          reference = letter
        }
        
        if(letter == 'UN'){
          volumes = splitted[index+1]
        }

        if(index == (splitted.length-1)){
          totalPrice = letter.replace('\r', '')
        }

      })
    
      if(volumes == '0'){
        return
      } else {
        products.push({
          produto: name.join(' '),
          reference,
          sizes: null,
          weight: null,
          volumes: volumes,
          totalPrice: totalPrice
        })
      }

    })

    const finalProducts = await Promise.all(products.map(async(product) => {
      const { sizes, weight } = await getDimension(product.reference)
      eachWeight.push(weight*parseInt(product.volumes))
      return `${product.volumes}x ${product.produto} - ${sizes} ${weight}kg`
    }))
    .then(response => {
      return response
    })
    .catch(erro => {
      res.status(400).send(erro)
      return null
    })

    eachWeight.map(weight => {
      totalWeight = totalWeight + weight
    })

    if(!finalProducts){
      return 
    }

    res.json({
      finalProducts,
      eachWeight,
      totalWeight
    })

    async function getDimension(reference: string): Promise<{sizes: string, weight: number}>{
      return new Promise(async(resolve, reject) => {
        const product = await Product.getProduct({reference: reference}, true, false)
        .then(response => {
          const sizes = `${response.height}x${response.width}x${response.length}`
          
          resolve({
            sizes,
            weight: response.weight/1000
          })
        })
        .catch(erro => {
          reject(erro)
        })

      })
      
    }
  }

};