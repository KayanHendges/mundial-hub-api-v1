"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_1 = __importDefault(require("./api/products"));
const auth_1 = __importDefault(require("./api/auth"));
const users_1 = __importDefault(require("./api/users"));
const categories_1 = __importDefault(require("./api/categories"));
const freight_1 = __importDefault(require("./api/freight"));
const providers_1 = __importDefault(require("./api/providers"));
const test_1 = __importDefault(require("./api/test"));
const mainRouter = (0, express_1.Router)();
mainRouter.use(products_1.default);
mainRouter.use(categories_1.default);
mainRouter.use(auth_1.default);
mainRouter.use(users_1.default);
mainRouter.use(providers_1.default);
mainRouter.use(freight_1.default);
mainRouter.use(test_1.default);
// mainRouter.get('/temp/test', temp.Temp)
exports.default = mainRouter;
