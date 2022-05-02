import convert from 'xml-js'
import fs from 'fs';
import Connect from '../../database/Connect';
import { format } from 'date-fns';
import titleize from '../../services/titleize';

class Google {

    async xml(): Promise<string>{

        const errorProducts = fs.readFileSync(`./src/files/google-errors-products.txt`, 'utf8',)

        const products = await getProducts(errorProducts)
        .catch( err => { throw new Error(err) } )
        
        const rssStart = '<rss xmlns:g="http://base.google.com/ns/1.0" xmlns:c="http://base.google.com/cns/1.0" version="2.0">'
        const rssEnd = '</rss>'

        const googleProducts = products.map((product, index) => {

            return {
                "g:id": product.tray_product_id,
                "title": titleize(product.product_name),
                "link": `https://www.santacruzpneus.com.br/loja/produto.php?IdProd=${product.tray_product_id}`,
                "g:price": hasPromotionToPrice(product),
                "g:shipping_weight": `${product.weight/1000} kg`,
                "description": titleize(product.product_name),
                "g:brand": product.brand,
                "g:google_product_category": {},
                "g:image_link": product.picture_source_1,
                "g:product_type": 'Pneus',
                "g:availability": `${product.tray_stock > 0? 'in stock' : 'out of stock'}`,
                "g:sale_price": hasPromotionToPromotionalPrice(product),
                "g:sale_price_effective_date": `${date(product.start_promotion)}/${date(product.end_promotion)}`,
                "g:mpn": product.reference,
                // "g:installment": {
                //     "g:months": '12',
                //     "g:amount": 'R$ 106,47'
                // },
                "g:condition": 'new'
            }
        })

        const json = {
            channel: {
                title: 'Santa Cruz Pneus',
                link: 'https://www.santacruzpneus.com.br',
                description: 'Integração Shopping Google',
                item: googleProducts
                // {
                //     "g:id": '15171',
                //     "title": 'PNEU 235/50R19 RANGETOUR SU027 HT 99V WANLI',
                //     "link": 'https://www.santacruzpneus.com.br/pneus/pneu-23550r19-rangetour-su027-ht-99v-wanli?parceiro=7461',
                //     "g:price": 'R$ 1.031,37',
                //     "g:shipping_weight": '21 kg',
                //     "description": 'Pneu 235/50r19 Rangetour Su027 Ht 99v Wanli wanli',
                //     "g:brand": 'Wanli',
                //     "g:google_product_category": {},
                //     "g:image_link": 'https://images.tcdn.com.br/img/img_prod/1049898/pneu_235_50r19_rangetour_su027_ht_99v_wanli_15171_1_4b0407332d5fbbbc450fd0e297da1736.jpg',
                //     "g:product_type": 'Pneus',
                //     "g:availability": 'in stock',
                //     "g:sale_price": 'R$ 928,23',
                //     "g:sale_price_effective_date": '2021-12-20T00:00-03:00/2022-12-31T23:59-03:00',
                //     "g:mpn": '6607',
                //     "g:installment": {
                //         "g:months": '12',
                //         "g:amount": 'R$ 106,47'
                //     },
                //     "g:condition": 'new'
                // }
            }
        }

        const xml = convert.js2xml(json, {
            compact: true,
        })

        return rssStart + xml + rssEnd

        async function getProducts(errorProducts: string): Promise<any[]>{
            return new Promise((resolve, reject) => {
                const sql = `SELECT *
                FROM produtos p JOIN tray_produtos tp ON p.hub_id=tp.hub_id
                WHERE p.is_kit = 0 AND tp.tray_store_id = 1049898 AND tray_product_id NOT IN (${errorProducts})
                AND p.ean NOT LIKE '' AND p.ean NOT NULL`
                
                Connect.query(sql, (err, result) => {
    
                    if(err){
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
                
            })

        }

        function date(date: string | Date){

            if(date == '0000-00-00 00:00:00'){
                return ''
            }

            if(typeof date == 'string'){
                return date
            }

            return format(date, 'yyyy-MM-dd hh:mm:ss').replace(' ', 'T')
            
        }

        function hasPromotionToPrice(product: any){

            if(product.tray_promotional_price > 0){
                return `R$ ${product.tray_price.toFixed(2)}`
            }

            if(product.tray_promotional_price == 0 || product.tray_promotional_price == null){
                return `R$ ${(product.tray_price *0.9).toFixed(2)}`
            }

        }

        function hasPromotionToPromotionalPrice(product: any){

            if(product.tray_promotional_price > 0){
                return `R$ ${(product.tray_promotional_price*0.9).toFixed(2)}`
            }

            if(product.tray_promotional_price == 0 || product.tray_promotional_price == null){
                return ``
            }

        }
    }

}

export default new Google