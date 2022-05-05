"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Connect_1 = __importDefault(require("../../database/Connect"));
class Providers {
    async getAllProviders() {
        const providers = await getProviders();
        return providers;
        async function getProviders() {
            return new Promise(resolve => {
                const sql = 'SELECT provider_id, provider_name FROM providers';
                Connect_1.default.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                    }
                    else {
                        resolve(resultado);
                    }
                });
            });
        }
    }
}
exports.default = Providers;
