"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ensureAuthenticated_1 = __importDefault(require("../../middlewares/ensureAuthenticated"));
const Auth_1 = __importDefault(require("../../models/Auth/Auth"));
exports.default = {
    async login(req, res) {
        const { user, password } = req.body.credentials;
        if (user && password) {
            const auth = new Auth_1.default;
            auth.login(user, password, res);
        }
        else {
            res.status(401).json({
                code: 401,
                message: 'Usuário e senha faltando'
            });
        }
    },
    async checkToken(req, res) {
        await (0, ensureAuthenticated_1.default)(req, res);
        const { name } = req.query;
        if (name) {
            const auth = new Auth_1.default;
            auth.checkToken(name, res);
        }
        else {
            res.status(401).json({
                code: 401,
                message: 'O usuário está faltando'
            });
        }
    },
    async refreshToken(req, res) {
        const { name, refresh_token: refreshToken } = req.body.credentials;
        if (name && refreshToken) {
            const auth = new Auth_1.default;
            auth.refreshToken(name, refreshToken, res);
        }
        else {
            res.status(401).json({
                code: 401,
                message: "Está faltando o nome ou o refresh token"
            });
        }
    }
};
