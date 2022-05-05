"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const Connect_1 = __importDefault(require("../../database/Connect"));
const OAuth2Tray_1 = __importDefault(require("../Auth/OAuth2Tray"));
class Users {
    async getCountRequestsTray(res) {
        const requests = await getCount();
        res.status(200).json({
            code: 200,
            requests: requests
        });
        function getCount() {
            return new Promise(resolve => {
                const sql = `SELECT COUNT(request_id) FROM requisições_tray 
                WHERE query LIKE '%mundialpneumaticos%'`;
                Connect_1.default.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                    }
                    else {
                        const result = resultado[0];
                        resolve(result['COUNT(request_id)']);
                    }
                });
            });
        }
    }
    async getProductsAmount(storeId) {
        return new Promise(async (resolve, reject) => {
            const trayCredentials = await OAuth2Tray_1.default.getStoreCredentials(storeId)
                .catch(erro => {
                reject(erro);
                return null;
            });
            if (trayCredentials == null) {
                return;
            }
            const totalProducts = await getTrayProductsAmount(trayCredentials);
            resolve({
                total: totalProducts
            });
            async function getTrayProductsAmount(storeCredentials) {
                return new Promise(async (resolve, reject) => {
                    const query = `${storeCredentials.api_address}/products/`;
                    axios_1.default.get(query)
                        .then(response => {
                        var _a;
                        const responseTray = response.data;
                        if ((_a = responseTray === null || responseTray === void 0 ? void 0 : responseTray.paging) === null || _a === void 0 ? void 0 : _a.total) {
                            resolve(responseTray.paging.total);
                        }
                        else {
                            reject('tray não retornou o total de produtos');
                        }
                    })
                        .catch(erro => {
                        if (erro.response.data.causes) {
                            reject(JSON.stringify(erro.response.data.causes));
                        }
                        else {
                            Error(erro);
                            reject('erro ao fazer a requisição a Tray');
                        }
                    });
                });
            }
        });
    }
}
exports.default = new Users;
