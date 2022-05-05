"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const format_1 = __importDefault(require("date-fns/format"));
const ConvertCategories_1 = __importDefault(require("../../models/Categories/ConvertCategories"));
const datetime_1 = __importDefault(require("../datetime"));
class Validate {
    async unitary({ details, pricing }) {
        const object = {
            details: {
                is_kit: 0,
                ean: toEmptyString(details.ean),
                ncm: toEmptyString(details.ncm),
                product_name: toEmptyString(details.product_name),
                product_description: toEmptyString(details.description),
                brand: toEmptyString(details.brand),
                model: toEmptyString(details.model),
                weight: toInteger(details.weight),
                length: toInteger(details.length),
                width: toInteger(details.width),
                height: toInteger(details.height),
                main_category_id: toInteger(details.main_category_id),
                related_categories: details.related_categories,
                available: toInteger(details.available),
                availability: toEmptyString(details.availability),
                availability_days: toInteger(details.availabilityDays),
                reference: toEmptyString(details.reference),
                picture_source_1: toEmptyString(details.images[0].imageUrl),
                picture_source_2: toEmptyString(details.images[1].imageUrl),
                picture_source_3: toEmptyString(details.images[2].imageUrl),
                picture_source_4: toEmptyString(details.images[3].imageUrl),
                picture_source_5: toEmptyString(details.images[4].imageUrl),
                picture_source_6: toEmptyString(details.images[5].imageUrl),
                warranty: toEmptyString(details.warranty),
                virtual_product: 0,
                content: toEmptyString(details.product_name),
                creation_date: await (0, datetime_1.default)(),
                modified: await (0, datetime_1.default)(),
                comments: toEmptyString(details.comments)
            },
            pricing: {
                mundial: {
                    is_kit: 0,
                    cost_price: toFloat(pricing.mundial.cost),
                    profit: profitCheck(toFloat(pricing.mundial.profit)),
                    tray_price: toFloat(pricing.mundial.price),
                    tray_promotional_price: toFloat(pricing.mundial.promotional_price),
                    start_promotion: toStringDate(pricing.mundial.start_promotion),
                    end_promotion: toStringDate(pricing.mundial.end_promotion),
                    tray_stock: toInteger(pricing.mundial.stock),
                    tray_minimum_stock: 1,
                    tray_main_category_id: await ConvertCategories_1.default.hubMainCategoryToTray(details.main_category_id, 668385),
                    tray_related_categories: await ConvertCategories_1.default.hubRelatedCategoriesToTray(details.related_categories, 668385),
                    modified: await (0, datetime_1.default)()
                },
                scpneus: {
                    is_kit: 0,
                    cost_price: toFloat(pricing.scpneus.cost),
                    profit: profitCheck(toFloat(pricing.scpneus.profit)),
                    tray_price: toFloat(pricing.scpneus.price),
                    tray_promotional_price: toFloat(pricing.scpneus.promotional_price),
                    start_promotion: toStringDate(pricing.scpneus.start_promotion),
                    end_promotion: toStringDate(pricing.scpneus.end_promotion),
                    tray_stock: toInteger(pricing.scpneus.stock),
                    tray_minimum_stock: 1,
                    tray_main_category_id: await ConvertCategories_1.default.hubMainCategoryToTray(details.main_category_id, 1049898),
                    tray_related_categories: await ConvertCategories_1.default.hubRelatedCategoriesToTray(details.related_categories, 1049898),
                    modified: await (0, datetime_1.default)()
                }
            },
        };
        return object;
        function toFloat(value) {
            if (typeof (value) == 'string') {
                const cleanString = (value.replace('.', '')).replace(',', '.');
                return parseFloat(cleanString);
            }
            else {
                return value;
            }
        }
        function toInteger(value) {
            if (typeof (value) == 'string') {
                const cleanString = (value.replace('.', '')).replace(',', '.');
                return Math.floor(parseFloat(cleanString));
            }
            else {
                return value;
            }
        }
        function profitCheck(profit) {
            if (profit > 1 && profit < 2) {
                return (profit * 100) - 100;
            }
            if (profit > 0 && profit < 1) {
                return profit * 100;
            }
            if (profit >= 2) {
                return profit;
            }
            return profit;
        }
        function toStringDate(date) {
            if (typeof (date) === 'object') {
                return (0, format_1.default)(date, 'yyyy-MM-dd 00:00:00');
            }
            else {
                if (date.length == 0) {
                    return 'yyyy-MM-dd 00:00:00';
                }
                return (0, format_1.default)((0, date_fns_1.parseISO)(date), 'yyyy-MM-dd 00:00:00');
            }
        }
        function toEmptyString(str) {
            if (str != undefined) {
                if (str == null) {
                    return '';
                }
                return str.toString();
            }
            else {
                return '';
            }
        }
    }
    async kit({ details, rules }, unitaryPricing) {
        const quantity = toInteger(rules.quantity);
        const result = kitPrice(100, 2, 2, '%', 2);
        const object = {
            details: {
                is_kit: 1,
                ean: toEmptyString(details.ean),
                ncm: toEmptyString(details.ncm),
                product_name: toEmptyString(details.product_name),
                product_description: toEmptyString(details.description),
                brand: toEmptyString(details.brand),
                model: toEmptyString(details.model),
                weight: toInteger(details.weight) * quantity,
                length: toInteger(details.length),
                width: toInteger(details.width) * quantity,
                height: toInteger(details.height),
                main_category_id: toInteger(details.main_category_id),
                related_categories: details.related_categories,
                available: toInteger(details.available),
                availability: toEmptyString(details.availability),
                availability_days: toInteger(details.availabilityDays),
                reference: toEmptyString(details.reference),
                picture_source_1: toEmptyString(details.images[0].imageUrl),
                picture_source_2: toEmptyString(details.images[1].imageUrl),
                picture_source_3: toEmptyString(details.images[2].imageUrl),
                picture_source_4: toEmptyString(details.images[3].imageUrl),
                picture_source_5: toEmptyString(details.images[4].imageUrl),
                picture_source_6: toEmptyString(details.images[5].imageUrl),
                warranty: toEmptyString(details.warranty),
                virtual_product: 0,
                content: toEmptyString(details.product_name),
                creation_date: await (0, datetime_1.default)(),
                modified: await (0, datetime_1.default)(),
                comments: toEmptyString(details.comments)
            },
            pricing: {
                mundial: {
                    is_kit: 1,
                    cost_price: toFloat(unitaryPricing.cost) * quantity,
                    profit: profitCheck(toFloat(unitaryPricing.profit)),
                    tray_price: kitPrice(toFloat(unitaryPricing.price), quantity, toInteger(rules.price_rule), toEmptyString(rules.discount_type), toFloat(rules.discount_value)),
                    tray_promotional_price: kitPrice(toFloat(unitaryPricing.promotional_price), quantity, toInteger(rules.price_rule), toEmptyString(rules.discount_type), toFloat(rules.discount_value)),
                    start_promotion: toStringDate(unitaryPricing.start_promotion),
                    end_promotion: toStringDate(unitaryPricing.end_promotion),
                    tray_stock: Math.floor(toInteger(unitaryPricing.stock) / quantity),
                    tray_minimum_stock: 1,
                    tray_main_category_id: await ConvertCategories_1.default.hubMainCategoryToTray(details.main_category_id, 668385),
                    tray_related_categories: await ConvertCategories_1.default.hubRelatedCategoriesToTray(details.related_categories, 668385),
                    modified: await (0, datetime_1.default)()
                }
            },
            rules: {
                quantity: quantity,
                discount_type: rules.discount_type,
                discount_value: toFloat(rules.discount_value),
                price_rule: toInteger(rules.price_rule),
            }
        };
        return object;
        function toFloat(value) {
            if (typeof (value) == 'string') {
                const cleanString = (value.replace('.', '')).replace(',', '.');
                return parseFloat(cleanString);
            }
            else {
                return value;
            }
        }
        function toInteger(value) {
            if (typeof (value) == 'string') {
                const cleanString = (value.replace('.', '')).replace(',', '.');
                return Math.floor(parseFloat(cleanString));
            }
            else {
                return value;
            }
        }
        function profitCheck(profit) {
            if (profit > 1 && profit < 2) {
                return (profit * 100) - 100;
            }
            if (profit > 0 && profit < 1) {
                return profit * 100;
            }
            if (profit >= 2) {
                return profit;
            }
            return profit;
        }
        function toStringDate(date) {
            if (typeof (date) === 'object') {
                return (0, format_1.default)(date, 'yyyy-MM-dd hh:mm:ss');
            }
            else {
                if (date.length == 0) {
                    return '0000-00-00 hh:mm:ss';
                }
                return (0, format_1.default)((0, date_fns_1.parseISO)(date), 'yyyy-MM-dd hh:mm:ss');
            }
        }
        function toEmptyString(str) {
            if (str != undefined) {
                if (str == null) {
                    return '';
                }
                return str.toString();
            }
            else {
                return '';
            }
        }
        function kitPrice(price, quantity, priceRule, discountType, discountValue) {
            if (price == 0) {
                return price;
            }
            if (priceRule == 1) {
                return price * quantity;
            }
            if (discountType == '$') {
                return (price * quantity) - discountValue;
            }
            if (discountType == '%') {
                return (price * quantity) * ((discountValue / 100) + 1);
            }
            return price * quantity;
        }
    }
    async hubProduct(product) {
        const getImages = product.images != undefined ? true : false;
        return {
            is_kit: this.toInteger(product.is_kit),
            ean: this.toEmptyString(product.ean),
            ncm: this.toEmptyString(product.ncm),
            product_name: this.toEmptyString(product.product_name),
            product_description: this.toEmptyString(product.description),
            brand: this.toEmptyString(product.brand),
            model: this.toEmptyString(product.model),
            weight: this.toInteger(product.weight),
            length: this.toInteger(product.length),
            width: this.toInteger(product.width),
            height: this.toInteger(product.height),
            main_category_id: this.toInteger(product.main_category_id),
            related_categories: product.related_categories,
            available: this.toInteger(product.available),
            availability: this.toEmptyString(product.availability),
            availability_days: this.toInteger(product.availabilityDays),
            reference: this.toEmptyString(product.reference),
            picture_source_1: getImages ? this.toEmptyString(product.images[0].imageUrl) : undefined,
            picture_source_2: getImages ? this.toEmptyString(product.images[1].imageUrl) : undefined,
            picture_source_3: getImages ? this.toEmptyString(product.images[2].imageUrl) : undefined,
            picture_source_4: getImages ? this.toEmptyString(product.images[3].imageUrl) : undefined,
            picture_source_5: getImages ? this.toEmptyString(product.images[4].imageUrl) : undefined,
            picture_source_6: getImages ? this.toEmptyString(product.images[5].imageUrl) : undefined,
            warranty: this.toEmptyString(product.warranty),
            virtual_product: 0,
            content: this.toEmptyString(product.product_name),
            creation_date: await (0, datetime_1.default)(),
            modified: await (0, datetime_1.default)(),
            comments: this.toEmptyString(product.comments)
        };
    }
    async createPricing(pricing, storeId) {
        return {
            is_kit: 0,
            hub_id: pricing.hub_id,
            tray_product_id: pricing.tray_product_id ? pricing.tray_product_id : 0,
            cost_price: this.toFloat(pricing.cost),
            profit: this.profitCheck(this.toFloat(pricing.profit)),
            tray_price: this.toFloat(pricing.price),
            tray_promotional_price: this.toFloat(pricing.promotional_price),
            start_promotion: this.toStringDate(pricing.start_promotion),
            end_promotion: this.toStringDate(pricing.end_promotion),
            tray_stock: this.toInteger(pricing.stock),
            tray_minimum_stock: 1,
            tray_main_category_id: await ConvertCategories_1.default.hubMainCategoryToTray(pricing.main_category_id, storeId),
            tray_related_categories: await ConvertCategories_1.default.hubRelatedCategoriesToTray(pricing.related_categories, storeId),
            modified: await (0, datetime_1.default)()
        };
    }
    async createKitPricing(pricing, rules) {
        const quantity = rules.quantity;
        return {
            is_kit: 1,
            hub_id: pricing.hub_id,
            tray_product_id: pricing.tray_product_id ? pricing.tray_product_id : 0,
            cost_price: this.toFloat(pricing.cost) * quantity,
            profit: this.profitCheck(this.toFloat(pricing.profit)),
            tray_price: kitPrice(this.toFloat(pricing.price), quantity, this.toInteger(rules.price_rule), this.toEmptyString(rules.discount_type), this.toFloat(rules.discount_value)),
            tray_promotional_price: kitPrice(this.toFloat(pricing.promotional_price), quantity, this.toInteger(rules.price_rule), this.toEmptyString(rules.discount_type), this.toFloat(rules.discount_value)),
            start_promotion: this.toStringDate(pricing.start_promotion),
            end_promotion: this.toStringDate(pricing.end_promotion),
            tray_stock: Math.floor(this.toInteger(pricing.stock) / quantity),
            tray_minimum_stock: 1,
            tray_main_category_id: await ConvertCategories_1.default.hubMainCategoryToTray(pricing.main_category_id, 668385),
            tray_related_categories: await ConvertCategories_1.default.hubRelatedCategoriesToTray(pricing.related_categories, 668385),
            modified: await (0, datetime_1.default)()
        };
        function kitPrice(price, quantity, priceRule, discountType, discountValue) {
            if (price == 0) {
                return price;
            }
            if (priceRule == 1) {
                return price * quantity;
            }
            if (discountType == '$') {
                return (price * quantity) - discountValue;
            }
            if (discountType == '%') {
                return (price * quantity) * (1 - (discountValue / 100));
            }
            return price * quantity;
        }
    }
    async createKitRule() {
    }
    toFloat(value) {
        if (typeof (value) == 'string') {
            const cleanString = (value.replace('.', '')).replace(',', '.');
            return parseFloat(cleanString);
        }
        else {
            return value;
        }
    }
    toInteger(value) {
        if (typeof (value) == 'string') {
            const cleanString = (value.replace('.', '')).replace(',', '.');
            return Math.floor(parseFloat(cleanString));
        }
        else {
            return value;
        }
    }
    profitCheck(profit) {
        if (profit > 1 && profit < 2) {
            return (profit * 100) - 100;
        }
        if (profit > 0 && profit < 1) {
            return profit * 100;
        }
        if (profit >= 2) {
            return profit;
        }
        return profit;
    }
    toStringDate(date) {
        if (typeof (date) === 'object') {
            return (0, format_1.default)(date, 'yyyy-MM-dd 00:00:00');
        }
        else {
            if (date.length == 0) {
                return 'yyyy-MM-dd 00:00:00';
            }
            return (0, format_1.default)((0, date_fns_1.parseISO)(date), 'yyyy-MM-dd 00:00:00');
        }
    }
    toEmptyString(str) {
        if (str) {
        }
        if (str != undefined) {
            if (str == null) {
                return '';
            }
            return str.toString();
        }
        else {
            return '';
        }
    }
}
exports.default = new Validate;
