"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Categories_1 = __importDefault(require("../../models/Categories/Categories"));
const Products_1 = __importDefault(require("../../models/Products/Products"));
exports.default = {
    async unitary(req, res) {
        console.log('unitary');
        const { params } = req;
        console.log(params);
        if (params.reference != undefined) {
            Products_1.default.unitary(params.reference, res);
        }
        else {
            res.status(400).json({ code: 400, message: 'está faltando a referencia do produto' });
        }
    },
    async kits(req, res) {
        console.log('kits');
        const { params } = req;
        if (params.reference != undefined) {
            Products_1.default.kits(params.reference, res);
        }
        else {
            res.status(400).json({ code: 400, message: 'está faltando a referencia do produto' });
        }
    },
    async categories(req, res) {
        Categories_1.default.ProductCategories(res);
    },
    async lastReference(req, res) {
        Products_1.default.lastReference(res);
    },
    async modelSuggestion(req, res) {
        const { query } = req;
        if (query.productName != undefined) {
            Products_1.default.getModelSuggestion(query.productName, res);
        }
        else {
            res.status(400).json({
                code: 400,
                message: "está faltando o product name"
            });
        }
    },
    async create(req, res) {
        const { body } = req;
        if (body.params != undefined) {
            Products_1.default.create(body.params, res);
        }
        else {
            res.status(400).json({
                code: 400,
                message: "está faltando os valores dos produtos nos parametros"
            });
        }
    },
    async createKits(req, res) {
        const { body } = req;
        if (body.params != undefined) {
            Products_1.default.createKits(body.params, res);
        }
        else {
            res.status(400).json({
                code: 400,
                message: "está faltando os valores dos produtos nos parametros"
            });
        }
    },
    async edit(req, res) {
        const { params, body } = req;
        if (params.reference != undefined && body.params != undefined) {
            Products_1.default.edit(body.params, res);
        }
        else {
            res.status(400).json({
                code: 400,
                message: "está faltando a referencia ou os parametros"
            });
        }
    },
    async delete(req, res) {
        const { params } = req;
        if (params.reference != undefined) {
            Products_1.default.delete(params.reference, res);
        }
        else {
            res.status(400).json({
                code: 400,
                message: "está faltando a referencia"
            });
        }
    }
};
