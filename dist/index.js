"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes/routes"));
const Connect_1 = __importDefault(require("./database/Connect"));
const Tables_1 = __importDefault(require("./database/Tables"));
const cors_1 = __importDefault(require("cors"));
const date_fns_1 = require("date-fns");
const body_parser_1 = __importDefault(require("body-parser"));
const Routines_1 = __importDefault(require("./models/Routines/Routines"));
Connect_1.default.query('SELECT * FROM credenciais_tray', async (erro) => {
    if (erro) {
        console.log(erro);
    }
    else {
        const tables = new Tables_1.default;
        tables.init();
        const time = (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd HH:MM:SS');
        const date = (0, date_fns_1.addHours)(new Date(), -3);
        const app = (0, express_1.default)();
        const port = 3001;
        app.use(body_parser_1.default.json());
        app.use((0, cors_1.default)());
        app.use(routes_1.default);
        app.listen(port, () => console.log(`${time} - Servidor rodando na porta ${port}`));
        Routines_1.default.startRoutine();
    }
});
