"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const Connect = mysql_1.default.createPool({
    host: '',
    port: 3306,
    user: '',
    password: '',
    database: ''
});
exports.default = Connect;
