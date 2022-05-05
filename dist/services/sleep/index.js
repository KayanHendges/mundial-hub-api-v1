"use strict";
// uma função para criar um delay de forma mais compacta e limpa com uma Promise
Object.defineProperty(exports, "__esModule", { value: true });
function sleep(milliseconds) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, milliseconds);
    });
}
exports.default = sleep;
