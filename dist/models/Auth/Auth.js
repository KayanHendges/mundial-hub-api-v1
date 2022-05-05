"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const Connect_1 = __importDefault(require("../../database/Connect"));
const jsonwebtoken_1 = require("jsonwebtoken");
const uuid_1 = require("uuid");
class Auth {
    async login(user, password, res) {
        console.log(user, password);
        const userResponse = await getUserDB(user, password);
        const refreshId = (0, uuid_1.v4)();
        const expiresIn = (0, date_fns_1.addHours)(new Date(), 0);
        await saveRefreshTokenDB(userResponse.username, refreshId, expiresIn);
        const token = (0, jsonwebtoken_1.sign)({}, "cf2dd495-ea1f-49cf-be17-52d23d900e71", {
            subject: "mundialpneumaticos",
            expiresIn: "14400s"
        });
        res.status(200).json({
            token: token,
            userResponse: {
                name: userResponse.name
            },
            refreshToken: {
                refreshId: refreshId,
                expiresIn: expiresIn
            }
        });
        async function getUserDB(user, password) {
            return new Promise(resolve => {
                const sql = `SELECT name, username
                FROM users WHERE username like '${user}' AND password like '${password}'`;
                Connect_1.default.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                    }
                    else {
                        if (resultado.length > 0) {
                            resolve(resultado[0]);
                        }
                        else {
                            res.status(401).json({
                                code: 401,
                                message: 'Usuário e senha inválidos'
                            });
                        }
                    }
                });
            });
        }
        async function saveRefreshTokenDB(username, refreshId, expiresIn) {
            return new Promise(resolve => {
                const refreshToken = {
                    refresh_token: refreshId,
                    expires_in: (0, date_fns_1.addHours)(expiresIn, 3),
                };
                const sql = `UPDATE users SET ? 
                WHERE username like '${username}'`;
                Connect_1.default.query(sql, refreshToken, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                    }
                    else {
                        resolve();
                    }
                });
            });
        }
    }
    async checkToken(name, res) {
        const user = await getUserDB(name);
        res.status(200).json({
            code: 200,
            userResponse: {
                name: user.name
            },
            refreshToken: {
                refreshId: user.refresh_token,
                expiresIn: user.expires_in
            }
        });
        async function getUserDB(name) {
            return new Promise(resolve => {
                const sql = `SELECT name, refresh_token, expires_in
                FROM users WHERE name like '${name}'`;
                Connect_1.default.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                    }
                    else {
                        if (resultado.length > 0) {
                            resolve(resultado[0]);
                        }
                        else {
                            res.status(401).json({
                                code: 401,
                                message: 'Usuário inválido'
                            });
                        }
                    }
                });
            });
        }
    }
    async refreshToken(name, refreshToken, res) {
        const refreshTokenDB = await getRefreshTokenDB(name, refreshToken);
        const expirationTime = (0, date_fns_1.differenceInSeconds)(refreshTokenDB.expires_in, (0, date_fns_1.addHours)(new Date(), -3));
        if (expirationTime > 0) {
            const token = (0, jsonwebtoken_1.sign)({}, "cf2dd495-ea1f-49cf-be17-52d23d900e71", {
                subject: "mundialpneumaticos",
                expiresIn: "20s"
            });
            const refreshId = (0, uuid_1.v4)();
            const expiresIn = (0, date_fns_1.addHours)(new Date(), 0);
            await saveRefreshTokenDB(refreshTokenDB.username, refreshId, expiresIn);
            res.status(200).json({
                code: 200,
                message: 'Token e refresh token atualizados',
                token: token,
                userResponse: {
                    name: refreshTokenDB.name
                },
                refreshToken: {
                    refreshId: refreshId,
                    expiresIn: expiresIn
                }
            });
        }
        else {
            res.status(401).json({
                code: 401,
                message: 'Refresh Token expirado'
            });
        }
        async function getRefreshTokenDB(name, refreshToken) {
            return new Promise(resolve => {
                const sql = `SELECT name, username, refresh_token, expires_in
                FROM users WHERE refresh_token like '${refreshToken}' AND name like '${name}'`;
                Connect_1.default.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                    }
                    else {
                        if (resultado.length > 0) {
                            resultado[0].expires_in = (0, date_fns_1.addHours)(resultado[0].expires_in, -3);
                            resolve(resultado[0]);
                        }
                        else {
                            res.status(401).json({
                                code: 401,
                                message: 'Refresh Token inválido'
                            });
                        }
                    }
                });
            });
        }
        async function saveRefreshTokenDB(username, refreshId, expiresIn) {
            return new Promise(resolve => {
                const refreshToken = {
                    refresh_token: refreshId,
                    expires_in: (0, date_fns_1.addHours)(expiresIn, 3),
                };
                const sql = `UPDATE users SET ? 
                WHERE username like '${username}'`;
                Connect_1.default.query(sql, refreshToken, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                    }
                    else {
                        resolve();
                    }
                });
            });
        }
    }
}
exports.default = Auth;
