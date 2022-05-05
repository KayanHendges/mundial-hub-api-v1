"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OAuth2Tray_1 = __importDefault(require("../../models/Auth/OAuth2Tray"));
const TrayProducts_1 = __importDefault(require("../Tray/TrayProducts"));
const ProductDataBase_1 = __importDefault(require("./ProductDataBase"));
const Validate_1 = __importDefault(require("./Validate"));
class Product {
    async createUnitary(values, res) {
        const MundialCredentials = await OAuth2Tray_1.default.getStoreCredentials(668385);
        const ScPneusCredentials = await OAuth2Tray_1.default.getStoreCredentials(1049898);
        const unitary = await Validate_1.default.unitary(values);
        const unitaryMundialId = TrayProducts_1.default.createUnitary(MundialCredentials, Object.assign(Object.assign({}, unitary.details), unitary.pricing.mundial))
            .catch(erro => {
            res.status(400).json({
                code: 400,
                message: erro
            });
            return 0;
        });
        // Sem await para fazer mais de uma operação síncrona
        const unitaryScPneusId = TrayProducts_1.default.createUnitary(ScPneusCredentials, Object.assign(Object.assign({}, unitary.details), unitary.pricing.scpneus))
            .catch(erro => {
            res.status(400).json({
                code: 400,
                message: erro
            });
            return 0;
        });
        // Sem await para fazer mais de uma operação síncrona
        if (await unitaryMundialId == 0 && await unitaryScPneusId == 0) { }
        const unitaryHubId = await ProductDataBase_1.default.insert(unitary.details)
            .catch(erro => {
            res.status(400).json({ code: 400, message: erro });
            return 0;
        });
        if (unitaryHubId == 0) { }
        const pricingMundialId = ProductDataBase_1.default.insertPricing(Object.assign(Object.assign({}, unitary.pricing.mundial), { hub_id: unitaryHubId, tray_product_id: await unitaryMundialId }), MundialCredentials)
            .catch(erro => {
            res.status(400).json({ code: 400, message: erro });
            return 0;
        });
        // Sem await para fazer mais de uma operação síncrona
        const pricingScPneusId = ProductDataBase_1.default.insertPricing(Object.assign(Object.assign({}, unitary.pricing.scpneus), { hub_id: unitaryHubId, tray_product_id: await unitaryScPneusId }), ScPneusCredentials)
            .catch(erro => {
            res.status(400).json({ code: 400, message: erro });
            return 0;
        });
        // Sem await para fazer mais de uma operação síncrona
        if (await pricingMundialId == 0 && await pricingScPneusId == 0) { }
        return {
            hub_id: unitaryHubId,
            tray_product_id: await unitaryMundialId
        };
    }
    async createKit(values, unitaryPricing, trayChildrenId, res) {
        const MundialCredentials = await OAuth2Tray_1.default.getStoreCredentials(668385);
        const kit = await Validate_1.default.kit(values, unitaryPricing);
        const trayId = await TrayProducts_1.default.createKit(MundialCredentials, Object.assign(Object.assign({}, kit.details), kit.pricing.mundial))
            .catch(erro => {
            res.status(400).json({
                code: 400,
                message: erro
            });
            return 0;
        });
        if (trayId == 0) { }
        const hubId = await ProductDataBase_1.default.insert(kit.details)
            .catch(erro => {
            res.status(400).json({ code: 400, message: erro });
            return 0;
        });
        if (hubId == 0) { }
        const pricingId = await ProductDataBase_1.default.insertPricing(Object.assign(Object.assign({}, kit.pricing.mundial), { hub_id: hubId, tray_product_id: trayId }), MundialCredentials)
            .catch(erro => {
            res.status(400).json({ code: 400, message: erro });
            return 0;
        });
        if (pricingId == 0) { }
        const rulesTray = TrayProducts_1.default.createKitRule(MundialCredentials, Object.assign(Object.assign({}, kit.rules), { tray_product_id: trayChildrenId, tray_product_parent_id: trayId }))
            .then(response => { return true; })
            .catch(erro => {
            res.status(400).json({ code: 400, message: erro });
            return 0;
        });
        const kitRulesId = ProductDataBase_1.default.insertKitRules(Object.assign(Object.assign(Object.assign({}, kit.rules), kit.pricing.mundial), { hub_id: hubId, tray_pricing_id: pricingId, tray_product_id: trayChildrenId, tray_product_parent_id: trayId, kit_price: kit.pricing.mundial.tray_promotional_price == 0 ?
                kit.pricing.mundial.tray_price : kit.pricing.mundial.tray_promotional_price }))
            .catch(erro => {
            res.status(400).json({ code: 400, message: erro });
            return false;
        });
        if (await kitRulesId == 0 && await rulesTray == false) { }
        return {
            hub_id: hubId,
            tray_product_id: trayId
        };
    }
}
exports.default = new Product;
