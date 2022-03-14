export interface IProduct {
    hub_id: number;
    ean: string;
    modified: Date | null;
    is_kit: number;
    reference: string;
    product_slug: string | null;
    ncm: string | null;
    product_name: string;
    product_title: string | null;
    product_small_description: string | null;
    product_description: string | null;
    brand: string | null;
    model: string | null;
    weight: number;
    length: number;
    width: number;
    height: number;
    main_category_id: number;
    related_categories: string | null;
    available: number;
    availability: string | null;
    availability_days: number | null;
    warranty: string | null;
    release_date: Date | null;
    picture_source_1: string | null;
    picture_source_1_90: string | null;
    picture_source_2: string | null;
    picture_source_2_90: string | null;
    picture_source_3: string | null;
    picture_source_3_90: string | null;
    picture_source_4: string | null;
    picture_source_4_90: string | null;
    picture_source_5: string | null;
    picture_source_5_90: string | null;
    picture_source_6: string | null;
    picture_source_6_90: string | null;
    metatag: string | null;
    type: string | null;
    content: string | null;
    local: string | null;
    virtual_product: number;
    creation_date: Date;
    comments: string | null;
}

export interface IProductInsert {
    ean: string;
    is_kit: number;
    reference: string;
    product_slug?: string | null;
    ncm?: string;
    product_name: string;
    product_title?: string;
    product_small_description?: string;
    product_description: string;
    brand: string;
    model: string;
    weight: number;
    length: number;
    width: number;
    height: number;
    main_category_id: number;
    related_categories: number[];
    available: number;
    availability: string;
    availability_days: number;
    warranty: string;
    release_date?: Date;
    picture_source_1: string;
    picture_source_1_90?: string;
    picture_source_2: string;
    picture_source_2_90?: string;
    picture_source_3: string;
    picture_source_3_90?: string;
    picture_source_4: string;
    picture_source_4_90?: string;
    picture_source_5: string;
    picture_source_5_90?: string;
    picture_source_6: string;
    picture_source_6_90?: string;
    metatag?: string;
    type?: string | null;
    content?: string | null;
    local?: string | null;
    virtual_product: number;
    creation_date: Date;
    comment?: string;
}

export interface IProductUpdate {
    hub_id: number;
    ean?: string;
    modified?: Date;
    is_kit?: number;
    reference?: string;
    product_slug?: string;
    ncm?: string;
    product_name?: string;
    product_title?: string;
    product_small_description?: string;
    product_description?: string;
    brand?: string;
    model?: string;
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
    main_category_id?: number;
    related_categories?: number[];
    available?: number;
    availability?: string;
    availability_days?: number;
    warranty?: string;
    release_date?: Date;
    picture_source_1?: string;
    picture_source_1_90?: string;
    picture_source_2?: string;
    picture_source_2_90?: string;
    picture_source_3?: string;
    picture_source_3_90?: string;
    picture_source_4?: string;
    picture_source_4_90?: string;
    picture_source_5?: string;
    picture_source_5_90?: string;
    picture_source_6?: string;
    picture_source_6_90?: string;
    metatag?: string;
    type?: string;
    content?: string;
    local?: string;
    virtual_product?: number;
    comments?: string;
}

export interface IPricing {
    tray_pricing_id: number;
    tray_adm_user: string;
    tray_store_id: number;
    hub_id: number;
    tray_product_id: number | null;
    is_kit: number;
    cost_price: number;
    profit: number;
    tray_price: number;
    tray_promotional_price: number;
    start_promotion: Date;
    end_promotion: Date;
    tray_stock: number;
    tray_minimum_stock: number;
    tray_main_category_id: number;
    tray_related_categories: number[];
    modified: Date | null;
}

export interface IPricingInsert {
    hub_id: number;
    tray_product_id: number;
    is_kit: number;
    cost_price: number;
    profit: number;
    tray_price: number;
    tray_promotional_price: number;
    start_promotion: string;
    end_promotion: string;
    tray_stock: number;
    tray_main_category_id: number;
    tray_related_categories: number[];
}

export interface IPricingUpdate {
    tray_adm_user?: string,
    tray_store_id?: number,
    hub_id?: number;
    tray_product_id?: number;
    is_kit?: number;
    cost_price?: number;
    profit?: number;
    tray_price?: number;
    tray_promotional_price?: number;
    start_promotion?: string;
    end_promotion?: string;
    tray_stock?: number;
    tray_minimum_stock?: number;
    tray_main_category_id?: number;
    tray_related_categories?: number[];
}

export interface IKitRules {
    hub_rules_id: number;
    tray_rule_id: number | null;
    tray_pricing_id: number;
    tray_product_id: number;
    hub_id: number;
    tray_product_parent_id: number;
    kit_price: number;
    quantity: number;
    price_rule: number;
    discount_type: string;
    discount_value: number;
    modified: Date;
    creation_date: Date;
}

export interface IKitRulesInsert {
    tray_pricing_id: number;
    tray_product_id: number;
    hub_id: number;
    tray_product_parent_id: number;
    kit_price: number;
    quantity: number;
    price_rule: number;
    discount_type: string;
    discount_value: number;
}

export interface IKitRulesUpdate {
    hub_rules_id?: number;
    tray_rule_id?: number | null;
    tray_pricing_id?: number;
    tray_product_id?: number;
    hub_id?: number;
    tray_product_parent_id?: number;
    kit_price?: number;
    quantity?: number;
    price_rule?: number;
    discount_type?: string;
    discount_value?: number;
}