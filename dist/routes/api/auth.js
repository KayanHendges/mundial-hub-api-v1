"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_1 = __importDefault(require("../../controllers/Auth/Auth"));
const authRouter = (0, express_1.Router)();
authRouter.post('/auth/login', Auth_1.default.login);
authRouter.get('/auth/check-token', Auth_1.default.checkToken);
authRouter.post('/auth/refresh-token', Auth_1.default.refreshToken);
exports.default = authRouter;
