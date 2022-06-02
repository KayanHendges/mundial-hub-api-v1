"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Connect_1 = __importDefault(require("../database/Connect"));
const fs_1 = __importDefault(require("fs"));
const TrayProducts_1 = __importDefault(require("../services/Tray/TrayProducts"));
const OAuth2Tray_1 = __importDefault(require("./Auth/OAuth2Tray"));
const ProductDataBase_1 = __importDefault(require("../services/Products/ProductDataBase"));
const date_fns_1 = require("date-fns");
const axios_1 = __importDefault(require("axios"));
const sleep_1 = __importDefault(require("../services/sleep"));
class Temp {
    async Temp(req, res) {
        const errorProducts = fs_1.default.readFileSync(`./src/files/google-errors-products.txt`, 'utf8');
        const getCredentials = OAuth2Tray_1.default.getStoreCredentials(1049898);
        const getwhiteListProducts = getWhiteList(errorProducts);
        const getAllProducts = getProductsToDelete();
        const { "0": whiteList, "1": allProducts, "2": storeCredentiasl } = await Promise.all([
            getwhiteListProducts,
            getAllProducts,
            getCredentials
        ]);
        const productsToHandle = [];
        allProducts.map(product => {
            var isWhiteProduct = false;
            whiteList.map(whiteProduct => {
                if (product.hub_id == whiteProduct.hub_id) {
                    isWhiteProduct = true;
                }
            });
            if (!isWhiteProduct) {
                productsToHandle.push(product);
            }
        });
        console.log(allProducts.length, productsToHandle.length, whiteList.length);
        await deleteLoop(productsToHandle, 0);
        res.send(productsToHandle);
        async function deleteLoop(list, index) {
            return new Promise(async (resolve) => {
                if (list.length > index) {
                    resolve();
                    return;
                }
                const start = (0, date_fns_1.getTime)(new Date());
                const product = list[index];
                if (!product) {
                    resolve();
                    return;
                }
                const deleted = await TrayProducts_1.default.delete(storeCredentiasl, product.tray_product_id)
                    .then(response => { return true; })
                    .catch(err => { console.log('erro ao excluir', product.tray_product_id); return false; });
                if (!deleted) {
                    resolve();
                    return;
                }
                const sqlCondition = `tray_store_id = 1049898 and tray_pricing_id = ${product.tray_pricing_id}`;
                const updated = await ProductDataBase_1.default.updatePricing({ tray_product_id: 0 }, sqlCondition)
                    .then(response => { return true; })
                    .catch(err => { console.log('erro ao atualizar', product.tray_product_id); return false; });
                const end = (0, date_fns_1.getTime)(new Date());
                const executionTime = end - start;
                console.log(`${Math.ceil((((index + 1) / list.length) * 100))}% ${index + 1}/${list.length} - concluído em ${executionTime} ms`);
                setTimeout(() => {
                    resolve(deleteLoop(list, index + 1));
                }, 340 - executionTime);
            });
        }
        async function getWhiteList(errorProducts) {
            return new Promise((resolve, reject) => {
                const sql = `SELECT *
                FROM produtos p JOIN tray_produtos tp ON p.hub_id=tp.hub_id
                WHERE p.is_kit = 0 AND tp.tray_store_id = 1049898 AND tray_product_id NOT IN (${errorProducts})
                AND p.ean NOT LIKE ''`;
                Connect_1.default.query(sql, (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
        }
        async function getProductsToDelete() {
            return new Promise((resolve, reject) => {
                const sql = `SELECT *
                FROM produtos p JOIN tray_produtos tp ON p.hub_id=tp.hub_id
                WHERE p.is_kit = 0 AND tp.tray_store_id = 1049898 AND tray_product_id > 0`;
                Connect_1.default.query(sql, (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
        }
    }
    async Temp2(req, res) {
        const trayProducts = [];
        const getCredentials = OAuth2Tray_1.default.getStoreCredentials(1049898);
        const getAllProducts = getProductsToDelete();
        const { "0": allProducts, "1": storeCredentials } = await Promise.all([
            getAllProducts,
            getCredentials
        ]);
        await getTrayProducts(storeCredentials, 1)
            .catch(err => { console.log(err); });
        const productsToHandle = [];
        trayProducts.map(trayProduct => {
            var isIncluded = false;
            allProducts.map(product => {
                if (product.tray_product_id == trayProduct) {
                    isIncluded = true;
                }
            });
            if (!isIncluded) {
                productsToHandle.push(trayProduct);
            }
        });
        console.log(productsToHandle.length);
        res.send(productsToHandle);
        async function deleteLoop(list, index) {
            return new Promise(async (resolve) => {
                if (list.length > index) {
                    resolve();
                    return;
                }
                const start = (0, date_fns_1.getTime)(new Date());
                const product = list[index];
                if (!product) {
                    resolve();
                    return;
                }
                const deleted = await TrayProducts_1.default.delete(storeCredentials, product.tray_product_id)
                    .then(response => { return true; })
                    .catch(err => { console.log('erro ao excluir', product.tray_product_id); return false; });
                if (!deleted) {
                    resolve();
                    return;
                }
                const sqlCondition = `tray_store_id = 1049898 and tray_pricing_id = ${product.tray_pricing_id}`;
                const updated = await ProductDataBase_1.default.updatePricing({ tray_product_id: 0 }, sqlCondition)
                    .then(response => { return true; })
                    .catch(err => { console.log('erro ao atualizar', product.tray_product_id); return false; });
                const end = (0, date_fns_1.getTime)(new Date());
                const executionTime = end - start;
                console.log(`${Math.ceil((((index + 1) / list.length) * 100))}% ${index + 1}/${list.length} - concluído em ${executionTime} ms`);
                setTimeout(() => {
                    resolve(deleteLoop(list, index + 1));
                }, 340 - executionTime);
            });
        }
        async function getTrayProducts(store, page) {
            return new Promise((resolve, reject) => {
                const query = `${store.api_address}/products/?page=${page}&limit=50&access_token=${store.access_token}`;
                const config = {
                    method: 'get',
                    url: query,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                };
                (0, axios_1.default)(config)
                    .then(async (response) => {
                    var _a;
                    const products = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.Products;
                    if (products.length == 0) {
                        resolve();
                        return;
                    }
                    products === null || products === void 0 ? void 0 : products.map(product => {
                        const id = parseInt(product.Product.id);
                        trayProducts.push(id);
                    });
                    await (0, sleep_1.default)(340);
                    resolve(getTrayProducts(store, page + 1));
                })
                    .catch(erro => {
                    reject(erro);
                });
            });
        }
        async function getProductsToDelete() {
            return new Promise((resolve, reject) => {
                const sql = `SELECT *
                FROM produtos p JOIN tray_produtos tp ON p.hub_id=tp.hub_id
                WHERE p.is_kit = 0 AND tp.tray_store_id = 1049898 AND tray_product_id > 0`;
                Connect_1.default.query(sql, (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
        }
    }
}
exports.default = new Temp;
