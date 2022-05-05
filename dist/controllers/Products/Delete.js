"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Delete_1 = __importDefault(require("../../models/Products/Delete"));
exports.default = {
    async kit(req, res) {
        const { body } = req;
        if (body.hub_id) {
            await Delete_1.default.kit(body.hub_id)
                .then(response => {
                res.status(201).json({
                    code: 201,
                    message: 'kit excluído sucesso'
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
                message: 'está faltando o hub_id'
            });
        }
    },
    async unitaryTray(req, res) {
        const { body } = req;
        console.log(body);
        if (body.reference && body.store_id) {
            await Delete_1.default.unitaryTray(body.reference, body.store_id)
                .then(response => {
                res.status(201).json({
                    code: 201,
                    message: 'unitário excluído sucesso'
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
                message: 'está faltando a referencia'
            });
        }
    },
    async kitTray(req, res) {
        const { body } = req;
        if (body.tray_pricing_id && body.store_id) {
            await Delete_1.default.kitTray(body.tray_pricing_id, body.store_id)
                .then(response => {
                res.status(201).json({
                    code: 201,
                    message: 'kit excluído com sucesso na tray'
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
                message: 'está faltando o tray_pricing_id'
            });
        }
    },
};
