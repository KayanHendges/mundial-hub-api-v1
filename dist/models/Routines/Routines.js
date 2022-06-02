"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Routines {
    async startRoutine() {
        return new Promise(async (resolve, reject) => {
            console.log("rotinas iniciadas");
            // rotinas desabilitadas, projeto apenas para apresentação
            // OAuth2Tray.tokenRoutine()
            // cron.schedule("0 0 * * *", () => Requests.resetCountRequests());
            // cron.schedule("00 03 * * *", () => Categories.updateCategoryOrder());
        });
    }
}
exports.default = new Routines;
