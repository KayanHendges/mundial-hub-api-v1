"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = __importDefault(require("../../models/Users/Users"));
const ProductDataBase_1 = __importDefault(require("../../services/Products/ProductDataBase"));
const fs_1 = __importDefault(require("fs"));
exports.default = {
    async trayRequests(req, res) {
        Users_1.default.getCountRequestsTray(res);
    },
    async trayProductsAmount(req, res) {
        const { store_id } = req.query;
        if (store_id) {
            const products = await Users_1.default.getProductsAmount(parseInt(store_id))
                .then(response => {
                const products = response;
                res.status(200).json({
                    code: 200,
                    products
                });
            })
                .catch(erro => {
                res.status(404).json({
                    code: 404,
                    message: erro
                });
            });
        }
        else {
            res.status(400).json({
                code: 400,
                message: 'está faltando o store_id como parametro'
            });
        }
    },
    async medida(req, res) {
        const txtProducts = fs_1.default.readFileSync(`./src/files/products.txt`, 'utf8').split('\n');
        const products = [];
        const eachWeight = [];
        var totalWeight = 0;
        txtProducts.map(product => {
            const name = [];
            const splitted = product.split(' ');
            var reference = '';
            var volumes = '';
            var totalPrice = '';
            splitted.map((letter, index) => {
                if (index <= 1) {
                    name.push(letter);
                }
                if (splitted[index + 2] == 'UN') {
                    reference = letter;
                }
                if (letter == 'UN') {
                    volumes = splitted[index + 1];
                }
                if (index == (splitted.length - 1)) {
                    totalPrice = letter.replace('\r', '');
                }
            });
            if (volumes == '0') {
                return;
            }
            else {
                products.push({
                    produto: name.join(' '),
                    reference,
                    sizes: null,
                    weight: null,
                    volumes: volumes,
                    totalPrice: totalPrice
                });
            }
        });
        const finalProducts = await Promise.all(products.map(async (product) => {
            const { sizes, weight } = await getDimension(product.reference);
            eachWeight.push(weight * parseInt(product.volumes));
            return `${product.volumes}x ${product.produto} - ${sizes} ${weight}kg`;
        }))
            .then(response => {
            return response;
        })
            .catch(erro => {
            res.status(400).send(erro);
            return null;
        });
        eachWeight.map(weight => {
            totalWeight = totalWeight + weight;
        });
        if (!finalProducts) {
            return;
        }
        res.json({
            finalProducts,
            eachWeight,
            totalWeight
        });
        async function getDimension(reference) {
            return new Promise(async (resolve, reject) => {
                const product = await ProductDataBase_1.default.getProduct({ reference: reference }, true, false)
                    .then(response => {
                    const sizes = `${response.height}x${response.width}x${response.length}`;
                    resolve({
                        sizes,
                        weight: response.weight / 1000
                    });
                })
                    .catch(erro => {
                    reject(erro);
                });
            });
        }
    }
};
