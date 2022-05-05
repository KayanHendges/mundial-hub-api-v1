"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Categories_1 = __importDefault(require("../../models/Categories/Categories"));
exports.default = {
    async all(req, res) {
        Categories_1.default.listAll(res);
    }
};
