"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const Connect_1 = __importDefault(require("../database/Connect"));
const ProductDataBase_1 = __importDefault(require("../services/Products/ProductDataBase"));
const sleep_1 = __importDefault(require("../services/sleep"));
const titleize_1 = __importDefault(require("../services/titleize"));
const TrayProducts_1 = __importDefault(require("../services/Tray/TrayProducts"));
const OAuth2Tray_1 = __importDefault(require("./Auth/OAuth2Tray"));
class Temp {
    async Temp(req, res) {
        const { store_code } = req.query;
        const storeCode = parseInt(store_code);
        if (isNaN(storeCode)) {
            res.status(401).json({ message: 'missing store code' });
        }
        const products = await getProducts(storeCode);
        const newProducts = products.map(product => {
            var name = product.product_name.toLowerCase();
            name.replaceAll('agrícola', '');
            name.replaceAll('empilhadeira', '');
            name.replaceAll('retroescavadeira', '');
            name.replaceAll('tobata', '');
            name.replaceAll('trator', '');
            name.replaceAll('moto', '');
            var construcaoRadial = '';
            name.split(' ').map((word, index) => {
                word.split('').map((crt, i) => {
                    if (index = 1) {
                        if (crt == 'r') {
                            construcaoRadial = 'radial';
                        }
                    }
                });
            });
            const description = `${(0, titleize_1.default)(product.product_name)}

            Modelo: ${product.model}
            Marca: ${product.brand}
            ${construcaoRadial.length > 0 ? 'Construção: ' : ''}${construcaoRadial.length > 0 ? construcaoRadial : ''}
            
            Dimensões:
            
            Comprimento: ${product.length}cm
            Altura: ${product.height}cm
            Largura: ${product.width}cm
            
            Peso: ${product.weight / 1000}kg
            garantia: 5 anos
            `;
            return Object.assign(Object.assign({}, product), { product_description: description.replaceAll("\n", "</br>") });
        });
        for (const i in newProducts) {
            console.log('nova operação');
            const index = parseInt(i);
            const product = newProducts[index];
            const description = product.product_description;
            const start = (0, date_fns_1.getTime)(new Date());
            const storeCredentials = await OAuth2Tray_1.default.getStoreCredentials(storeCode);
            await ProductDataBase_1.default.updateProduct({ hub_id: product.hub_id, product_description: description })
                .catch(err => { throw new Error(err); });
            if (product.tray_product_id > 0) {
                await TrayProducts_1.default.updateProduct(storeCredentials, { product_description: description, is_kit: 0 }, product.tray_product_id)
                    .catch(err => { throw new Error(err); });
            }
            const end = (0, date_fns_1.getTime)(new Date());
            const executionTime = end - start;
            const timeRemaining = executionTime < 340 ? 340 - executionTime : 0;
            console.log(`${index + 1}/${products.length} - product ${product.hub_id} - levou ${executionTime}ms e esperará ${timeRemaining} `);
            await (0, sleep_1.default)(timeRemaining);
            console.log('esperou, fim da operação');
        }
        res.send(newProducts);
        function getProducts(storeCode) {
            return new Promise(async (resolve) => {
                const sql = `SELECT p.hub_id, p.product_name, p.product_description, p.brand, p.model, tp.tray_product_id,
                p.weight, p.width, p.length, p.height
                FROM produtos p JOIN tray_produtos tp ON p.hub_id = tp.hub_id 
                WHERE tp.tray_store_id = ${storeCode} and p.is_kit = 0`;
                Connect_1.default.query(sql, (err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        resolve(res);
                    }
                });
            });
        }
    }
}
exports.default = new Temp;
