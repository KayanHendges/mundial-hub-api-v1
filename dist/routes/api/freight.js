"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Freight_1 = __importDefault(require("../../controllers/Freight/Freight"));
const freightRouter = (0, express_1.Router)();
freightRouter.get('/frete', Freight_1.default.freight);
exports.default = freightRouter;
