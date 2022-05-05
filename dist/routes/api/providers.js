"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const List_1 = __importDefault(require("../../controllers/Products/List"));
const ProductController_1 = __importDefault(require("../../controllers/Providers/ProductController"));
const ProviderController_1 = __importDefault(require("../../controllers/Providers/ProviderController"));
const providersRouter = (0, express_1.Router)();
providersRouter.get('/providers/list', ProviderController_1.default.getProviders);
// providersRouter.get('/providers/convert-product/local', ProductController.ConvertProductsLocal)
providersRouter.get('/providers/convert-product/luper', ProductController_1.default.ConvertProductsLuper);
providersRouter.get('/providers/convert-product/roddar', ProductController_1.default.ConvertProductsRoddar);
providersRouter.get('/providers/convert-product/duncan', ProductController_1.default.ConvertProductsDuncan);
providersRouter.get('/providers/link/:provider_id', ProviderController_1.default.productsNotLinked);
providersRouter.get('/providers/link-products', List_1.default.listToLinkProviders);
providersRouter.post('/providers/link-products', ProviderController_1.default.handleProductsNotLinked);
providersRouter.get('/providers/products/list/:provider_id', ProductController_1.default.listProviderProducts);
providersRouter.get('/providers/stock/list/:hub_id', ProductController_1.default.listProvidersByHubId);
providersRouter.get('/providers/products/', ProductController_1.default.providerProductsByRef);
providersRouter.post('/providers/products/edit', ProductController_1.default.editProviderProduct);
exports.default = providersRouter;
