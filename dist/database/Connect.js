"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const Connect = mysql_1.default.createPool({
    host: '3.136.243.230',
    port: 3306,
    user: 'prisma',
    password: 'Db264080Db',
    database: 'mundialh_mundial_hub'
});
// const Connect = mysql.createPool({
//     host: '162.240.24.27',
//     port: 3306,
//     user: 'mundialh_prisma',
//     password: 'Db264080DbPrisma', 
//     database: 'mundialh_mundial_hub'
// })
exports.default = Connect;
