"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Freight_1 = __importDefault(require("../../models/Freight/Freight"));
exports.default = {
    async freight(req, res) {
        console.log(req.query);
        const params = req.query;
        console.log('================================');
        console.log(params);
        if (params.token != undefined) {
            console.log('passou');
            Freight_1.default.freteTray(params, res);
        }
        else {
            if (params.storeQualifierId != undefined) {
                Freight_1.default.freteViaVarejo(params, res);
            }
            else {
                console.log('está faltando parametros');
                res.status(400).json({
                    code: 400,
                    message: "está faltando parametros"
                });
            }
        }
    },
};
