"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const Connect_1 = __importDefault(require("../../database/Connect"));
const ProductDataBase_1 = __importDefault(require("../../services/Products/ProductDataBase"));
const OAuth2Tray_1 = __importDefault(require("../Auth/OAuth2Tray"));
const Requests_1 = __importDefault(require("../Tray/Requests"));
class List {
    async unitary(reference) {
        return new Promise(async (resolve, reject) => {
            const details = await ProductDataBase_1.default.getProduct({ reference: reference }, true)
                .catch(erro => {
                reject(erro);
                return null;
            });
            if (details) {
                const arrayPricing = await ProductDataBase_1.default.getPricing({ hub_id: details.hub_id }, false)
                    .catch(erro => {
                    reject(erro);
                });
                if (arrayPricing) {
                    resolve({
                        details,
                        pricing: arrayPricing
                    });
                }
                else {
                    resolve({
                        details,
                        pricing: []
                    });
                }
            }
            else {
                return;
            }
        });
    }
    async kits(reference) {
        return new Promise(async (resolve, reject) => {
            const kitsDetails = await ProductDataBase_1.default.getProduct({ reference: reference }, false, true)
                .catch(erro => {
                reject(erro);
                return null;
            });
            if (kitsDetails) {
                const kits = [];
                await loop(kitsDetails, 0);
                resolve(kits);
                function loop(list, index) {
                    return new Promise(async (resolve) => {
                        if (list.length > index) {
                            kits.push(await getKitPricingAndRules(list[index]));
                            resolve(loop(list, index + 1));
                        }
                        else {
                            resolve();
                        }
                    });
                }
                function getKitPricingAndRules(kit) {
                    return new Promise(async (resolve, reject) => {
                        resolve({
                            details: kit,
                            pricing: await ProductDataBase_1.default.getPricing({ hub_id: kit.hub_id }, false)
                                .catch(erro => {
                                return [];
                            }),
                            rules: await ProductDataBase_1.default.getKitRules({ hub_id: kit.hub_id }, false)
                                .catch(erro => {
                                return [];
                            })
                        });
                    });
                }
            }
            else {
                return;
            }
        });
    }
    async list(params, res) {
        const search = params.search;
        const page = params.page.length > 0 ? parseInt(params.page) : 1;
        const perPage = params.perPage.length > 0 ? parseInt(params.perPage) : 20;
        const orderCollum = params.orderBy.length > 0 ? params.orderBy : 'p.hub_id';
        const order = params.order.length > 0 ? params.order : 'DESC';
        const store = params.store.length > 0 ? parseInt(params.store) : 668385;
        const showKits = params.showKits.length > 0 && store == 668385 ? parseInt(params.showKits) : 0;
        const rowStart = (page - 1) * perPage;
        const collums = 'p.hub_id, t.tray_product_id, p.reference, p.product_name, p.picture_source_1, p.picture_source_1_90, t.tray_stock, t.tray_price, t.tray_promotional_price, t.start_promotion, t.end_promotion';
        const kitCollums = `p.product_name, p.reference, t.tray_stock, p.picture_source_1, p.picture_source_1_90, t.tray_price, t.tray_promotional_price`;
        const tables = 'FROM produtos p JOIN tray_produtos t ON p.hub_id = t.hub_id';
        const orderBy = `ORDER BY ${orderCollum} ${order}`;
        let sql = `SELECT
        ${collums}
        ${tables}
        WHERE t.tray_store_id=${store} AND p.is_kit=0
        ${orderBy}
        LIMIT ${rowStart}, ${perPage}`;
        let sqlCount = `SELECT COUNT(*) ${tables} WHERE t.tray_store_id=${store} AND p.is_kit=0`;
        if (search.length > 0) {
            if (parseInt(search) > 0 && search.length == 4) { // se for 4, se trata da referencia
                sql = `SELECT 
                ${collums}
                ${tables} 
                WHERE t.tray_store_id=${store} AND p.reference=${search} AND p.is_kit=0
                ${orderBy}`;
                sqlCount = `SELECT COUNT(*) ${tables} WHERE t.tray_store_id=${store} AND p.reference=${search} AND p.is_kit=0`;
            }
            else {
                if (search.split(' ').length > 1) {
                    const words = search.split(' ').map(word => {
                        return `${word}%`;
                    });
                    sql = `SELECT
                    ${collums}
                    ${tables}
                    WHERE t.tray_store_id=${store} AND p.is_kit=0 AND p.product_name LIKE '%${words.join('')}'
                    ${orderBy}`;
                    sqlCount = `SELECT COUNT(*) ${tables} WHERE t.tray_store_id=${store} AND p.is_kit=0 AND product_name LIKE '%${words.join('')}'`;
                }
                else {
                    sql = `SELECT
                    ${collums}
                    ${tables}
                    WHERE t.tray_store_id=${store} AND p.is_kit=0 AND p.product_name LIKE '%${search}%' 
                    ${orderBy} 
                    LIMIT ${rowStart}, ${perPage}`;
                    sqlCount = `SELECT COUNT(*) ${tables} WHERE t.tray_store_id=${store} AND p.is_kit=0 AND product_name LIKE '%${search}%'`;
                }
            }
        }
        const products = await getProductList(sql).then(response => { return response; });
        const productsLength = await getResultLength(sqlCount).then(response => { return response; });
        const productWithKits = await getKits(products, showKits);
        const dataReturn = {
            produtos: productWithKits,
            numero_produtos: productsLength,
            limite_pagina: perPage,
            pagina: page,
            numero_paginas: Math.ceil(productsLength / perPage)
        };
        res.status(200).json(dataReturn);
        async function getProductList(sql) {
            return new Promise((resolve, reject) => {
                Connect_1.default.query(sql, (erro, resultados) => {
                    if (erro) {
                        console.log(erro);
                    }
                    else {
                        resolve(resultados);
                    }
                });
            });
        }
        async function getResultLength(sql) {
            return new Promise((resolve, reject) => {
                Connect_1.default.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                    }
                    else {
                        var productsLength = JSON.stringify(resultado[0]);
                        productsLength = productsLength.replace('{"COUNT(*)":', '');
                        productsLength = productsLength.replace('}', '');
                        resolve(productsLength);
                    }
                });
            });
        }
        async function getKits(products, showKits) {
            return new Promise((resolve, reject) => {
                if (showKits == 1) {
                    const referenceList = getReference(products);
                    const sql = `SELECT
                    ${kitCollums}
                    ${tables} 
                    WHERE p.is_kit=1 and reference in (${referenceList}) ORDER BY p.reference DESC, p.product_name ASC`;
                    Connect_1.default.query(sql, (erro, resultados) => {
                        if (erro) {
                            console.log(erro);
                        }
                        else {
                            if (resultados.length > 0) {
                                resolve(insertKits(products, resultados));
                            }
                            else {
                                resolve(products.map(product => {
                                    return Object.assign(Object.assign({}, product), { kits: [] });
                                }));
                            }
                        }
                    });
                }
                else {
                    resolve(products.map(product => {
                        return Object.assign(Object.assign({}, product), { kits: [] });
                    }));
                }
            });
        }
        function getReference(products) {
            const referenceList = products.map(product => {
                return product.reference;
            });
            return referenceList;
        }
        function insertKits(products, kits) {
            const productList = products.map(product => {
                return Object.assign(Object.assign({}, product), { kits: kits.map(kit => {
                        if (kit.reference == product.reference) {
                            return kit;
                        }
                        else {
                            return;
                        }
                    }).filter((value) => {
                        return value != null;
                    }) });
            });
            return productList;
        }
    }
    async listToLinkProviders(search, res) {
        var sql = '';
        if (search.length > 0) {
            if (parseInt(search) > 0 && (search).length == 4) { // se for 4, se trata da referencia
                sql = `SELECT hub_id, product_name FROM produtos
                WHERE reference=${search} AND is_kit=0
                LIMIT 0, 10`;
            }
            else {
                if (search.split(' ').length > 1) {
                    const words = search.split(' ').map(word => {
                        return `${word}%`;
                    });
                    sql = `SELECT hub_id, product_name FROM produtos
                    WHERE is_kit=0 AND product_name LIKE '%${words.join('')}'
                    LIMIT 0, 10`;
                }
                else {
                    sql = `SELECT hub_id, product_name FROM produtos
                    WHERE is_kit=0 AND product_name LIKE '%${search}%' 
                    LIMIT 0, 10`;
                }
            }
        }
        const products = sql.length > 0 ? await getProductList(sql) : [];
        res.status(200).json({
            code: 200,
            products: products
        });
        async function getProductList(sql) {
            return new Promise((resolve, reject) => {
                Connect_1.default.query(sql, (erro, resultados) => {
                    if (erro) {
                        console.log(erro);
                        resolve([]);
                    }
                    else {
                        if (resultados.length > 0) {
                            const list = resultados.map(result => {
                                return {
                                    hubId: parseInt(result.hub_id),
                                    productName: result.product_name
                                };
                            });
                            resolve(list);
                        }
                        else {
                            resolve([]);
                        }
                    }
                });
            });
        }
    }
    async kitsByRef(reference, res) {
        const sql = `SELECT t.tray_product_id, p.product_name, p.reference, t.tray_stock, p.picture_source_1, p.picture_source_1_90, t.tray_price, t.tray_promotional_price
        FROM produtos p JOIN tray_produtos t ON p.hub_id = t.hub_id
        WHERE p.is_kit=1 AND p.reference=${reference}
        ORDER BY p.product_name ASC`;
        Connect_1.default.query(sql, (erro, resultados) => {
            if (erro) {
                console.log(erro);
                res.status(400);
            }
            else {
                if (resultados.length > 0) {
                    res.status(200).json({ kits: resultados });
                }
                else {
                    res.status(400);
                }
            }
        });
    }
    async deleteNoStockTray(res) {
        const MundialCredentials = await OAuth2Tray_1.default.getStoreCredentials(668385);
        const idsList = await getProducts();
        const resultProducts = [];
        console.log(idsList.length);
        await productLoop(idsList, 0);
        console.log(resultProducts.length);
        res.send(resultProducts);
        async function getProducts() {
            return new Promise(resolve => {
                const sql = `SELECT p.hub_id, p.reference, tp.tray_product_id 
                FROM produtos p JOIN tray_produtos tp ON p.hub_id=tp.hub_id
                WHERE tp.tray_store_id = 668385 AND p.is_kit=0 AND tp.tray_product_id > 0 AND tp.tray_stock BETWEEN 1 AND 3`;
                Connect_1.default.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                    }
                    else {
                        if (resultado.length > 0) {
                            resolve(resultado);
                        }
                        else {
                            res.send('nenhum produto');
                        }
                    }
                });
            });
        }
        async function productLoop(list, index) {
            return new Promise(async (resolve) => {
                if (list.length > index) {
                    const kits = await getKitProduct(list[index].reference);
                    if (kits.length == 1) {
                        await postTrayKit(kits[0], list[index]);
                    }
                    if (kits.length == 2) {
                        await postTrayKit(kits[0], list[index]);
                        await postTrayKit(kits[1], list[index]);
                    }
                    console.log(`referencia ${list[index].reference} salvo com sucesso - ${index + 1}/${list.length}`);
                    resolve(productLoop(list, index + 1));
                }
                else {
                    resolve();
                }
            });
        }
        async function getProductsToEdit(reference) {
            return new Promise(resolve => {
                const sql = `SELECT p.reference, p.hub_id
                FROM produtos p JOIN tray_produtos tp ON p.hub_id=tp.hub_id JOIN produtos_kits pk ON tp.hub_id=pk.hub_id
                WHERE pk.quantity > 1 AND tp.tray_product_id = 0 AND p.reference = ${reference}`;
                Connect_1.default.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                    }
                    else {
                        if (resultado.length > 0) {
                            resolve(resultado);
                        }
                        else {
                            resolve([]);
                        }
                    }
                });
            });
        }
        async function getKitProduct(reference) {
            return new Promise(resolve => {
                const sql = `SELECT
                p.hub_id,
                p.ean,
                p.product_name,
                p.ncm,
                p.product_description,
                tp.tray_price,
                tp.cost_price,
                p.brand,
                p.model,
                p.weight,
                p.length,
                p.height,
                p.width,
                tp.tray_main_category_id,
                p.availability,
                p.availability_days,
                p.reference,
                tp.tray_related_categories,
                p.picture_source_1,
                p.picture_source_2,
                p.picture_source_3,
                p.picture_source_4,
                p.picture_source_5,
                p.picture_source_6,
                pk.quantity,
                pk.discount_type,
                pk.discount_value,
                pk.price_rule
                FROM produtos p JOIN tray_produtos tp ON p.hub_id=tp.hub_id JOIN produtos_kits pk ON tp.hub_id=pk.hub_id
                WHERE pk.quantity > 1 AND tp.tray_product_id = 0 AND p.reference = ${reference}`;
                Connect_1.default.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                    }
                    else {
                        if (resultado.length > 0) {
                            console.log(reference, 'tem');
                            console;
                            resolve(resultado);
                        }
                        else {
                            console.log(reference, 'não tem');
                            resolve([]);
                        }
                    }
                });
            });
        }
        async function postTrayKit(kit, product) {
            return new Promise(async (resolve) => {
                const productObj = {
                    Product: {
                        is_kit: 1,
                        ean: kit.ean,
                        name: kit.product_name,
                        ncm: kit.ncm,
                        description: kit.product_description,
                        price: kit.tray_price,
                        cost_price: kit.cost_price,
                        brand: kit.brand,
                        model: kit.model,
                        weight: kit.weight,
                        length: kit.length,
                        width: kit.width,
                        height: kit.height,
                        category_id: kit.tray_main_category_id,
                        available: 1,
                        availability: kit.availability,
                        availability_days: kit.availability_days,
                        reference: kit.reference,
                        hot: "1",
                        release: "1",
                        related_categories: kit.tray_related_categories.length > 0 ? kit.tray_related_categories.split(',') : [],
                        release_date: "",
                        picture_source_1: kit.picture_source_1,
                        picture_source_2: kit.picture_source_2,
                        picture_source_3: kit.picture_source_3,
                        picture_source_4: kit.picture_source_4,
                        picture_source_5: kit.picture_source_5,
                        picture_source_6: kit.picture_source_6,
                        metatag: [{ type: "description",
                                content: kit.product_name,
                                local: 1 }],
                    }
                };
                const trayProduct = JSON.stringify(productObj);
                const query = `${MundialCredentials.api_address}/products/?access_token=${MundialCredentials.access_token}`;
                Requests_1.default.saveRequest(query);
                const config = {
                    method: 'post',
                    url: query,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: trayProduct
                };
                (0, axios_1.default)(config)
                    .then(response => {
                    if (response.data.code == 201) {
                        resolve(saveKitPricingDB(kit, response.data.id, product));
                    }
                    else {
                        console.log(response.data);
                    }
                })
                    .catch(erro => {
                    console.log(erro.response.data.causes);
                    res.status(400).json({
                        code: 400,
                        message: `Erro ao criar kit Tray mundial, causas: ${JSON.stringify(erro.response.data.causes)}`
                    });
                });
            });
        }
        async function saveKitPricingDB(kit, trayParentId, product) {
            return new Promise(async (resolve) => {
                const sql = `UPDATE tray_produtos SET tray_product_id = ${trayParentId} WHERE hub_id = ${kit.hub_id}`;
                Connect_1.default.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                        res.status(400).json({
                            code: 400,
                            message: `erro ao salvar o pricing do kit hub_id ${kit.hub_id} no banco de dados`
                        });
                    }
                    else {
                        resolve(postTrayRules(kit, trayParentId, product));
                    }
                });
            });
        }
        async function postTrayRules(kit, trayParentId, product) {
            return new Promise(async (resolve) => {
                const rulesObj = JSON.stringify([{
                        product_parent_id: trayParentId,
                        product_id: product.tray_product_id,
                        quantity: kit.quantity,
                        discount_type: kit.discount_type,
                        discount_value: kit.discount_value,
                        price_rule: parseInt(kit.price_rule)
                    }]);
                const query = `${MundialCredentials.api_address}/products/kits/?access_token=${MundialCredentials.access_token}`;
                Requests_1.default.saveRequest(query);
                const config = {
                    method: 'post',
                    url: query,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: rulesObj
                };
                (0, axios_1.default)(config)
                    .then(response => {
                    if (response.data.code == 201) {
                        resolve(saveRulesDB(kit, trayParentId, product));
                    }
                    else {
                        console.log(response.data);
                    }
                })
                    .catch(erro => {
                    console.log(erro);
                    console.log(erro.response.data.causes);
                    res.status(400).json({
                        code: 400,
                        message: `Erro ao salvar regras do kit Id Tray ${trayParentId} - 668385, causas: ${erro.response.data}`
                    });
                });
            });
        }
        async function saveRulesDB(kit, trayParentId, product) {
            return new Promise(async (resolve) => {
                const sql = `UPDATE produtos_kits SET tray_product_parent_Id = ${trayParentId} WHERE hub_id = ${kit.hub_id}`;
                Connect_1.default.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                        res.status(400).json({
                            code: 400,
                            message: `erro ao salvar regra do kit ${kit.quantity} no banco de dados`
                        });
                    }
                    else {
                        resolve({ success: true });
                    }
                });
            });
        }
    }
}
exports.default = new List;
