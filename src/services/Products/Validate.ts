import { parseISO } from "date-fns"
import format from "date-fns/format"
import ConvertCategories from "../../models/Categories/ConvertCategories"
import Datetime from "../datetime"

export interface IDetailsInput {
    is_kit: number;
    ean: string;
    ncm: string;
    product_name: string;
    description: string;
    brand: string;
    model: string;
    weight: number;
    length: number;
    width: number;
    height: number;
    main_category_id: number;
    related_categories: number[];
    available: number;
    release_date?: Date;
    availability: string;
    availabilityDays: number;
    reference: string;
    images: {imageUrl: string}[]
    warranty: string;
    comments: string;
}

export interface IPricingInput {
    tray_product_id?: number;
    cost: number,
    profit: number,
    price: number,
    hub_id: number;
    promotional_price: number,
    start_promotion: Date | string,
    end_promotion: Date | string,
    stock: number,
    main_category_id: number;
    related_categories: number[];
}

export interface IRulesInput {
    tray_product_id?: number;
    quantity: number;
    discount_type: string;
    discount_value: number;
    price_rule: number;
}

export interface IProductInput {
    details: IDetailsInput,
    pricing: {
        mundial: IPricingInput,
        scpneus: IPricingInput
    }
}

export interface IProductKitInput {
    details: IDetailsInput,
    rules: IRulesInput
}

interface IDetailsOutput {
    is_kit: number,
    ean: string,
    ncm: string,
    product_name: string,
    product_description: string,
    brand: string,
    model: string,
    weight: number,
    length: number,
    width: number,
    height: number,
    main_category_id: number,
    related_categories: number[],
    available: number,
    availability: string,
    availability_days: number,
    reference: string,
    picture_source_1: string,
    picture_source_2: string,
    picture_source_3: string,
    picture_source_4: string,
    picture_source_5: string,
    picture_source_6: string,
    warranty: string,
    virtual_product: number;
    content: string,
    creation_date: Date,
    modified: Date,
    comments: string,
}

interface IPricingOutput {
    hub_id: number;
    tray_product_id: number;
    is_kit: number,
    cost_price: number,
    profit: number,
    tray_price: number,
    tray_promotional_price: number,
    start_promotion: string,
    end_promotion: string,
    tray_stock: number,
    tray_minimum_stock: number,
    tray_main_category_id: number,
    tray_related_categories: number[],
    modified: Date
}

interface IProductOutput {
    details: IDetailsOutput,
    pricing: {
        mundial: IPricingOutput,
        scpneus: IPricingOutput
    }
}

interface IProductKitOutput {
    details: IDetailsOutput,
    pricing: {
        mundial: IPricingOutput,
    },
    rules: IRulesInput
}

class Validate {

