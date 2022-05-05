"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OAuth2Tray_1 = __importDefault(require("../../../models/Auth/OAuth2Tray"));
const sleep_1 = __importDefault(require("../../sleep"));
const TrayProducts_1 = __importDefault(require("../../Tray/TrayProducts"));
const ProductDataBase_1 = __importDefault(require("../ProductDataBase"));
const Validate_1 = __importDefault(require("../Validate"));
class EditProduct {
    async unitary(values, hubId) {
        return new Promise(async (resolve, reject) => {
            const unitary = await Validate_1.default.hubProduct(values);
            await ProductDataBase_1.default.updateProduct(Object.assign(Object.assign({}, unitary), { hub_id: hubId }))
                .then(response => {
                resolve();
            })
                .catch(erro => {
                reject(erro);
            });
        });
    }
    async pricing(values, trayPricingId, storeId) {
        return new Promise(async (resolve, reject) => {
            const pricing = await Validate_1.default.createPricing(values, storeId);
            await ProductDataBase_1.default.updatePricing(Object.assign(Object.assign({}, pricing), { tray_product_id: undefined }), `tray_pricing_id = ${trayPricingId}`)
                .then(response => {
                resolve();
            })
                .catch(erro => {
                reject(erro);
            });
        });
    }
    async kitPricingRules(pricing, kitRules, trayPricingId) {
        return new Promise(async (resolve, reject) => {
            const validatedPricing = Validate_1.default.createKitPricing(pricing, kitRules);
            const updatedPricing = ProductDataBase_1.default.updatePricing(Object.assign(Object.assign({}, await validatedPricing), { tray_product_id: undefined }), `tray_pricing_id = ${trayPricingId}`)
                .then(response => { return true; })
                .catch(erro => {
                reject(erro);
                return erro;
            });
            const updatedRules = ProductDataBase_1.default.updateKitRules(kitRules, `tray_pricing_id = ${trayPricingId}`)
                .then(response => { return true; })
                .catch(erro => {
                reject(erro);
                return erro;
            });
            if (await updatedPricing == true && await updatedRules == true) {
                resolve();
            }
            else {
                reject(`pricing = ${updatedPricing}, rules: ${updatedRules}`);
            }
        });
    }
    async unitaryTray(details, pricing, trayId, storeId) {
        return new Promise(async (resolve, reject) => {
            const storeCredentials = OAuth2Tray_1.default.getStoreCredentials(storeId);
            const unitary = Validate_1.default.hubProduct(details);
            const unitaryPricing = Validate_1.default.createPricing(pricing, storeId);
            await TrayProducts_1.default.updateProduct(await storeCredentials, Object.assign(Object.assign({}, await unitary), await unitaryPricing), trayId)
                .then(response => {
                resolve();
            })
                .catch(erro => {
                reject(erro);
            });
        });
    }
    async kitTray(details, pricing, rules, storeId) {
        return new Promise(async (resolve, reject) => {
            const storeCredentials = OAuth2Tray_1.default.getStoreCredentials(storeId);
            const product = Validate_1.default.hubProduct(details);
            const productPricing = Validate_1.default.createKitPricing(pricing, rules);
            await Promise.all([storeCredentials, product, productPricing]);
            const trayProductId = await productPricing;
            const updatedProduct = TrayProducts_1.default.updateProduct(await storeCredentials, Object.assign(Object.assign({}, await product), await productPricing), trayProductId.tray_product_id)
                .then(response => {
                return true;
            })
                .catch(erro => {
                return erro;
            });
            const childrenTrayId = await ProductDataBase_1.default.getKitRules({ tray_pricing_id: pricing.tray_pricing_id }, true)
                .then(response => {
                return response.tray_product_id;
            })
                .catch(erro => {
                console.log('opa');
                reject(erro);
                return null;
            });
            if (childrenTrayId == null) {
                return;
            }
            await (0, sleep_1.default)(310);
            const updatedRules = TrayProducts_1.default.updateKitRules(await storeCredentials, Object.assign(Object.assign({}, rules), { tray_product_parent_id: trayProductId.tray_product_id, tray_product_id: childrenTrayId }))
                .then(response => {
                return true;
            })
                .catch(erro => {
                return erro;
            });
            if (await updatedProduct == true && await updatedRules == true) {
                resolve();
            }
            else {
                reject(`product = ${JSON.stringify(await updatedProduct)}, rules: ${JSON.stringify(await updatedRules)}`);
            }
        });
    }
}
exports.default = new EditProduct;
