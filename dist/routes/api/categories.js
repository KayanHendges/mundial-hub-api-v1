"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const List_1 = __importDefault(require("../../controllers/Categories/List"));
const Page_1 = __importDefault(require("../../controllers/Categories/Page"));
const categoriesRoutes = (0, express_1.Router)();
categoriesRoutes.get('/categories/:id', Page_1.default.getById);
categoriesRoutes.get('/categories/list/all', List_1.default.all);
categoriesRoutes.post('/categories/', Page_1.default.createCategory);
categoriesRoutes.post('/categories/subcategory/:parent_id', Page_1.default.createSubcategory);
categoriesRoutes.patch('/categories/', Page_1.default.editCategory);
categoriesRoutes.delete('/categories/:hub_id', Page_1.default.deleteCategory);
exports.default = categoriesRoutes;
