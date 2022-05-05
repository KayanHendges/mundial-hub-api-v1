"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const fs_1 = __importDefault(require("fs"));
const Connect_1 = __importDefault(require("../../database/Connect"));
class ConvertProducts {
    async localStock() {
        const products = await getAllProducts();
        return {
            products: products
        };
        async function getAllProducts() {
            return new Promise(resolve => {
                const sql = `SELECT p.hub_id, p.reference, p.product_name, p.brand, t.cost_price
        FROM produtos p JOIN tray_produtos t ON p.hub_id=t.hub_id WHERE p.is_kit=0 AND t.tray_store_id = 668385 AND p.hub_id != 3838`;
                Connect_1.default.query(sql, (erro, resultado) => {
                    if (erro) {
                        console.log(erro);
                    }
                    else {
                        if (resultado.length > 0) {
                            const lastUpdate = new Date();
                            const products = resultado.map(product => {
                                return {
                                    hubId: product.hub_id,
                                    productId: product.reference,
                                    productName: product.product_name,
                                    brand: product.brand,
                                    stock: 0,
                                    price: product.cost_price,
                                    additionalCosts: 0,
                                    lastUpdate: lastUpdate,
                                };
                            });
                            resolve(products);
                        }
                        else {
                            resolve([]);
                        }
                    }
                });
            });
        }
    }
    luperText(products) {
        const textProducts = fs_1.default.readFileSync(`./src/files/${products}`, 'utf8').split('\n');
        const fillText = [];
        const lastUpdate = (0, date_fns_1.parseISO)(textProducts[0].replace('\r', ''));
        textProducts.map(line => {
            if (line.includes('PNEU') && line.length > 50) {
                const splittedLine = line.split(" ");
                const productId = parseInt(splittedLine[0]);
                const stock = parseInt(splittedLine[splittedLine.length - 1].replace("\r", ''));
                var productName = splittedLine;
                productName.splice(0, 1);
                productName.splice(productName.length - 1, 1);
                const brand = productName[productName.length - 1];
                fillText.push({
                    productId: productId,
                    productName: productName.join(' '),
                    brand: brand,
                    stock: stock,
                    price: 0,
                    additionalCosts: 0,
                    lastUpdate: lastUpdate
                });
            }
        });
        return {
            products: fillText
        };
    }
    roddarText(file) {
        const textProducts = fs_1.default.readFileSync(`./src/files/${file}`, 'utf8').split('\n');
        const fillText = [];
        const lastUpdate = (0, date_fns_1.parseISO)(textProducts[0].replace('\r', ''));
        textProducts.map((row, index) => {
            if (row.length > 60) {
                const words = row.split(' ');
                const productName = [];
                var startPriceIndex = false;
                var price = 0;
                words.map((word, i) => {
                    if (word == 'R$' && !startPriceIndex) {
                        startPriceIndex = true;
                        price = parseFloat((words[i + 1].replace('.', '').replace(',', '.')));
                    }
                    if (i > 0 && !startPriceIndex && (words[i + 2] != 'R$' && words[i + 1] != 'R$')) {
                        productName.push(word);
                    }
                    if (word == "RUNFT\r") {
                        const runflat = word.replace('\r', '');
                        productName.splice(0, 0, runflat);
                    }
                    if (word == "RUNFT") {
                        productName.splice(0, 0, word);
                    }
                });
                fillText.push({
                    productId: parseInt(words[0]),
                    productName: productName.join(' '),
                    brand: words[4],
                    stock: 4,
                    price: price,
                    additionalCosts: 0,
                    lastUpdate: lastUpdate
                });
            }
        });
        fillText.map(product => {
            if (typeof (product.productId) != "number" && product.price < 250) {
                console.log(product);
            }
        });
        return {
            products: fillText
        };
    }
    roddarImportsText(file) {
        const textProducts = fs_1.default.readFileSync(`./src/files/${file}`, 'utf8').split('\n');
        const fillText = [];
        const lastUpdate = (0, date_fns_1.parseISO)(textProducts[0].replace('\r', ''));
        textProducts.map((row, index) => {
            if (row.length > 35) {
                const words = row.split(' ');
                const productName = [];
                var startPrice = false;
                var price = 0;
                words.map((word, i) => {
                    const crts = word.split('');
                    crts.map(crt => {
                        if (crt == ',') {
                            startPrice = true;
                            price = parseFloat(word.replace(',', '.'));
                        }
                    });
                    if (i > 0 && !startPrice) {
                        productName.push(word);
                    }
                });
                fillText.push({
                    productId: parseInt(words[0]),
                    productName: productName.join(' '),
                    brand: words[4],
                    stock: 4,
                    price: price,
                    additionalCosts: 0,
                    lastUpdate: lastUpdate
                });
            }
        });
        fillText.map(product => {
            if (typeof (product.productId) != "number" && product.price < 250) {
                console.log(product);
            }
        });
        return {
            products: fillText
        };
    }
    duncanText(file) {
        const textProducts = fs_1.default.readFileSync(`./src/files/${file}`, 'utf8').split('\n');
        const fillText = [];
        const lastUpdate = (0, date_fns_1.parseISO)(textProducts[0].replace('\r', ''));
        textProducts.map((row, index) => {
            if (row.length > 40) {
                const words = row.split(' ');
                const productName = [];
                var stock = 0;
                var price = 0;
                var promotionalPrice = 0;
                var startPriceIndex = -1;
                const id = [];
                words[0].split('').map(n => {
                    if (n == 'N') {
                        id.push(11);
                    }
                    if (n == 'X') {
                        id.push(22);
                    }
                    if (n != 'N' && n != 'X') {
                        id.push(parseInt(n));
                    }
                });
                words.map((crt, i) => {
                    if (i > 0 && startPriceIndex == -1) {
                        productName.push(crt);
                    }
                    if (words[i + 3] == 'R$' && startPriceIndex == -1) {
                        startPriceIndex = i + 3;
                    }
                    if (i + 1 == startPriceIndex) {
                        stock = parseInt(crt);
                    }
                    if (crt == 'R$' && price > 0 && promotionalPrice == 0) {
                        promotionalPrice = parseFloat((words[i + 1].replace('.', '')).replace(',', '.'));
                    }
                    if (crt == 'R$' && i == startPriceIndex) {
                        price = parseFloat((words[i + 1].replace('.', '')).replace(',', '.'));
                        price = price * 0.9; // desconto Duncan
                        price = parseFloat(price.toFixed(2));
                    }
                });
                fillText.push({
                    productId: parseInt(id.join('')),
                    productName: productName.join(' '),
                    brand: words[1].toUpperCase(),
                    stock: stock,
                    price: promotionalPrice == 0 ? price : promotionalPrice,
                    additionalCosts: 0,
                    lastUpdate: lastUpdate
                });
            }
        });
        fillText.map(product => {
            if (typeof (product.productId) != "number" && product.price < 250) {
                console.log(product);
            }
        });
        return {
            products: fillText
        };
    }
}
exports.default = new ConvertProducts;
