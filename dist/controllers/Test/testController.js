"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RequestsQueue_1 = __importDefault(require("../../services/Tray/RequestsQueue"));
exports.default = {
    async trayRequests(req, res) {
        var totalMs = 0;
        const started = new Date().getTime();
        // const newRequest = TrayRequestsQueue.newRequest()
        // .then(response => {
        //     return true
        // })
        // .catch(err => {
        //     res.status(400).json(err)
        //     return false
        // })
        const requests = [];
        for (let index = 0; index < 10; index++) {
            requests.push(index + 1);
        }
        // await Promise.all(requests.map(async(request) => {
        //     const started = new Date().getTime()
        //     await TrayRequestsQueue.newRequest().then(() => {
        //         console.log(`requisição ${request} levou ${new Date().getTime() - started}ms`)
        //     })
        // }))
        for (const request in requests) {
            const started = new Date().getTime();
            await RequestsQueue_1.default.newRequest().then(() => {
                console.log(`requisição ${request} levou ${new Date().getTime() - started}ms`);
            });
            setTimeout(() => {
                totalMs = totalMs + (new Date().getTime() - started);
                console.log(totalMs);
                return;
            }, 0);
        }
        console.log(`esse processo levou ${new Date().getTime() - started} ms`);
        res.send('ok');
    }
};
