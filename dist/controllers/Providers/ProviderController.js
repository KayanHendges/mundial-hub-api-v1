"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Products_1 = __importDefault(require("../../models/Providers/Products"));
const Providers_1 = __importDefault(require("../../models/Providers/Providers"));
const users = [
    { name: 'Diego', email: 'diego@rocketseat.com.br' },
];
exports.default = {
    async getProviders(req, res) {
        const providers = new Providers_1.default;
        const providerslist = await providers.getAllProviders();
        res.status(200).json({
            code: 200,
            providers_list: providerslist
        });
    },
    async productsNotLinked(req, res) {
        const { params, query } = req;
        if (params.provider_id != undefined && query.param) {
            Products_1.default.getProductsNotLinked(parseInt(params.provider_id), query.param, query.search, res);
        }
        else {
            res.status(400).json({
                code: 400,
                message: 'está faltando o id do fornecedor (provider_id)'
            });
        }
    },
    async handleProductsNotLinked(req, res) {
        const { body } = req;
        if (body.ids != undefined && body.handleFunction != undefined) {
            Products_1.default.handleProductsNotLinked(body.ids, body.handleFunction, res);
        }
        else {
            res.status(400).json({
                code: 400,
                message: 'está faltando os Ids ou a função a ser executada'
            });
        }
    },
};
