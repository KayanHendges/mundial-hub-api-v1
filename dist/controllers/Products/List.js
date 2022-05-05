"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Products_1 = __importDefault(require("../../models/Products/Products"));
const List_1 = __importDefault(require("../../models/Products/List"));
const Connect_1 = __importDefault(require("../../database/Connect"));
exports.default = {
    async unitary(req, res) {
        const { reference } = req.params;
        if (reference) {
            List_1.default.unitary(reference)
                .then(response => {
                res.status(200).json({
                    code: 200,
                    details: response.details,
                    pricing: response.pricing
                });
            })
                .catch(erro => {
                res.status(400).json({
                    code: 400,
                    message: erro
                });
            });
        }
        else {
            res.status(400).json({
                code: 400,
                message: 'está faltando a referencia no body'
            });
        }
    },
    async unitaryByTrayId(req, res) {
        const { tray_id, store_id } = req.query;
        if (tray_id && store_id) {
            const sql = `SELECT p.hub_id
      FROM produtos p JOIN tray_produtos tp ON p.hub_id = tp.hub_id
      WHERE tp.tray_product_id = ${tray_id} and tp.tray_store_id = ${store_id}`;
            Connect_1.default.query(sql, (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(400).json({
                        code: 400,
                        message: 'error getting product from database'
                    });
                }
                else {
                    if (result.length > 0) {
                        res.json({
                            hub_id: result[0].hub_id
                        });
                    }
                    else {
                        res.status(404).json({
                            code: 404,
                            message: 'any product found in database'
                        });
                    }
                }
            });
        }
        else {
            res.status(400).json({
                code: 400,
                message: 'está faltando a referencia'
            });
        }
    },
    async kits(req, res) {
        const { reference } = req.params;
        if (reference) {
            List_1.default.kits(reference)
                .then(response => {
                res.status(200).json({
                    code: 200,
                    kits: response
                });
            })
                .catch(erro => {
                res.status(400).json({
                    code: 400,
                    message: erro
                });
            });
        }
        else {
            res.status(400).json({
                code: 400,
                message: 'está faltando a referencia no body'
            });
        }
    },
    async list(req, res) {
        const { query } = req;
        if (query.search != undefined) {
            List_1.default.list(query, res);
        }
        else {
            res.status(400).json({
                code: 400,
                message: 'é preciso ser enviado parametros para busca'
            });
        }
    },
    async listToLinkProviders(req, res) {
        const { query } = req;
        if (query.query != undefined) {
            List_1.default.listToLinkProviders(query.query, res);
        }
        else {
            res.status(400).json({
                code: 400,
                message: 'é preciso ser enviado parametros para busca'
            });
        }
    },
    async updateImages(req, res) {
        const { params } = req;
        console.log(params);
        if (params.reference) {
            Products_1.default.updateImages(params.reference, res);
        }
    },
    async kitsByRef(req, res) {
        const { params } = req;
        if (params.reference != undefined) {
            List_1.default.kitsByRef(params.reference, res);
        }
    },
    async deleteNoStockTray(req, res) {
        List_1.default.deleteNoStockTray(res);
    }
};
