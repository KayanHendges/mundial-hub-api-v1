"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OAuth2Tray_1 = __importDefault(require("../../../models/Auth/OAuth2Tray"));
const TrayProducts_1 = __importDefault(require("../../Tray/TrayProducts"));
const ProductDataBase_1 = __importDefault(require("../ProductDataBase"));
const Validate_1 = __importDefault(require("../Validate"));
const Connect_1 = __importDefault(require("../../../database/Connect"));
class CreateProduct {
    async createUnitary(values) {
        return new Promise(async (resolve, reject) => {
            const unitary = await Validate_1.default.hubProduct(values);
            await ProductDataBase_1.default.insert(unitary)
                .then(response => {
                resolve(response);
            })
                .catch(erro => {
                reject(erro);
            });
        });
    }
    async createPricing(values, storeId) {
        return new Promise(async (resolve, reject) => {
            const storeCredentials = OAuth2Tray_1.default.getStoreCredentials(storeId);
            const unitary = await Validate_1.default.createPricing(values, storeId);
            await ProductDataBase_1.default.insertPricing(unitary, await storeCredentials)
                .then(response => {
                resolve(response);
            })
                .catch(erro => {
                reject(erro);
            });
        });
    }
    async createKitPricingRules(unitaryPricing, kitRules, storeId) {
        return new Promise(async (resolve, reject) => {
            const storeCredentials = OAuth2Tray_1.default.getStoreCredentials(storeId);
            const pricing = await Validate_1.default.createKitPricing(unitaryPricing, kitRules);
            const pricingId = await ProductDataBase_1.default.insertPricing(pricing, await storeCredentials)
                .catch(erro => {
                reject(erro);
                return 0;
            });
            if (pricingId == 0) {
                return;
            }
            const ruleId = await ProductDataBase_1.default.insertKitRules(Object.assign(Object.assign({}, kitRules), { hub_id: unitaryPricing.hub_id, kit_price: pricing.tray_promotional_price > 0 ? pricing.tray_promotional_price : pricing.tray_price, tray_pricing_id: pricingId, tray_product_id: kitRules.tray_product_id ? kitRules.tray_product_id : 0, tray_product_parent_id: unitaryPricing.tray_product_id ? unitaryPricing.tray_product_id : 0 }))
                .catch(erro => {
                reject(erro);
                return 0;
            });
            if (ruleId == 0) {
                return;
            }
            resolve({
                pricing_id: pricingId,
                rules_id: ruleId
            });
        });
    }
    async createTrayUnitary(unitaryDetails, unitaryPricing, trayPricingId, storeId) {
        return new Promise(async (resolve, reject) => {
            const storeCredentials = OAuth2Tray_1.default.getStoreCredentials(storeId);
            const unitary = Validate_1.default.hubProduct(unitaryDetails);
            const pricing = Validate_1.default.createPricing(unitaryPricing, storeId);
            const trayId = await TrayProducts_1.default.createUnitary(await storeCredentials, Object.assign(Object.assign({}, await unitary), await pricing))
                .catch(erro => {
                reject(erro);
                return 0;
            });
            if (trayId == 0) {
                return;
            }
            await ProductDataBase_1.default.updatePricing({ tray_product_id: trayId }, `tray_pricing_id = ${trayPricingId}`)
                .then(response => {
                resolve(trayId);
            })
                .catch(erro => {
                reject(`Criado na tray com id = ${trayId}, porém erro ao atualizar o banco de dados: ${erro}`);
            });
        });
    }
    async createTrayKit(unitaryDetails, unitaryPricing, kitRules, trayPricingId, storeId) {
        return new Promise(async (resolve, reject) => {
            const storeCredentials = OAuth2Tray_1.default.getStoreCredentials(storeId);
            const details = Validate_1.default.hubProduct(unitaryDetails);
            const pricing = Validate_1.default.createKitPricing(unitaryPricing, kitRules);
            const childTrayId = await getChildProductId((await details).reference, storeId)
                .catch(erro => {
                reject(erro);
                return 0;
            });
            if (childTrayId == 0) {
                return;
            }
            const trayParentId = await TrayProducts_1.default.createKit(await storeCredentials, Object.assign(Object.assign({}, await details), await pricing))
                .catch(erro => {
                reject(erro);
                return 0;
            });
            if (trayParentId == 0) {
                return;
            }
            const updatedPricing = ProductDataBase_1.default.updatePricing({ tray_product_id: trayParentId }, `tray_pricing_id = ${trayPricingId}`)
                .then(response => {
                return true;
            })
                .catch(erro => {
                reject(erro);
                return false;
            });
            const updatedKitRules = ProductDataBase_1.default.updateKitRules({
                tray_product_parent_id: trayParentId,
                tray_product_id: childTrayId
            }, `tray_pricing_id=${trayPricingId}`)
                .then(response => {
                return true;
            })
                .catch(erro => {
                reject(erro);
                return false;
            });
            sleep(300);
            const kitRuleTray = TrayProducts_1.default.createKitRule(await storeCredentials, Object.assign(Object.assign({}, kitRules), { tray_product_id: childTrayId, tray_product_parent_id: trayParentId }))
                .then(response => {
                return true;
            })
                .catch(erro => {
                reject(erro);
                return false;
            });
            if (await updatedPricing && await updatedKitRules && await kitRuleTray) {
                resolve(trayParentId);
            }
            else {
                reject('erro desconhecido');
            }
            async function getChildProductId(reference, storeId) {
                return new Promise(async (resolve, reject) => {
                    const sql = `SELECT tray_product_id
                    FROM produtos p JOIN tray_produtos tp ON p.hub_id = tp.hub_id
                    WHERE p.reference = ${reference} AND p.is_kit = 0 AND tp.tray_store_id = ${storeId}`;
                    Connect_1.default.query(sql, (erro, resultado) => {
                        if (erro) {
                            Error(erro.sqlMessage);
                            console.log(erro);
                        }
                        else {
                            if (resultado.length > 0) {
                                resolve(resultado[0].tray_product_id);
                            }
                            else {
                                reject('nenhum product id com essa referencia');
                                Error('nenhum product id com essa referencia');
                            }
                        }
                    });
                });
            }
            async function sleep(ms) {
                return new Promise(resolve => {
                    setTimeout(() => resolve(), ms);
                });
            }
        });
    }
}
exports.default = new CreateProduct;
