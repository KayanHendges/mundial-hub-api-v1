"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const OAuth2Tray_1 = __importDefault(require("../Auth/OAuth2Tray"));
const Categories_1 = __importDefault(require("../Categories/Categories"));
const Requests_1 = __importDefault(require("../Tray/Requests"));
class Routines {
    async startRoutine() {
        return new Promise(async (resolve, reject) => {
            console.log("rotinas iniciadas");
            OAuth2Tray_1.default.tokenRoutine();
            node_cron_1.default.schedule("0 0 * * *", () => Requests_1.default.resetCountRequests());
            node_cron_1.default.schedule("00 03 * * *", () => Categories_1.default.updateCategoryOrder());
        });
    }
}
exports.default = new Routines;
