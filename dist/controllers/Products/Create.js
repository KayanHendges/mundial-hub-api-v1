"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Product_1 = __importDefault(require("../../services/Products/Create/Product"));
exports.default = {
    async unitary(req, res) {
        const { body } = req;
        if (body.product) {
            await Product_1.default.createUnitary(body.product)
                .then(response => {
                res.status(201).json({
                    code: 201,
                    hub_id: response,
                    message: 'Produto criado com sucesso'
                });
            })
                .catch(error => {
                res.status(400).json({
                    code: 400,
                    message: `erro: ${error}`
                });
            });
        }
        else {
            res.status(400).json({
                code: 400,
                message: 'está faltando o produto no body'
            });
        }
    },
    async pricing(req, res) {
        const { body } = req;
        if (body.pricing && body.store_id && body.pricing.hub_id != undefined) {
            await Product_1.default.createPricing(body.pricing, body.store_id)
                .then(response => {
                res.status(201).json({
                    code: 201,
                    pricing_id: response,
                    message: 'Pricing criado com sucesso'
                });
            })
                .catch(error => {
                res.status(400).json({
                    code: 400,
                    message: `erro: ${error}`
                });
            });
        }
        else {
            res.status(400).json({
                code: 400,
                message: 'está faltando o pricing, store_id ou hub_id no body'
            });
        }
    },
    async kitPricingRule(req, res) {
        const { body } = req;
        if (body.pricing && body.kit_rules && body.store_id) {
            await Product_1.default.createKitPricingRules(body.pricing, body.kit_rules, body.store_id)
                .then(response => {
                res.status(201).json({
                    code: 201,
                    rules_id: response.rules_id,
                    pricing_id: response.pricing_id,
                    message: 'Pricing e Rule do kit criado com sucesso'
                });
            })
                .catch(error => {
                res.status(400).json({
                    code: 400,
                    message: `erro: ${error}`
                });
            });
        }
        else {
            res.status(400).json({
                code: 400,
                message: 'está faltando o pricing, store_id ou hub_id no body'
            });
        }
    },
    async unitaryTray(req, res) {
        const { body } = req;
        if (body.product && body.pricing && body.tray_pricing_id && body.store_id) {
            await Product_1.default.createTrayUnitary(body.product, body.pricing, body.tray_pricing_id, body.store_id)
                .then(response => {
                res.status(201).json({
                    code: 201,
                    tray_id: response,
                    message: 'Produto criado com sucesso'
                });
            })
                .catch(error => {
                res.status(400).json({
                    code: 400,
                    message: `erro: ${error}`
                });
            });
        }
        else {
            res.status(400).json({
                code: 400,
                message: 'está faltando o produto no body'
            });
        }
    },
    async kitTray(req, res) {
        const { body } = req;
        if (body.product && body.pricing && body.rules && body.tray_pricing_id && body.store_id) {
            await Product_1.default.createTrayKit(body.product, body.pricing, body.rules, body.tray_pricing_id, body.store_id)
                .then(response => {
                res.status(201).json({
                    code: 201,
                    tray_id: response,
                    message: 'kit criado na tray com sucesso'
                });
            })
                .catch(error => {
                res.status(400).json({
                    code: 400,
                    message: `erro: ${error}`
                });
            });
        }
        else {
            res.status(400).json({
                code: 400,
                message: 'está faltando o produto no body'
            });
        }
    },
};
