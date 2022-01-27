export interface IProductPostUnitary {
    ean: string;
    product_name: string;
    ncm: string;
    product_description: string;
    tray_price: number;
    cost_price: number;
    tray_promotional_price: number;
    start_promotion: string;
    end_promotion: string;
    brand: string;
    model: string;
    weight: number;
    length: number;
    width: number;
    height: number;
    tray_stock: number;
    tray_minimum_stock: number;
    tray_main_category_id: number;
    available:  number;
    availability: string;
    availability_days: number;
    reference: string;
    tray_related_categories: number[];
    picture_source_1: string;
    picture_source_2: string;
    picture_source_3: string;
    picture_source_4: string;
    picture_source_5: string;
    picture_source_6: string;
}

export interface IProductKitRule {
    tray_product_parent_id: number,
    tray_product_id: number,
    quantity: number,
    discount_type: string,
    discount_value: number,
    price_rule: number
}