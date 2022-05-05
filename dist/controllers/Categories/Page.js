"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Categories_1 = __importDefault(require("../../models/Categories/Categories"));
const Page_1 = __importDefault(require("../../models/Categories/Page"));
exports.default = {
    async getById(req, res) {
        const { params } = req;
        if (params.id) {
            const page = new Page_1.default;
            page.getById(params.id, res);
        }
        else {
            res.status(400).json({
                code: 400,
                message: 'está faltando o hub_id da categoria'
            });
        }
    },
    async createCategory(req, res) {
        const { body } = req;
        if (body.category) {
            Categories_1.default.createCategory(body.category, res);
        }
        else {
            res.status(400).json({
                code: 400,
                message: 'está faltando a categoria'
            });
        }
    },
    async createSubcategory(req, res) {
        const { body, params } = req;
        if (params.parent_id && body.category) {
            Categories_1.default.createSubcategory(body.category, params.parent_id, res);
        }
        else {
            res.status(400).json({
                code: 400,
                message: 'está faltando a categoria'
            });
        }
    },
    async editCategory(req, res) {
        const { body } = req;
        if (body.category) {
            Categories_1.default.editCategory(req.body.category, res);
        }
        else {
            res.status(400).json({
                code: 400,
                message: 'está faltando a categoria'
            });
        }
    },
    async deleteCategory(req, res) {
        const { params } = req;
        if (params.hub_id) {
            Categories_1.default.deleteCategory(req.params.hub_id, res);
        }
        else {
            res.status(400).json({
                code: 400,
                message: "Está faltando o hub_id da categoria"
            });
        }
    }
};
