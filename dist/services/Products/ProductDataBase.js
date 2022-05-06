"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Connect_1 = __importDefault(require("../../database/Connect"));
class Product {
    // products
    async getProduct(id, onlyFirst, isKit) {
        return new Promise(async (resolve, reject) => {
            if (!id.hub_id && !id.reference) {
                reject('está faltando o hub_id ou reference para buscar no banco de dados');
                return;
            }
            const condition = `${id.hub_id ? 'hub_id' : 'reference'} = ${id.hub_id ? id.hub_id : id.reference}`;
            const isKitNumber = isKit == true ? 1 : 0;
            const isKitCondition = `${isKit != undefined ? `AND is_kit = ${isKitNumber}` : ''}`;
            const sql = `SELECT * FROM produtos WHERE ${condition} ${isKitCondition} ORDER BY hub_id ASC`;
            Connect_1.default.query(sql, (erro, resultado) => {
                if (erro) {
                    console.log(erro);
                    reject(`erro ao buscar detalhes do produto ${condition} ${isKitCondition} no banco de dados`);
                }
                else {
                    if (resultado.length == 0) {
                        reject(`nenhum detalhe do produto foi encontrado com ${condition}`);
                    }
                    else {
                        if (onlyFirst == true || onlyFirst == undefined) {
                            resolve(Object.assign(Object.assign({}, resultado[0]), { related_categories: resultado[0].related_categories ? resultado[0].related_categories.split(',').map((str) => { return parseInt(str); }) : [] }));
                        }
                        else {
                            const result = resultado.map((result) => {
                                return Object.assign(Object.assign({}, result), { related_categories: result.related_categories ? result.related_categories.split(',').map((str) => { return parseInt(str); }) : [] });
                            });
                            resolve(resultado);
                        }
                    }
                }
            });
        });
    }
    async insert(product) {
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
            };
            removeUndefined(sqlProduct);
            const sql = `INSERT INTO produtos SET ?`;
            Connect_1.default.query(sql, sqlProduct, (erro, resultado) => {
                if (erro) {
                    console.log(erro);
                    reject(`erro ao salvar ${product.reference} - ${product.product_name}`);
                }
                else {
                    resolve(parseInt(resultado.insertId));
                }
            });
            function removeUndefined(obj) {
                Object.keys(obj).forEach(key => {
                    if (obj[key] === undefined) {
                        delete obj[key];
                    }
                });
                return obj;
            }
        });
    }
    async updateProduct(product, condition) {
        return new Promise(async (resolve, reject) => {
            var _a;
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
                related_categories: (_a = product.related_categories) === null || _a === void 0 ? void 0 : _a.join(),
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
                picture_source_5: product.picture_source_5_90,
                picture_source_5_90: product.picture_source_5_90,
                picture_source_6: product.picture_source_6_90,
                picture_source_6_90: product.picture_source_6_90,
                metatag: product.metatag,
                type: product.type,
                content: product.content,
                local: product.local,
                virtual_product: product.virtual_product,
                comments: product.comments,
                modified: new Date(),
            };
            this.removeUndefined(sqlProduct);
            const where = `WHERE hub_id=${product.hub_id}${condition ? ' and ' : ''}${condition ? condition : ''}`;
            const sql = `UPDATE produtos SET ? ${where}`;
            Connect_1.default.query(sql, sqlProduct, (erro, resultado) => {
                if (erro) {
                    console.log(erro);
                    reject(`erro ao atualizar ${product.reference} - ${product.product_name} no banco de dados`);
                }
                else {
                    if (resultado.affectedRows > 0) {
                        resolve();
                    }
                    else {
                        reject('nenhuma linha foi econtrada com essas condições');
                    }
                }
            });
        });
    }
    async deleteProduct(condition) {
        return new Promise(async (resolve, reject) => {
            const sql = `DELETE produtos WHERE ${condition}`;
            Connect_1.default.query(sql, (erro, resultado) => {
                if (erro) {
                    console.log(erro);
                    reject(`erro ao excluir no banco de dados com a condição: ${condition}`);
                }
                else {
                    if (resultado.affectedRows > 0) {
                        resolve();
                    }
                    else {
                        reject('nenhuma linha foi econtrada com essas condições');
                    }
                }
            });
        });
    }
    // pricing
    async getPricing(id, onlyFirst, storeId) {
        return new Promise(async (resolve, reject) => {
            if (!id.hub_id && !id.tray_pricing_id) {
                reject('está faltando o hub_id ou tray_pricing_id para buscar no banco de dados');
                return;
            }
            const condition = `${id.tray_pricing_id ? 'tray_pricing_id' : 'hub_id'} = ${id.tray_pricing_id ? id.tray_pricing_id : id.hub_id}`;
            const storeCondition = `${storeId ? 'and tray_store_id = ' : ''}${storeId ? storeId : ''}`;
            const sql = `SELECT * FROM tray_produtos WHERE ${condition} ${storeCondition} ORDER BY tray_pricing_id ASC`;
            Connect_1.default.query(sql, (erro, resultado) => {
                if (erro) {
                    console.log(erro);
                    reject(`erro ao buscar a precificação do produto com ${condition} no banco de dados`);
                }
                else {
                    if (resultado.length == 0) {
                        reject(`nenhuma precificação do produto foi encontrado com ${condition}`);
                    }
                    else {
                        if (id.tray_pricing_id || onlyFirst == true || onlyFirst == undefined) {
                            resolve(resultado[0]);
                        }
                        else {
                            resolve(resultado);
                        }
                    }
                }
            });
        });
    }
    async insertPricing(pricing, storeCredentials) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO tray_produtos SET ?`;
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
            };
            Connect_1.default.query(sql, values, (erro, resultado) => {
                if (erro) {
                    console.log(erro);
                    reject(`Erro ao salvar o produto 
                    de hub_id ${pricing.hub_id} e tray_id ${pricing.tray_product_id} no banco de dados`);
                }
                else {
                    resolve(Math.floor(resultado.insertId));
                }
            });
        });
    }
    async updatePricing(pricing, condition) {
        return new Promise(async (resolve, reject) => {
            var _a;
            const sqlProduct = {
                tray_adm_user: pricing.tray_adm_user,
                tray_store_id: pricing.tray_store_id,
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
                tray_minimum_stock: pricing.tray_minimum_stock,
                tray_main_category_id: pricing.tray_main_category_id,
                tray_related_categories: (_a = pricing.tray_related_categories) === null || _a === void 0 ? void 0 : _a.join(','),
            };
            this.removeUndefined(sqlProduct);
            const sql = `UPDATE tray_produtos SET ? WHERE ${condition}`;
            Connect_1.default.query(sql, sqlProduct, (erro, resultado) => {
                if (erro) {
                    console.log(erro);
                    reject(`erro ao atualizar no banco de dados hubId ${pricing.hub_id} com a condição: ${condition}`);
                }
                else {
                    if (resultado.affectedRows > 0) {
                        resolve();
                    }
                    else {
                        reject('nenhuma linha foi econtrada com essas condições');
                    }
                }
            });
        });
    }
    async deletePricing(condition) {
        return new Promise(async (resolve, reject) => {
            const sql = `DELETE tray_produtos WHERE ${condition}`;
            Connect_1.default.query(sql, (erro, resultado) => {
                if (erro) {
                    console.log(erro);
                    reject(`erro ao excluir no banco de dados com a condição: ${condition}`);
                }
                else {
                    if (resultado.affectedRows > 0) {
                        resolve();
                    }
                    else {
                        reject('nenhuma linha foi econtrada com essas condições');
                    }
                }
            });
        });
    }
    // rules
    async getKitRules(id, onlyFirst) {
        return new Promise(async (resolve, reject) => {
            if (!id.hub_id && !id.tray_pricing_id) {
                reject('está faltando o hub_id ou tray_pricing_id para buscar no banco de dados');
                return;
            }
            const condition = `${id.hub_rules_id ? 'tray_rules_id' : id.tray_pricing_id ? 'tray_pricing_id' : 'hub_id'} =
            ${id.hub_rules_id ? id.hub_rules_id : id.tray_pricing_id ? id.tray_pricing_id : id.hub_id}`;
            const sql = `SELECT * FROM produtos_kits WHERE ${condition} ORDER BY hub_rules_id ASC`;
            Connect_1.default.query(sql, (erro, resultado) => {
                if (erro) {
                    console.log(erro);
                    reject(`erro ao buscar a precificação do produto com ${condition} no banco de dados`);
                }
                else {
                    if (resultado.length == 0) {
                        reject(`nenhuma precificação do produto foi encontrado com ${condition}`);
                    }
                    else {
                        if (id.tray_pricing_id || onlyFirst == true || onlyFirst == undefined) {
                            resolve(resultado[0]);
                        }
                        else {
                            resolve(resultado);
                        }
                    }
                }
            });
        });
    }
    async insertKitRules(pricing) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO produtos_kits SET ?`;
            const values = {
                tray_pricing_id: pricing.tray_pricing_id,
                tray_product_id: pricing.tray_product_id,
                hub_id: pricing.hub_id,
                tray_product_parent_id: pricing.tray_product_parent_id,
                kit_price: pricing.kit_price,
                quantity: pricing.quantity,
                price_rule: pricing.price_rule,
                discount_type: pricing.discount_type,
                discount_value: pricing.discount_value,
                creation_date: new Date()
            };
            Connect_1.default.query(sql, values, (erro, resultado) => {
                if (erro) {
                    console.log(erro);
                    reject(`Erro ao salvar o produto 
                    de hub_id ${pricing.hub_id} e tray_id ${pricing.tray_product_id} no banco de dados`);
                }
                else {
                    resolve(Math.floor(resultado.insertId));
                }
            });
        });
    }
    async updateKitRules(kitRules, condition) {
        return new Promise(async (resolve, reject) => {
            const sqlProduct = {
                tray_rule_id: kitRules.tray_rule_id,
                tray_pricing_id: kitRules.tray_pricing_id,
                tray_product_id: kitRules.tray_product_id,
                hub_id: kitRules.hub_id,
                tray_product_parent_id: kitRules.tray_product_parent_id,
                kit_price: kitRules.kit_price,
                quantity: kitRules.quantity,
                price_rule: kitRules.price_rule,
                discount_type: kitRules.discount_type,
                discount_value: kitRules.discount_value,
                modified: new Date()
            };
            this.removeUndefined(sqlProduct);
            const sql = `UPDATE produtos_kits SET ? WHERE ${condition}`;
            Connect_1.default.query(sql, sqlProduct, (erro, resultado) => {
                if (erro) {
                    console.log(erro);
                    reject(`erro ao atualizar no banco de dados hubId ${kitRules === null || kitRules === void 0 ? void 0 : kitRules.hub_id} com a condição: ${condition}`);
                }
                else {
                    if (resultado.affectedRows > 0) {
                        resolve();
                    }
                    else {
                        reject('nenhuma linha foi econtrada com essas condições');
                    }
                }
            });
        });
    }
    async deleteKitRules(condition) {
        return new Promise(async (resolve, reject) => {
            const sql = `DELETE produtos_kits WHERE ${condition}`;
            Connect_1.default.query(sql, (erro, resultado) => {
                if (erro) {
                    console.log(erro);
                    reject(`erro ao excluir no banco de dados com a condição: ${condition}`);
                }
                else {
                    if (resultado.affectedRows > 0) {
                        resolve();
                    }
                    else {
                        reject('nenhuma linha foi econtrada com essas condições');
                    }
                }
            });
        });
    }
    removeUndefined(obj) {
        Object.keys(obj).forEach(key => {
            if (obj[key] === undefined) {
                delete obj[key];
            }
        });
        return obj;
    }
}
exports.default = new Product;
