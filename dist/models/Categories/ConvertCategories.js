"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Connect_1 = __importDefault(require("../../database/Connect"));
class ConvertCategories {
    async hubMainCategoryToTray(id, store) {
        return new Promise(async (resolve) => {
            if (store == 668385) {
                const sql = `SELECT tray_category_id FROM categorias WHERE hub_category_id=${id}`;
                Connect_1.default.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                    }
                    else {
                        if (resultado.length > 0) {
                            resolve(Math.floor(resultado[0].tray_category_id));
                        }
                        else {
                            resolve(1);
                        }
                    }
                });
            }
            if (store == 1049898) {
                const sql = `SELECT tray_scpneus_category_id FROM categorias WHERE hub_category_id=${id}`;
                Connect_1.default.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                    }
                    else {
                        if (resultado.length > 0) {
                            resolve(Math.floor(resultado[0].tray_scpneus_category_id));
                        }
                        else {
                            resolve(2163);
                        }
                    }
                });
            }
        });
    }
    async trayMainCategoryToHub(id, store) {
        return new Promise(async (resolve) => {
            const sql = sqlStore();
            function sqlStore() {
                if (store == 668385) {
                    return `SELECT hub_category_id FROM categorias WHERE tray_category_id=${id}`;
                }
                if (store == 1049898) {
                    return `SELECT hub_category_id FROM categorias WHERE tray_scpneus_category_id=${id}`;
                }
            }
            Connect_1.default.query(sql, (erro, resultado) => {
                if (erro) {
                    console.log(erro);
                }
                else {
                    if (resultado.length > 0) {
                        resolve(Math.floor(resultado[0].hub_category_id));
                    }
                    else {
                        resolve(0);
                    }
                }
            });
        });
    }
    async trayRelatedCategoriesToHub(array, store) {
        return new Promise(async (resolve) => {
            const sql = sqlStore();
            function sqlStore() {
                if (store == 668385) {
                    return `SELECT hub_category_id FROM categorias WHERE tray_category_id IN (${array.toString()}) ORDER BY hub_category_id ASC`;
                }
                if (store == 1049898) {
                    return `SELECT hub_category_id FROM categorias WHERE tray_scpneus_category_id IN (${array.toString()}) ORDER BY hub_category_id ASC`;
                }
            }
            Connect_1.default.query(sql, (erro, resultado) => {
                if (erro) {
                    console.log(erro);
                }
                else {
                    if (resultado.length > 0) {
                        const resultList = [];
                        resultado.map(result => {
                            resultList.push(Math.floor(result.hub_category_id));
                        });
                        resolve(resultList);
                    }
                    else
                        [
                            resolve([])
                        ];
                }
            });
        });
    }
    async hubRelatedCategoriesToTray(array, store) {
        return new Promise(async (resolve) => {
            if (store == 668385) {
                const sql = `SELECT tray_category_id FROM categorias WHERE hub_category_id IN (${array.toString()}) ORDER BY tray_category_id ASC`;
                Connect_1.default.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                    }
                    else {
                        if (resultado.length > 0) {
                            const resultList = [];
                            resultado.map(result => {
                                resultList.push(Math.floor(result.tray_category_id));
                            });
                            resolve(resultList);
                        }
                        else {
                            resolve([]);
                        }
                    }
                });
            }
            if (store == 1049898) {
                const sql = `SELECT tray_scpneus_category_id FROM categorias WHERE hub_category_id IN (${array.toString()}) ORDER BY tray_scpneus_category_id ASC`;
                Connect_1.default.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                    }
                    else {
                        if (resultado.length > 0) {
                            const resultList = [];
                            resultado.map(result => {
                                resultList.push(Math.floor(result.tray_scpneus_category_id));
                            });
                            resolve(resultList);
                        }
                        else {
                            resolve([]);
                        }
                    }
                });
            }
        });
    }
}
exports.default = new ConvertCategories;
