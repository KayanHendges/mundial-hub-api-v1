"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Google_1 = __importDefault(require("../../models/Products/Google"));
exports.default = {
    async Xml(request, response) {
        try {
            const xml = await Google_1.default.xml();
            response.set('Content-Type', 'text/xml');
            response.type('xml');
            response.send(xml);
        }
        catch (err) {
            response.status(400).json({
                message: 'unexpected error'
            });
        }
    }
};
