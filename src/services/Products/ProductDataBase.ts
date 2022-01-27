import { MysqlError } from "mysql";
import Connect from "../../database/Connect";
import { IKitRulesInsert, IPricingInsert, IProductInsert } from "../../types/product";

interface IStore {
    tray_adm_user: string;
    store: string;
}

class Product {

    async insert(product: IProductInsert): Promise<number>{
        return new Promise((resolve, reject) => {

            const sqlProduct = {
                ean: product.ean,
                is_kit: product.is_kit,
                reference: product.reference,
                product_slug: product.product_slug,
                ncm: product.ncm,
                product_name: product.product_name,
                product_title: product.product_title,
                product_small_description: product.product_small_description,
                product_description: product.product_description,
                brand: product.brand,
                model: product.model,
                weight: product.weight,
                length: product.length,
                width: product.width,
                height: product.height,
                main_category_id: product.main_category_id,
                related_categories: product.related_categories.join(),
                available: product.available,
                availability: product.availability,
                availability_days: product.availability_days,
                warranty: product.warranty,
                release_date: product.release_date, 
                picture_source_1: product.picture_source_1,
                picture_source_1_90: product.picture_source_1_90,
                picture_source_2: product.picture_source_2,
                picture_source_2_90: product.picture_source_2_90,
                picture_source_3: product.picture_source_3,
                picture_source_3_90: product.picture_source_3_90,
                picture_source_4: product.picture_source_4,
                picture_source_4_90: product.picture_source_4_90,
                picture_source_5: product.picture_source_5,
                picture_source_5_90: product.picture_source_5_90,
                picture_source_6: product.picture_source_6,
                picture_source_6_90: product.picture_source_6_90,
                metatag: product.metatag,
                type: product.type,
                content: product.content,
                local: product.local,
                virtual_product: 0,
                creation_date: new Date(),
                comment: product.comment
            }
            
            removeUndefined(sqlProduct)

            const sql = `INSERT INTO produtos SET ?`

            Connect.query(sql, sqlProduct, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    reject(`erro ao salvar ${product.reference} - ${product.product_name}`)
                } else {
                    resolve(parseInt(resultado.insertId))
                }
            }) 

            function removeUndefined(obj: any){
                Object.keys(obj).forEach(key => {
                    if (obj[key] === undefined) {
                      delete obj[key];
                    }
                });
                return obj
            }
        })
    }

    async insertPricing(pricing: IPricingInsert, storeCredentials: IStore): Promise<number>{
        return new Promise((resolve, reject) => {

            const sql = `INSERT INTO tray_produtos SET ?`

            const values = {
                tray_adm_user: storeCredentials.tray_adm_user,
                tray_store_id: parseInt(storeCredentials.store),
                hub_id: pricing.hub_id,
                tray_product_id: pricing.tray_product_id,
                is_kit: pricing.is_kit,
                cost_price: pricing.cost_price,
                profit: pricing.profit,
                tray_price: pricing.tray_price,
                tray_promotional_price: pricing.tray_promotional_price,
                start_promotion: pricing.start_promotion,
                end_promotion: pricing.end_promotion,
                tray_stock: pricing.tray_stock,
                tray_main_category_id: pricing.tray_main_category_id,
                tray_related_categories: pricing.tray_related_categories.join(),
                modified: new Date(),
            }

            Connect.query(sql, values, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    reject(`Erro ao salvar o produto 
                    de hub_id ${pricing.hub_id} e tray_id ${pricing.tray_product_id} no banco de dados`)
                } else {
                    resolve(Math.floor(resultado.insertId))
                }
            })

        })
    }

    async insertKitRules(pricing: IKitRulesInsert): Promise<number>{
        return new Promise((resolve, reject) => {
            
            const sql = `INSERT INTO produtos_kits SET ?`
            
            const values = {
                tray_pricing_id: pricing.tray_pricing_id,
                tray_product_id: pricing.tray_product_id,
                hub_id: pricing.hub_id,
                tray_product_parent_id: pricing.tray_product_parent_id,
                kit_price: pricing.kit_price,
                quantity: pricing.quantity,
                price_rule: pricing.price_rule,
                discount_type: pricing.discount_value,
                discount_value: pricing.discount_value,
                creation_date: new Date()
            }

            Connect.query(sql, values, (erro, resultado) => {
                if (erro) {
                    console.log(erro)
                    reject(`Erro ao salvar o produto 
                    de hub_id ${pricing.hub_id} e tray_id ${pricing.tray_product_id} no banco de dados`)
                } else {
                    resolve(Math.floor(resultado.insertId))
                }
            })
        })
    }

}

export default new Product