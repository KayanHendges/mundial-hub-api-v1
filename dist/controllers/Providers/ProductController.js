"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Products_1 = __importDefault(require("../../models/Providers/Products"));
const SaveProducts_1 = __importDefault(require("../../models/Providers/SaveProducts"));
const ConvertProducts_1 = __importDefault(require("../../services/Providers/ConvertProducts"));
exports.default = {
    async ConvertProductsLocal(req, res) {
        const products = await ConvertProducts_1.default.localStock();
        await SaveProducts_1.default.saveProductsDBLocal(products.products, 1, res);
    },
    async ConvertProductsLuper(req, res) {
        const products = ConvertProducts_1.default.luperText('luper_products.txt');
        await SaveProducts_1.default.saveProductsDB(products.products, 2, res);
    },
    async ConvertProductsRoddar(req, res) {
        const hankook = ConvertProducts_1.default.roddarText('roddar_hankook_products.txt');
        const laufenn = ConvertProducts_1.default.roddarText('roddar_laufenn_products.txt');
        const imports = ConvertProducts_1.default.roddarImportsText('roddar_imports_products.txt');
        const products = {
            products: hankook.products.concat(laufenn.products, imports.products)
        };
        await SaveProducts_1.default.saveProductsDB(products.products, 3, res);
    },
    async ConvertProductsDuncan(req, res) {
        const products = ConvertProducts_1.default.duncanText('duncan_products.txt');
        await SaveProducts_1.default.saveProductsDB(products.products, 4, res);
    },
    async listProviderProducts(req, res) {
        const { params, query } = req;
        if (params.provider_id != undefined && query.search != undefined) {
            Products_1.default.listByProviders(parseInt(params.provider_id), query, res);
        }
        else {
            res.status(400).json({
                code: 400,
                message: 'está faltando o id do fornecedor (provider_id) ou parâmetro de pesquisa'
            });
        }
    },
    async listProvidersByHubId(req, res) {
        const { params } = req;
        if (params.hub_id != undefined) {
            Products_1.default.listProvidersByHubId(parseInt(params.hub_id), res);
        }
        else {
            res.status(400).json({
                code: 400,
                message: 'está faltando o hub_id do produto'
            });
        }
    },
    async providerProductsByRef(req, res) {
        const { query } = req;
        if (query.provider_id != undefined && query.product_reference != undefined) {
            Products_1.default.getProviderProductByRef(query.provider_id, query.product_reference, res);
        }
        else {
            res.status(400).json({
                code: 400,
                message: 'está faltando o id do fornecedor (provider_id) ou o id do produto'
            });
        }
    },
    async editProviderProduct(req, res) {
        const { query } = req;
        if (query.providerId != undefined && query.productId != undefined
            && query.field != undefined && query.value != undefined) {
            Products_1.default.editProviderProduct(query.providerId, query.productId, query.field, query.value, res);
        }
        else {
            res.status(400).json({
                code: 400,
                message: 'está faltando parametros'
            });
        }
    }
};
