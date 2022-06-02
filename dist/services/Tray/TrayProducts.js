"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const Requests_1 = __importDefault(require("../../models/Tray/Requests"));
const RequestsQueue_1 = __importDefault(require("./RequestsQueue"));
class TrayProducts {
    async createUnitary(store, product) {
        return new Promise(async (resolve, reject) => {
            // service disabled
            const min = 1000 * 20;
            const max = 1000 * 40;
            const randomTrayId = Math.floor(Math.random() * (max - min + 1) + min);
            resolve(randomTrayId);
            // just for demonstration
            await RequestsQueue_1.default.newRequest()
                .catch(erro => {
                new Error(erro);
            });
            const productObj = {
                Product: {
                    is_kit: 0,
                    ean: product.ean,
                    name: product.product_name,
                    ncm: product.ncm,
                    description: product.product_description,
                    price: product.tray_price,
                    cost_price: product.cost_price,
                    promotional_price: product.tray_promotional_price,
                    start_promotion: product.start_promotion,
                    end_promotion: product.end_promotion,
                    brand: product.brand,
                    model: product.model,
                    weight: product.weight,
                    length: product.length,
                    width: product.width,
                    height: product.height,
                    stock: product.tray_stock,
                    minimum_stock: product.tray_minimum_stock,
                    minimum_stock_alert: '1',
                    category_id: product.tray_main_category_id,
                    available: product.available,
                    availability: product.availability,
                    availability_days: product.availability_days,
                    reference: product.reference,
                    hot: "1",
                    release: "1",
                    related_categories: product.tray_related_categories,
                    picture_source_1: product.picture_source_1,
                    picture_source_2: product.picture_source_2,
                    picture_source_3: product.picture_source_3,
                    picture_source_4: product.picture_source_4,
                    picture_source_5: product.picture_source_5,
                    picture_source_6: product.picture_source_6,
                    metatag: [{ type: "description",
                            content: product.product_name,
                            warranty: product.warranty,
                            local: 1 }],
                }
            };
            const trayProduct = JSON.stringify(productObj);
            const query = `${store.api_address}/products/?access_token=${store.access_token}`;
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
                    const trayId = parseInt(response.data.id);
                    resolve(trayId);
                }
                else {
                    console.log(response.data);
                    reject(`Erro ao criar. Motivo - ${JSON.stringify(response.data)}`);
                }
            })
                .catch(erro => {
                var _a, _b, _c, _d, _e, _f, _g;
                if (((_b = (_a = erro === null || erro === void 0 ? void 0 : erro.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.causes) != undefined) {
                    console.log((_d = (_c = erro === null || erro === void 0 ? void 0 : erro.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.causes);
                    reject(`Erro ao cadastrar na Tray ${store.tray_adm_user} - Item ${product.reference}. Motivo da tray: ${JSON.stringify((_f = (_e = erro === null || erro === void 0 ? void 0 : erro.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.causes)}`);
                }
                else {
                    console.log((_g = erro === null || erro === void 0 ? void 0 : erro.response) === null || _g === void 0 ? void 0 : _g.data);
                    reject(`Erro ao cadastrar na Tray ${store.tray_adm_user} - Item ${product.reference}. Resposta da Tray: ${JSON.stringify(erro.response.data)}`);
                }
            })
                .finally(() => {
                RequestsQueue_1.default.finishRequest();
            });
        });
    }
    async updateProduct(store, product, trayId) {
        return new Promise(async (resolve, reject) => {
            // service disabled
            resolve();
            // just for demonstration
            await RequestsQueue_1.default.newRequest()
                .catch(erro => {
                new Error(erro);
            });
            const productObj = {
                is_kit: product.is_kit,
                ean: product.ean,
                name: product.product_name,
                ncm: product.ncm,
                description: product.product_description,
                price: product.tray_price,
                cost_price: product.cost_price,
                promotional_price: product.tray_promotional_price,
                start_promotion: product.start_promotion,
                end_promotion: product.end_promotion,
                brand: product.brand,
                model: product.model,
                weight: product.weight,
                length: product.length,
                width: product.width,
                height: product.height,
                stock: product.is_kit == 0 ? product.tray_stock : undefined,
                minimum_stock: product.tray_minimum_stock,
                minimum_stock_alert: '1',
                category_id: product.tray_main_category_id,
                available: product.available,
                availability: product.availability,
                availability_days: product.availability_days,
                reference: product.reference,
                hot: "1",
                release: "1",
                related_categories: product.tray_related_categories,
                picture_source_1: product.picture_source_1,
                picture_source_2: product.picture_source_2,
                picture_source_3: product.picture_source_3,
                picture_source_4: product.picture_source_4,
                picture_source_5: product.picture_source_5,
                picture_source_6: product.picture_source_6,
                metatag: [{ type: "description",
                        content: product.product_name,
                        warranty: product.warranty,
                        local: 1 }],
            };
            removeUndefined(productObj);
            const trayProduct = JSON.stringify({ Product: productObj });
            const query = `${store.api_address}/products/${trayId}?access_token=${store.access_token}`;
            Requests_1.default.saveRequest(query);
            const config = {
                method: 'put',
                url: query,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: trayProduct
            };
            (0, axios_1.default)(config)
                .then(response => {
                if (response.data.code == 200) {
                    resolve();
                }
                else {
                    console.log(response.data);
                    reject(`Erro ao criar. Motivo - ${JSON.stringify(response.data)}`);
                }
            })
                .catch(erro => {
                var _a, _b, _c, _d, _e, _f, _g;
                if (((_b = (_a = erro === null || erro === void 0 ? void 0 : erro.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.causes) != undefined) {
                    console.log((_d = (_c = erro === null || erro === void 0 ? void 0 : erro.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.causes);
                    reject(`Erro ao editar na Tray ${store.tray_adm_user} - Item ${product.reference}. Motivo da tray: ${JSON.stringify((_f = (_e = erro === null || erro === void 0 ? void 0 : erro.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.causes)}`);
                }
                else {
                    console.log((_g = erro === null || erro === void 0 ? void 0 : erro.response) === null || _g === void 0 ? void 0 : _g.data);
                    reject(`Erro ao editar na Tray ${store.tray_adm_user} - Item ${product.reference}. Resposta da Tray: ${JSON.stringify(erro.response.data)}`);
                }
            })
                .finally(() => {
                RequestsQueue_1.default.finishRequest();
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
    async createKit(store, product) {
        return new Promise(async (resolve, reject) => {
            // service disabled
            const min = 1000 * 20;
            const max = 1000 * 40;
            const randomTrayId = Math.floor(Math.random() * (max - min + 1) + min);
            resolve(randomTrayId);
            // just for demonstration
            await RequestsQueue_1.default.newRequest()
                .catch(erro => {
                new Error(erro);
            });
            const productObj = {
                Product: {
                    is_kit: 1,
                    ean: product.ean,
                    name: product.product_name,
                    ncm: product.ncm,
                    description: product.product_description,
                    price: product.tray_price,
                    cost_price: product.cost_price,
                    // promotional_price: product.tray_promotional_price,
                    // start_promotion: product.start_promotion,
                    // end_promotion: product.end_promotion,
                    brand: product.brand,
                    model: product.model,
                    weight: product.weight,
                    length: product.length,
                    width: product.width,
                    height: product.height,
                    // stock: product.tray_stock,
                    minimum_stock: product.tray_minimum_stock,
                    minimum_stock_alert: '1',
                    category_id: product.tray_main_category_id,
                    available: product.available,
                    availability: product.availability,
                    availability_days: product.availability_days,
                    reference: product.reference,
                    hot: "1",
                    release: "1",
                    related_categories: product.tray_related_categories,
                    picture_source_1: product.picture_source_1,
                    picture_source_2: product.picture_source_2,
                    picture_source_3: product.picture_source_3,
                    picture_source_4: product.picture_source_4,
                    picture_source_5: product.picture_source_5,
                    picture_source_6: product.picture_source_6,
                    metatag: [{ type: "description",
                            content: product.product_name,
                            warranty: product.warranty,
                            local: 1 }],
                }
            };
            const trayProduct = JSON.stringify(productObj);
            const query = `${store.api_address}/products/?access_token=${store.access_token}`;
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
                    const trayId = parseInt(response.data.id);
                    resolve(trayId);
                }
                else {
                    console.log(response.data);
                    reject(`Erro ao criar. Motivo - ${JSON.stringify(response.data)}`);
                }
            })
                .catch(erro => {
                var _a, _b, _c, _d, _e, _f, _g;
                if (((_b = (_a = erro === null || erro === void 0 ? void 0 : erro.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.causes) != undefined) {
                    console.log((_d = (_c = erro === null || erro === void 0 ? void 0 : erro.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.causes);
                    reject(`Erro ao cadastrar Kit na Tray ${store.tray_adm_user} - Item ${product.reference}. Motivo da tray: ${JSON.stringify((_f = (_e = erro === null || erro === void 0 ? void 0 : erro.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.causes)}`);
                }
                else {
                    console.log((_g = erro === null || erro === void 0 ? void 0 : erro.response) === null || _g === void 0 ? void 0 : _g.data);
                    reject(`Erro ao cadastrar na Tray ${store.tray_adm_user} - Item ${product.reference}. Resposta da Tray: ${JSON.stringify(erro.response.data)}`);
                }
            })
                .finally(() => {
                RequestsQueue_1.default.finishRequest();
            });
        });
    }
    async createKitRule(store, rule) {
        return new Promise(async (resolve, reject) => {
            // service disabled
            resolve({ success: true, message: 'regra de kit criada com sucesso' });
            // just for demonstration
            await RequestsQueue_1.default.newRequest()
                .catch(erro => {
                new Error(erro);
            });
            const rulesObj = JSON.stringify([{
                    product_parent_id: rule.tray_product_parent_id,
                    product_id: rule.tray_product_id,
                    quantity: rule.quantity,
                    discount_type: rule.discount_type,
                    discount_value: rule.discount_value,
                    price_rule: rule.price_rule
                }]);
            const query = `${store.api_address}/products/kits/?access_token=${store.access_token}`;
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
                resolve({ success: true, message: 'regra de kit inserida com sucesso' });
            })
                .catch(erro => {
                var _a, _b, _c, _d, _e, _f, _g;
                if (((_b = (_a = erro === null || erro === void 0 ? void 0 : erro.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.causes) != undefined) {
                    console.log((_d = (_c = erro === null || erro === void 0 ? void 0 : erro.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.causes);
                    reject(`Erro ao criar regras do kit na Tray ${store.tray_adm_user} - Item ${rule.tray_product_parent_id}. Motivo da tray: ${JSON.stringify((_f = (_e = erro === null || erro === void 0 ? void 0 : erro.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.causes)}`);
                }
                else {
                    console.log((_g = erro === null || erro === void 0 ? void 0 : erro.response) === null || _g === void 0 ? void 0 : _g.data);
                    reject(`Erro ao criar regras do kit na Tray ${store.tray_adm_user} - Item ${rule.tray_product_parent_id}. Resposta da Tray: ${JSON.stringify(erro.response.data)}`);
                }
            })
                .finally(() => {
                RequestsQueue_1.default.finishRequest();
            });
        });
    }
    async updateKitRules(store, rules) {
        return new Promise(async (resolve, reject) => {
            // service disabled
            resolve();
            // just for demonstration
            await RequestsQueue_1.default.newRequest()
                .catch(erro => {
                new Error(erro);
            });
            const rulesObj = {
                product_parent_id: rules.tray_product_parent_id,
                product_id: rules.tray_product_id,
                quantity: rules.quantity,
                discount_type: rules.discount_type,
                discount_value: rules.discount_value,
                price_rule: rules.price_rule
            };
            removeUndefined(rulesObj);
            const trayRules = [rulesObj];
            const query = `${store.api_address}/products/kits/?access_token=${store.access_token}`;
            Requests_1.default.saveRequest(query);
            const config = {
                method: 'post',
                url: query,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: trayRules
            };
            (0, axios_1.default)(config)
                .then(response => {
                resolve();
            })
                .catch(erro => {
                var _a, _b, _c, _d, _e, _f, _g;
                console.log(erro.response.data, query, trayRules);
                if (((_b = (_a = erro === null || erro === void 0 ? void 0 : erro.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.causes) != undefined) {
                    console.log((_d = (_c = erro === null || erro === void 0 ? void 0 : erro.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.causes);
                    reject(`Erro ao editar regras do kit na Tray ${store.tray_adm_user} - Item ${rules.tray_product_parent_id}. Motivo da tray: ${JSON.stringify((_f = (_e = erro === null || erro === void 0 ? void 0 : erro.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.causes)}`);
                }
                else {
                    console.log((_g = erro === null || erro === void 0 ? void 0 : erro.response) === null || _g === void 0 ? void 0 : _g.data);
                    reject(`Erro ao editar regras do kit na Tray ${store.tray_adm_user} - Item ${rules.tray_product_parent_id}. Resposta da Tray: ${JSON.stringify(erro.response.data)}`);
                }
            })
                .finally(() => {
                RequestsQueue_1.default.finishRequest();
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
    async delete(store, trayId) {
        return new Promise(async (resolve, reject) => {
            // service disabled
            resolve({ success: true, message: 'produto excluído com sucesso' });
            // just for demonstration
            await RequestsQueue_1.default.newRequest()
                .catch(erro => {
                new Error(erro);
            });
            const query = `${store.api_address}/products/${trayId}/?access_token=${store.access_token}`;
            Requests_1.default.saveRequest(query);
            const config = {
                method: 'delete',
                url: query,
                headers: {
                    'Content-Type': 'application/json'
                },
            };
            (0, axios_1.default)(config)
                .then(response => {
                resolve({ success: true, message: 'produto excluído com sucesso' });
            })
                .catch(erro => {
                var _a, _b, _c, _d, _e, _f, _g;
                if (((_b = (_a = erro === null || erro === void 0 ? void 0 : erro.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.causes) != undefined) {
                    console.log((_d = (_c = erro === null || erro === void 0 ? void 0 : erro.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.causes);
                    reject(`Erro ao excluir o produto na Tray ${store.tray_adm_user} - Item ${trayId}. Motivo da tray: ${JSON.stringify((_f = (_e = erro === null || erro === void 0 ? void 0 : erro.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.causes)}`);
                }
                else {
                    console.log((_g = erro === null || erro === void 0 ? void 0 : erro.response) === null || _g === void 0 ? void 0 : _g.data);
                    reject(`Erro ao excluir o produto na Tray ${store.tray_adm_user} - Item ${trayId}. Resposta da Tray: ${JSON.stringify(erro.response.data)}`);
                }
            })
                .finally(() => {
                RequestsQueue_1.default.finishRequest();
            });
        });
    }
}
exports.default = new TrayProducts;
