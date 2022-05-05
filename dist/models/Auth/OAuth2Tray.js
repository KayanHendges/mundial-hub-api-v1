"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const date_fns_1 = require("date-fns");
const prismaClient_1 = require("../../database/prismaClient");
const Requests_1 = __importDefault(require("../Tray/Requests"));
class OAuth2Tray {
    async tokenRoutine() {
        const stores = await getStores();
        await expiredTokens(stores)
            .then(response => {
            const date = (0, date_fns_1.addHours)(new Date(), -3);
            console.log("verificações de tokens feitos", date);
        });
        setTimeout(() => {
            this.tokenRoutine();
        }, 1000 * 60 * 30); //30 minutos
        async function getStores() {
            return new Promise(async (resolve, reject) => {
                const stores = await prismaClient_1.prismaClient.store.findMany();
                resolve(stores);
            });
        }
        async function expiredTokens(stores) {
            return new Promise(async (resolve, reject) => {
                const date = (0, date_fns_1.addHours)(new Date(), -3);
                stores.map(async (store) => {
                    if (!store.expirationAccessToken) {
                        return;
                    }
                    const differenceTime = (0, date_fns_1.differenceInMinutes)(store.expirationAccessToken, date);
                    if (differenceTime < 31) {
                        await refreshToken(store);
                    }
                    else {
                        console.log("loja", store.name, differenceTime, "minutos restantes");
                    }
                });
                resolve();
            });
        }
        async function refreshToken(store) {
            return new Promise((resolve, reject) => {
                const query = `${store.apiAddress}/auth?refresh_token=${store.refreshToken}`;
                Requests_1.default.saveRequest(query);
                axios_1.default.get(query)
                    .then(async (response) => {
                    const tokenData = response.data;
                    const sql = `UPDATE credenciais_tray SET access_token='${tokenData.access_token}', refresh_token='${tokenData.refresh_token}', date_expiration_access_token='${response.data.date_expiration_access_token}',
                    date_expiration_refresh_token='${response.data.date_expiration_refresh_token}', date_activated='${response.data.date_activated}' WHERE store=${tokenData.store_id}`;
                    const update = await prismaClient_1.prismaClient.store.update({
                        where: { trayId: store.trayId },
                        data: {
                            accessToken: tokenData.access_token,
                            refreshToken: tokenData.refresh_token,
                            expirationAccessToken: (0, date_fns_1.addHours)((0, date_fns_1.parseISO)(tokenData.date_expiration_access_token), -3),
                            expirationRefreshToken: (0, date_fns_1.addHours)((0, date_fns_1.parseISO)(tokenData.date_expiration_refresh_token), -3),
                            tokenActivated: (0, date_fns_1.addHours)((0, date_fns_1.parseISO)(tokenData.date_activated), -3),
                        }
                    });
                    console.log(update);
                    resolve('sucesso');
                })
                    .catch(erro => console.log(erro.response.data, store.refreshToken));
            });
        }
    }
    async getToken(storeId) {
        return new Promise(async (resolve, reject) => {
            const store = await prismaClient_1.prismaClient.store.findFirst({
                where: { trayId: storeId }
            });
            if (!store) {
                throw new Error(`Any store found with ${storeId} id`);
            }
            resolve({
                credential_id: store.id,
                consumer_key: "",
                consumer_secret: "",
                code: store.oAuth2Code,
                tray_adm_user: store.name,
                store: store.trayId.toString(),
                api_address: store.apiAddress,
                store_host: store.link,
                access_token: store.accessToken,
                refresh_token: store.refreshToken,
                date_expiration_access_token: (0, date_fns_1.format)(store.expirationAccessToken, 'yyyy-MM-ddThh:mm:ss:SSS'),
                date_expiration_refresh_token: (0, date_fns_1.format)(store.expirationRefreshToken, 'yyyy-MM-ddThh:mm:ss:SSS'),
                date_activated: (0, date_fns_1.format)(store.tokenActivated, 'yyyy-MM-ddThh:mm:ss:SSS'),
            });
        });
    }
    async getStoreCredentials(storeId) {
        return new Promise(async (resolve, reject) => {
            const store = await prismaClient_1.prismaClient.store.findFirst({
                where: { trayId: storeId }
            });
            if (!store) {
                throw new Error(`Any store found with ${storeId} id`);
            }
            resolve({
                credential_id: store.id,
                consumer_key: "",
                consumer_secret: "",
                code: store.oAuth2Code,
                tray_adm_user: store.name,
                store: store.trayId.toString(),
                api_address: store.apiAddress,
                store_host: store.link,
                access_token: store.accessToken,
                refresh_token: store.refreshToken,
                date_expiration_access_token: (0, date_fns_1.format)(store.expirationAccessToken, 'yyyy-MM-ddThh:mm:ss:SSS'),
                date_expiration_refresh_token: (0, date_fns_1.format)(store.expirationRefreshToken, 'yyyy-MM-ddThh:mm:ss:SSS'),
                date_activated: (0, date_fns_1.format)(store.tokenActivated, 'yyyy-MM-ddThh:mm:ss:SSS'),
            });
        });
    }
}
exports.default = new OAuth2Tray;