    async unitary({details, pricing}: IProductInput): Promise<IProductOutput>{

        const object: any = {
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
                creation_date: await Datetime(),
                modified: await Datetime(),
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
                    tray_main_category_id: await ConvertCategories.hubMainCategoryToTray(details.main_category_id, 668385),
                    tray_related_categories: await ConvertCategories.hubRelatedCategoriesToTray(details.related_categories, 668385),
                    modified: await Datetime()
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
                    tray_main_category_id: await ConvertCategories.hubMainCategoryToTray(details.main_category_id, 1049898),
                    tray_related_categories: await ConvertCategories.hubRelatedCategoriesToTray(details.related_categories, 1049898),
                    modified: await Datetime()
                }
            }, 
        }

        return object

        function toFloat(value: string | number): number{
            if(typeof(value) == 'string'){
                const cleanString = (value.replace('.', '')).replace(',', '.')
                return parseFloat(cleanString)
            } else {
                return value
            }
        }

        function toInteger(value: string | number): number{
            if(typeof(value) == 'string'){
                const cleanString = (value.replace('.', '')).replace(',', '.')
                return Math.floor(parseFloat(cleanString))
            } else {
                return value
            }
        }

        function profitCheck(profit: number): number{
            if(profit > 1 && profit < 2){
                return (profit * 100) - 100
            }

            if(profit > 0 && profit < 1){
                return profit * 100
            }

            if(profit >= 2){
                return profit
            }

            return profit
        }

        function toStringDate(date: string | Date): string{

            if(typeof(date) === 'object'){
                return format(date, 'yyyy-MM-dd 00:00:00')
            } else {
                if(date.length == 0){
                    return 'yyyy-MM-dd 00:00:00'
                }

                return format(parseISO(date), 'yyyy-MM-dd 00:00:00')
            }
        }

        function toEmptyString(str: string): string{
            if(str != undefined) {

                if(str == null){
                    return ''
                }

                return str.toString()
            } else {

                return ''
            }

        }
    }

    async kit({details, rules}: IProductKitInput, unitaryPricing: IPricingInput): Promise<IProductKitOutput>{

        const quantity = toInteger(rules.quantity)

        const result = kitPrice(100, 2, 2, '%', 2)

        const object: any = {
            details: {
                is_kit: 1,
                ean: toEmptyString(details.ean),
                ncm: toEmptyString(details.ncm),
                product_name: toEmptyString(details.product_name),
                product_description: toEmptyString(details.description),
                brand: toEmptyString(details.brand),
                model: toEmptyString(details.model),
                weight: toInteger(details.weight)*quantity,
                length: toInteger(details.length),
                width: toInteger(details.width)*quantity,
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
                creation_date: await Datetime(),
                modified: await Datetime(),
                comments: toEmptyString(details.comments)
            },
            pricing: {
                mundial: {
                    is_kit: 1,
                    cost_price: toFloat(unitaryPricing.cost) * quantity,
                    profit: profitCheck(toFloat(unitaryPricing.profit)),
                    tray_price: kitPrice(
                        toFloat(unitaryPricing.price),
                        quantity,
                        toInteger(rules.price_rule),
                        toEmptyString(rules.discount_type),
                        toFloat(rules.discount_value)
                        ),
                    tray_promotional_price: kitPrice(
                        toFloat(unitaryPricing.promotional_price),
                        quantity,
                        toInteger(rules.price_rule),
                        toEmptyString(rules.discount_type),
                        toFloat(rules.discount_value)
                        ),
                    start_promotion: toStringDate(unitaryPricing.start_promotion),
                    end_promotion: toStringDate(unitaryPricing.end_promotion),
                    tray_stock: Math.floor(toInteger(unitaryPricing.stock)/quantity),
                    tray_minimum_stock: 1,
                    tray_main_category_id: await ConvertCategories.hubMainCategoryToTray(details.main_category_id, 668385),
                    tray_related_categories: await ConvertCategories.hubRelatedCategoriesToTray(details.related_categories, 668385),
                    modified: await Datetime()
                }
            }, 
            rules: {
                quantity: quantity,
                discount_type: rules.discount_type,
                discount_value: toFloat(rules.discount_value),
                price_rule: toInteger(rules.price_rule),
            }
        }

        return object

        function toFloat(value: string | number): number{
            if(typeof(value) == 'string'){
                const cleanString = (value.replace('.', '')).replace(',', '.')
                return parseFloat(cleanString)
            } else {
                return value
            }
        }

        function toInteger(value: string | number): number{
            if(typeof(value) == 'string'){
                const cleanString = (value.replace('.', '')).replace(',', '.')
                return Math.floor(parseFloat(cleanString))
            } else {
                return value
            }
        }

        function profitCheck(profit: number): number{
            if(profit > 1 && profit < 2){
                return (profit * 100) - 100
            }

            if(profit > 0 && profit < 1){
                return profit * 100
            }

            if(profit >= 2){
                return profit
            }

            return profit
        }

        function toStringDate(date: string | Date): string{

            if(typeof(date) === 'object'){
                return format(date, 'yyyy-MM-dd hh:mm:ss')
            } else {
                if(date.length == 0){
                    return '0000-00-00 hh:mm:ss'
                }

                return format(parseISO(date), 'yyyy-MM-dd hh:mm:ss')
            }
        }

        function toEmptyString(str: string): string{
            if(str != undefined) {

                if(str == null){
                    return ''
                }

                return str.toString()
            } else {

                return ''
            }

        }

        function kitPrice(price: number, quantity: number, priceRule: number, discountType: string, discountValue: number): number{
            
            if(price == 0){
                return price
            }
            
            if(priceRule == 1){
                return price * quantity
            }

            if(discountType == '$'){
                return ( price * quantity ) - discountValue 
            }

            if(discountType == '%') {
                return ( price * quantity ) * ( ( discountValue / 100 ) + 1 )
            }

            return price * quantity
        }
    }

    async hubProduct(product: IDetailsInput){
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
            picture_source_1: this.toEmptyString(product.images[0].imageUrl),
            picture_source_2: this.toEmptyString(product.images[1].imageUrl),
            picture_source_3: this.toEmptyString(product.images[2].imageUrl),
            picture_source_4: this.toEmptyString(product.images[3].imageUrl),
            picture_source_5: this.toEmptyString(product.images[4].imageUrl),
            picture_source_6: this.toEmptyString(product.images[5].imageUrl),
            warranty: this.toEmptyString(product.warranty),
            virtual_product: 0,
            content: this.toEmptyString(product.product_name),
            creation_date: await Datetime(),
            modified: await Datetime(),
            comments: this.toEmptyString(product.comments)
        }
    }

    async createPricing(pricing: IPricingInput, storeId: number): Promise<IPricingOutput>{
        

        return {
            is_kit: 0,
            hub_id: pricing.hub_id,
            tray_product_id: pricing.tray_product_id? pricing.tray_product_id : 0,
            cost_price: this.toFloat(pricing.cost),
            profit: this.profitCheck(this.toFloat(pricing.profit)),
            tray_price: this.toFloat(pricing.price),
            tray_promotional_price: this.toFloat(pricing.promotional_price),
            start_promotion: this.toStringDate(pricing.start_promotion),
            end_promotion: this.toStringDate(pricing.end_promotion),
            tray_stock: this.toInteger(pricing.stock),
            tray_minimum_stock: 1,
            tray_main_category_id: await ConvertCategories.hubMainCategoryToTray(pricing.main_category_id, storeId),
            tray_related_categories: await ConvertCategories.hubRelatedCategoriesToTray(pricing.related_categories, storeId),
            modified: await Datetime()
        }
    }

    async createKitPricing(pricing: IPricingInput, rules: IRulesInput): Promise<IPricingOutput>{

        const quantity = rules.quantity

        return {
            is_kit: 1,
            hub_id: pricing.hub_id,
            tray_product_id: pricing.tray_product_id? pricing.tray_product_id : 0,
            cost_price: this.toFloat(pricing.cost) * quantity,
            profit: this.profitCheck(this.toFloat(pricing.profit)),
            tray_price: kitPrice(
                this.toFloat(pricing.price),
                quantity,
                this.toInteger(rules.price_rule),
                this.toEmptyString(rules.discount_type),
                this.toFloat(rules.discount_value)
                ),
            tray_promotional_price: kitPrice(
                this.toFloat(pricing.promotional_price),
                quantity,
                this.toInteger(rules.price_rule),
                this.toEmptyString(rules.discount_type),
                this.toFloat(rules.discount_value)
                ),
            start_promotion: this.toStringDate(pricing.start_promotion),
            end_promotion: this.toStringDate(pricing.end_promotion),
            tray_stock: Math.floor(this.toInteger(pricing.stock)/quantity),
            tray_minimum_stock: 1,
            tray_main_category_id: await ConvertCategories.hubMainCategoryToTray(pricing.main_category_id, 668385),
            tray_related_categories: await ConvertCategories.hubRelatedCategoriesToTray(pricing.related_categories, 668385),
            modified: await Datetime()
        }

        function kitPrice(price: number, quantity: number, priceRule: number, discountType: string, discountValue: number): number{
            
            if(price == 0){
                return price
            }
            
            if(priceRule == 1){
                return price * quantity
            }

            if(discountType == '$'){
                return ( price * quantity ) - discountValue 
            }

            if(discountType == '%') {
                return ( price * quantity ) * ( 1 - ( discountValue / 100 ) )
            }

            return price * quantity
        }
    }

    async createKitRule(){

    }

    toFloat(value: string | number): number{
        if(typeof(value) == 'string'){
            const cleanString = (value.replace('.', '')).replace(',', '.')
            return parseFloat(cleanString)
        } else {
            return value
        }
    }

    toInteger(value: string | number): number{
        if(typeof(value) == 'string'){
            const cleanString = (value.replace('.', '')).replace(',', '.')
            return Math.floor(parseFloat(cleanString))
        } else {
            return value
        }
    }

    profitCheck(profit: number): number{
        if(profit > 1 && profit < 2){
            return (profit * 100) - 100
        }

        if(profit > 0 && profit < 1){
            return profit * 100
        }

        if(profit >= 2){
            return profit
        }

        return profit
    }

    toStringDate(date: string | Date): string{

        if(typeof(date) === 'object'){
            return format(date, 'yyyy-MM-dd 00:00:00')
        } else {
            if(date.length == 0){
                return 'yyyy-MM-dd 00:00:00'
            }

            return format(parseISO(date), 'yyyy-MM-dd 00:00:00')
        }
    }

    toEmptyString(str: string): string{
        if(str != undefined) {

            if(str == null){
                return ''
            }

            return str.toString()
        } else {

            return ''
        }

    }
}

export default new Validate