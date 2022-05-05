"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class TrayRequestsQueue {
    async newRequest(requestInterval) {
        return new Promise(async (resolve, reject) => {
            const interval = requestInterval ? requestInterval : 340;
            await waitToResolveLoop();
            await setLastRequest(new Date().getTime());
            resolve();
            function setLastRequest(time) {
                return new Promise((resolve, reject) => {
                    fs_1.default.writeFile('./src/services/Tray/lastRequest', time.toString(), { encoding: 'utf8' }, (erro) => {
                        if (erro) {
                            console.log(erro);
                            reject(erro);
                        }
                        else {
                            resolve();
                        }
                    });
                });
            }
            function getLastRequest() {
                return new Promise((resolve, reject) => {
                    fs_1.default.readFile('./src/services/Tray/lastRequest', { encoding: 'utf8' }, (erro, result) => {
                        if (erro) {
                            console.log(erro);
                            reject(erro);
                        }
                        else {
                            resolve(parseInt(result));
                        }
                    });
                });
            }
            function waitToResolveLoop() {
                return new Promise(async (resolve, reject) => {
                    const savedTime = await getLastRequest();
                    const elapsedTime = new Date().getTime() - savedTime;
                    const remainingMs = interval - elapsedTime;
                    if (remainingMs > 0) {
                        setTimeout(() => {
                            resolve(waitToResolveLoop());
                        }, remainingMs);
                    }
                    else {
                        resolve();
                    }
                });
            }
            return;
        });
    }
    async finishRequest() {
        return new Promise(async (resolve, reject) => {
            await setLastRequest(new Date().getTime());
            resolve();
            function setLastRequest(time) {
                return new Promise((resolve, reject) => {
                    fs_1.default.writeFile('./src/services/Tray/lastRequest', time.toString(), { encoding: 'utf8' }, (erro) => {
                        if (erro) {
                            console.log(erro);
                            reject(erro);
                        }
                        else {
                            resolve();
                        }
                    });
                });
            }
            return;
        });
    }
}
exports.default = new TrayRequestsQueue;
