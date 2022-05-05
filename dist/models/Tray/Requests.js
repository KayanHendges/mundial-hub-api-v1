"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const Connect_1 = __importDefault(require("../../database/Connect"));
class Requests {
    saveRequest(query) {
        const datetime = (0, date_fns_1.addHours)(new Date(), -3);
        const values = {
            query_time: datetime,
            query: query
        };
        const sql = `INSERT INTO requisições_tray SET ?`;
        Connect_1.default.query(sql, values, (erro, resultado) => {
            if (erro) {
                console.log('erro ao salvar request');
                console.log(erro);
            }
        });
    }
    async resetCountRequests() {
        return new Promise(async (resolve) => {
            const sql = `TRUNCATE TABLE requisições_tray`;
            Connect_1.default.query(sql, (erro, resultado) => {
                if (erro) {
                    console.log(erro);
                    resolve();
                }
                else {
                    console.log(`logs de requisições da Tray excluídas`, resultado);
                    resolve();
                }
            });
        });
    }
}
exports.default = new Requests;
