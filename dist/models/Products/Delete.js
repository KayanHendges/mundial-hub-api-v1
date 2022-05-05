"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TrayProducts_1 = __importDefault(require("../../services/Tray/TrayProducts"));
const ProductDataBase_1 = __importDefault(require("../../services/Products/ProductDataBase"));
const OAuth2Tray_1 = __importDefault(require("../Auth/OAuth2Tray"));
const Connect_1 = __importDefault(require("../../database/Connect"));
class Delete {
    async kit(hubId) {
        return new Promise(async (resolve, reject) => {
            const mundialCredentials = OAuth2Tray_1.default.getStoreCredentials(668385);
            const scpneusCredentials = OAuth2Tray_1.default.getStoreCredentials(1049898);
            const trayIdList = await checkTrayId(hubId)
                .catch(erro => {
                reject(erro);
                return null;
            });
            if (trayIdList == null) {
                return;
            }
            await deleteTrayloop(trayIdList, 0);
            const deleteRules = await ProductDataBase_1.default.deleteKitRules(`hub_id = ${hubId}`);
            const deletePricing = await ProductDataBase_1.default.deletePricing(`hub_id = ${hubId}`);
            const deleteProduct = await ProductDataBase_1.default.deleteProduct(`hub_id = ${hubId}`);
            resolve();
            async function checkTrayId(hubId) {
                return new Promise(async (resolve, reject) => {
                    const list = [];
                    const pricingList = await ProductDataBase_1.default.getPricing({ hub_id: hubId }, false)
                        .catch(erro => {
                        reject(erro);
                        return null;
                    });
                    pricingList === null || pricingList === void 0 ? void 0 : pricingList.map(pricing => {
                        if (pricing.tray_product_id) {
                            if (pricing.tray_product_id > 0) {
                                list.push({
                                    trayProductId: pricing.tray_product_id,
                                    storeId: pricing.tray_store_id
                                });
                            }
                        }
                    });
                    return list;
                });
            }
            async function deleteTrayloop(list, index) {
                return new Promise(async (resolve, reject) => {
                    if (list.length > index) {
                        const store = list[index].storeId == 668385 ? mundialCredentials : scpneusCredentials;
                        await TrayProducts_1.default.delete(await store, list[index].trayProductId);
                        setTimeout(() => {
                            resolve(deleteTrayloop(list, index + 1));
                        }, 330);
                    }
                    else {
                        resolve();
                    }
                });
            }
        });
    }
    async unitaryTray(reference, storeId) {
        return new Promise(async (resolve, reject) => {
            const storeCredentials = OAuth2Tray_1.default.getStoreCredentials(storeId);
            const hubIdList = await ProductDataBase_1.default.getProduct({ reference: reference }, false)
                .then(response => {
                const list = [];
                response.map(product => {
                    list.push(product.hub_id);
                });
                return list;
            })
                .catch(erro => {
                reject(erro);
                return false;
            });
            if (hubIdList == false) {
                return;
            }
            const trayIdList = await getTrayId(hubIdList, storeId);
            trayIdList.sort((a, b) => { return b - a; });
            await deleteTrayloop(trayIdList, 0);
            resolve();
            async function getTrayId(hubIdList, storeId) {
                return new Promise(async (resolve, reject) => {
                    const sql = `SELECT tray_product_id FROM tray_produtos
                    WHERE hub_id IN (${hubIdList.join(',')}) AND tray_store_id = ${storeId} AND tray_product_id > 0
                    ORDER BY tray_product_id ASC`;
                    Connect_1.default.query(sql, (erro, resultado) => {
                        if (erro) {
                            resolve([]);
                        }
                        else {
                            const list = resultado === null || resultado === void 0 ? void 0 : resultado.map((result) => {
                                return result.tray_product_id;
                            });
                            resolve(list);
                        }
                    });
                });
            }
            async function deleteTrayloop(list, index) {
                return new Promise(async (resolve, reject) => {
                    if (list.length > index) {
                        await TrayProducts_1.default.delete(await storeCredentials, list[index]);
                        await ProductDataBase_1.default.updatePricing({ tray_product_id: 0 }, `tray_product_id = ${list[index]} AND tray_store_id = ${storeId}`)
                            .catch(erro => { console.log(erro); });
                        await ProductDataBase_1.default.updateKitRules({ tray_product_id: 0 }, `tray_product_id = ${list[index]}`)
                            .catch(erro => { console.log(erro); });
                        await ProductDataBase_1.default.updateKitRules({ tray_product_parent_id: 0 }, `tray_product_parent_id = ${list[index]}`)
                            .catch(erro => { console.log(erro); });
                        setTimeout(() => {
                            resolve(deleteTrayloop(list, index + 1));
                        }, 300);
                    }
                    else {
                        resolve();
                    }
                });
            }
        });
    }
    async kitTray(trayPricingId, storeId) {
        return new Promise(async (resolve, reject) => {
            const storeCredentials = OAuth2Tray_1.default.getStoreCredentials(storeId);
            const pricingDb = await ProductDataBase_1.default.getPricing({ tray_pricing_id: trayPricingId }, true, storeId)
                .catch(erro => {
                reject(erro);
                return null;
            });
            if (pricingDb == null) {
                return;
            }
            const trayDelete = await TrayProducts_1.default.delete(await storeCredentials, pricingDb.tray_product_id)
                .then(response => {
                return true;
            })
                .catch(erro => {
                reject(erro);
            });
            if (trayDelete == true) {
                const updatedPricing = ProductDataBase_1.default.updatePricing({ tray_product_id: 0 }, `tray_pricing_id = ${trayPricingId}`)
                    .then(response => {
                    return true;
                })
                    .catch(erro => {
                    return erro;
                });
                const updatedRules = ProductDataBase_1.default.updateKitRules({ tray_product_parent_id: 0 }, `tray_pricing_id = ${trayPricingId}`)
                    .then(response => {
                    return true;
                })
                    .catch(erro => {
                    return erro;
                });
                if (await updatedRules == true && await await updatedRules == true) {
                    resolve();
                }
                else {
                    reject(`pricing - ${updatedPricing}, rules - ${updatedRules} `);
                }
            }
            else {
                return;
            }
        });
    }
}
exports.default = new Delete;
