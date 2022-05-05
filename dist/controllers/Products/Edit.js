"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Product_1 = __importDefault(require("../../services/Products/Edit/Product"));
exports.default = {
    async unitary(req, res) {
        const { body } = req;
        if (body.product && body.hub_id) {
            await Product_1.default.unitary(body.product, body.hub_id)
                .then(response => {
                res.status(201).json({
                    code: 201,
                    message: 'Produto editado com sucesso'
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
                message: 'está faltando o produto no body ou o hub_id'
            });
        }
    },
    async pricing(req, res) {
        const { body } = req;
        console.log(body);
        if (body.pricing && body.tray_pricing_id && body.store_id) {
            await Product_1.default.pricing(body.pricing, body.tray_pricing_id, body.store_id)
                .then(response => {
                res.status(201).json({
                    code: 201,
                    message: 'Produto editado com sucesso'
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
                message: 'está faltando o pricing no body ou o pricing_id'
            });
        }
    },
    async kitPricingRules(req, res) {
        const { body } = req;
        if (body.pricing && body.rules && body.tray_pricing_id) {
            await Product_1.default.kitPricingRules(body.pricing, body.rules, body.tray_pricing_id)
                .then(response => {
                res.status(201).json({
                    code: 201,
                    message: 'Produto editado com sucesso'
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
                message: 'está faltando o produto no body ou o hub_id'
            });
        }
    },
    async unitaryTray(req, res) {
        const { body } = req;
        if (body.details && body.pricing && body.tray_id && body.store_id) {
            await Product_1.default.unitaryTray(body.details, body.pricing, body.tray_id, body.store_id)
                .then(response => {
                res.status(201).json({
                    code: 201,
                    message: 'Produto editado com sucesso'
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
                message: 'está faltando o produto no body ou o hub_id'
            });
        }
    },
    async kitTray(req, res) {
        const { body } = req;
        if (body.details && body.pricing && body.rules && body.store_id) {
            await Product_1.default.kitTray(body.details, body.pricing, body.rules, body.store_id)
                .then(response => {
                res.status(201).json({
                    code: 201,
                    message: 'Produto editado com sucesso'
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
                message: 'está faltando o produto no body ou o hub_id'
            });
        }
    },
};
