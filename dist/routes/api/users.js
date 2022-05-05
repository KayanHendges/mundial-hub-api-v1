"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Users_1 = __importDefault(require("../../controllers/Users/Users"));
const usersRouter = (0, express_1.Router)();
usersRouter.get('/users/tray-requests', Users_1.default.trayRequests);
usersRouter.get('/users/tray-products', Users_1.default.trayProductsAmount);
exports.default = usersRouter;
