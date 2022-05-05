"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Create_1 = __importDefault(require("../../controllers/Products/Create"));
const Delete_1 = __importDefault(require("../../controllers/Products/Delete"));
const Edit_1 = __importDefault(require("../../controllers/Products/Edit"));
const Google_1 = __importDefault(require("../../controllers/Products/Google"));
const List_1 = __importDefault(require("../../controllers/Products/List"));
const Page_1 = __importDefault(require("../../controllers/Products/Page"));
const productsRoutes = (0, express_1.Router)();
productsRoutes.get('/products/list', List_1.default.list);
productsRoutes.get('/products/list/kits/:reference', List_1.default.kitsByRef);
productsRoutes.post('/products/update-images/:reference', List_1.default.updateImages);
productsRoutes.get('/products/page/:reference', Page_1.default.unitary);
productsRoutes.get('/products/page/kits/:reference', Page_1.default.kits);
productsRoutes.get('/products/page/categories/list', Page_1.default.categories);
productsRoutes.get('/products/reference', Page_1.default.lastReference);
productsRoutes.get('/products/model-suggestion', Page_1.default.modelSuggestion);
productsRoutes.post('/products/page/kits', Page_1.default.createKits); // excluir depois
productsRoutes.patch('/products/:reference', Page_1.default.edit);
productsRoutes.delete('/products/:reference', Page_1.default.delete);
// get
productsRoutes.get('/products/unitary/:reference', List_1.default.unitary);
productsRoutes.get('/products/kits/:reference', List_1.default.kits);
productsRoutes.get('/products/unitary-by-tray-id', List_1.default.unitaryByTrayId); // temporário para uso da api v2
// create 
productsRoutes.post('/products/create/unitary', Create_1.default.unitary);
productsRoutes.post('/products/create/pricing', Create_1.default.pricing);
productsRoutes.post('/products/create/pricing/kit', Create_1.default.kitPricingRule);
productsRoutes.post('/products/create/unitary-tray', Create_1.default.unitaryTray);
productsRoutes.post('/products/create/kit-tray', Create_1.default.kitTray);
// edit 
productsRoutes.post('/products/edit/unitary', Edit_1.default.unitary);
productsRoutes.post('/products/edit/pricing', Edit_1.default.pricing);
productsRoutes.post('/products/edit/pricing/kit', Edit_1.default.kitPricingRules);
productsRoutes.post('/products/edit/unitary-tray', Edit_1.default.unitaryTray);
productsRoutes.post('/products/edit/kit-tray', Edit_1.default.kitTray);
// delete
productsRoutes.post('/products/delete/kit', Delete_1.default.kit);
productsRoutes.post('/products/delete/unitary-tray', Delete_1.default.unitaryTray);
productsRoutes.post('/products/delete/kit-tray', Delete_1.default.kitTray);
// xml products
productsRoutes.get('/products/xml', Google_1.default.Xml);
exports.default = productsRoutes;
