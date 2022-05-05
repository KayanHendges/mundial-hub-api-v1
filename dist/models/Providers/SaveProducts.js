"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Connect_1 = __importDefault(require("../../database/Connect"));
class SaveProducts {
    async saveProductsDB(products, providerId, res) {
        const zeroStock = await setZeroStock(providerId);
        const standartCosts = await getStandartCost(providerId);
        if (zeroStock && standartCosts) {
            console.log('Estoques zerados');
            // const lastUpdate = new Date()
            const response = await productLoop(products, 0, providerId);
            console.log('fim da operação');
            if (response.success) {
                res.status(200).json({
                    code: 200,
                    message: 'produtos atualizados com sucesso',
                    products: products
                });
            }
            else {
                res.status(400).json({
                    code: 400,
                    message: 'houve algum erro no processo de atualização do banco de dados',
                    products: products
                });
            }
        }
        else {
            res.status(400).json({
                code: 400,
                message: 'erro ao salvar no banco de dados devido a funções anteriores'
            });
        }
        async function productLoop(products, index, providerId) {
            return new Promise(async (resolve) => {
                console.log(products[index]);
                const updateProduct = await update(products[index], providerId);
                if (!updateProduct.success) {
                    const createProduct = await create(products[index], providerId);
                    if (createProduct.success) {
                        console.log(index + 1, " / ", products.length, ' - inserido com sucesso');
                        if (products.length > index + 1) {
                            resolve(productLoop(products, index + 1, providerId));
                        }
                        else {
                            resolve({ success: true });
                        }
                    }
                    else {
                        resolve({ success: false });
                    }
                }
                else {
                    console.log(index + 1, " / ", products.length, ' - update com sucesso');
                    if (products.length > index + 1) {
                        resolve(productLoop(products, index + 1, providerId));
                    }
                    else {
                        resolve({ success: true });
                    }
                }
            });
        }
        async function update(product, providerId) {
            return new Promise(resolve => {
                const productDB = {
                    product_name: product.productName,
                    product_brand: product.brand,
                    product_stock: product.stock,
                    product_price: product.price,
                    additional_costs: product.additionalCosts,
                    last_update: product.lastUpdate
                };
                const sql = `UPDATE providers_products SET ? WHERE product_reference=${product.productId} AND provider_id=${providerId}`;
                Connect_1.default.query(sql, productDB, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao salvar no banco de dados'
                        });
                    }
                    else {
                        if (resultado.affectedRows > 0) {
                            resolve({ success: true });
                        }
                        else {
                            resolve({ success: false });
                        }
                    }
                });
            });
        }
        async function create(product, providerId) {
            return new Promise(resolve => {
                const productDB = {
                    provider_id: providerId,
                    hub_id: 0,
                    product_reference: product.productId,
                    product_name: product.productName,
                    product_brand: product.brand,
                    product_stock: product.stock,
                    product_price: product.price,
                    additional_costs: product.additionalCosts,
                    need_create: 0,
                    ignore_product: 0,
                    last_update: product.lastUpdate
                };
                const sql = `INSERT INTO providers_products SET ?`;
                Connect_1.default.query(sql, productDB, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao salvar no banco de dados'
                        });
                    }
                    else {
                        resolve({ success: true });
                    }
                });
            });
        }
        async function setZeroStock(providerId) {
            return new Promise(resolve => {
                const sql = `UPDATE providers_products SET product_stock = 0 WHERE provider_id = ${providerId}`;
                Connect_1.default.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao zerar o estoques dos produtos vinculados a esse fornecedor'
                        });
                    }
                    else {
                        resolve(true);
                    }
                });
            });
        }
        async function getStandartCost(providerId) {
            return new Promise(resolve => {
                const sql = `SELECT standart_costs, cost_type FROM providers WHERE provider_id = ${providerId}`;
                Connect_1.default.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao consultar dados do fornecedor'
                        });
                    }
                    else {
                        resolve({
                            standartCost: resultado[0].standart_costs,
                            costType: resultado[0].cost_type
                        });
                    }
                });
            });
        }
    }
    async saveProductsDBLocal(products, providerId, res) {
        const zeroStock = await setZeroStock(providerId);
        const standartCosts = await getStandartCost(providerId);
        if (zeroStock && standartCosts) {
            console.log('Estoques zerados');
            // const lastUpdate = new Date()
            const response = await productLoop(products, 0, providerId);
            console.log('fim da operação');
            if (response.success) {
                res.status(200).json({
                    code: 200,
                    message: 'produtos atualizados com sucesso',
                    products: products
                });
            }
            else {
                res.status(400).json({
                    code: 400,
                    message: 'houve algum erro no processo de atualização do banco de dados',
                    products: products
                });
            }
        }
        else {
            res.status(400).json({
                code: 400,
                message: 'erro ao salvar no banco de dados devido a funções anteriores'
            });
        }
        async function productLoop(products, index, providerId) {
            return new Promise(async (resolve) => {
                const updateProduct = await update(products[index], providerId);
                if (!updateProduct.success) {
                    const createProduct = await create(products[index], providerId);
                    if (createProduct.success) {
                        console.log(index + 1, " / ", products.length, ' - inserido com sucesso');
                        if (products.length > index + 1) {
                            resolve(productLoop(products, index + 1, providerId));
                        }
                        else {
                            resolve({ success: true });
                        }
                    }
                    else {
                        resolve({ success: false });
                    }
                }
                else {
                    console.log(index + 1, " / ", products.length, ' - update com sucesso');
                    if (products.length > index + 1) {
                        resolve(productLoop(products, index + 1, providerId));
                    }
                    else {
                        resolve({ success: true });
                    }
                }
            });
        }
        async function update(product, providerId) {
            return new Promise(resolve => {
                const productDB = {
                    hub_id: product.hubId,
                    product_name: product.productName,
                    product_brand: product.brand,
                    product_stock: product.stock,
                    product_price: product.price,
                    additional_costs: product.additionalCosts,
                    last_update: product.lastUpdate
                };
                console.log;
                const sql = `UPDATE providers_products SET ? WHERE product_reference=${product.productId} AND provider_id=${providerId}`;
                Connect_1.default.query(sql, productDB, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao salvar no banco de dados'
                        });
                    }
                    else {
                        if (resultado.affectedRows > 0) {
                            resolve({ success: true });
                        }
                        else {
                            resolve({ success: false });
                        }
                    }
                });
            });
        }
        async function create(product, providerId) {
            return new Promise(resolve => {
                const productDB = {
                    provider_id: providerId,
                    hub_id: product.hubId,
                    product_reference: product.productId,
                    product_name: product.productName,
                    product_brand: product.brand,
                    product_stock: product.stock,
                    product_price: product.price,
                    additional_costs: product.additionalCosts,
                    need_create: 0,
                    ignore_product: 0,
                    last_update: product.lastUpdate
                };
                const sql = `INSERT INTO providers_products SET ?`;
                Connect_1.default.query(sql, productDB, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao salvar no banco de dados'
                        });
                    }
                    else {
                        resolve({ success: true });
                    }
                });
            });
        }
        async function setZeroStock(providerId) {
            return new Promise(resolve => {
                const sql = `UPDATE providers_products SET product_stock = 0 WHERE provider_id = ${providerId}`;
                Connect_1.default.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao zerar o estoques dos produtos vinculados a esse fornecedor'
                        });
                    }
                    else {
                        resolve(true);
                    }
                });
            });
        }
        async function getStandartCost(providerId) {
            return new Promise(resolve => {
                const sql = `SELECT standart_costs, cost_type FROM providers WHERE provider_id = ${providerId}`;
                Connect_1.default.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                        res.status(400).json({
                            code: 400,
                            message: 'erro ao consultar dados do fornecedor'
                        });
                    }
                    else {
                        resolve({
                            standartCost: resultado[0].standart_costs,
                            costType: resultado[0].cost_type
                        });
                    }
                });
            });
        }
    }
}
exports.default = new SaveProducts;
