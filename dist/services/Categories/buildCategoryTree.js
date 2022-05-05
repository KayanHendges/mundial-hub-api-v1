"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildCategoryTree(resultado) {
    let tree = [];
    resultado.map(category => {
        if (category.tray_category_parent_id == 0) {
            const children = ifChildren(category);
            category = Object.assign(Object.assign({}, category), { children: children == null ? null : children.sort(compare) });
            tree.push(category);
        }
    });
    function parentList(id) {
        let list = [];
        function hasParent(id) {
            resultado.map(category => {
                if (category.tray_category_id == id) {
                    list.push(category.hub_category_id);
                    if (category.tray_category_parent_id != 0) {
                        hasParent(category.tray_category_parent_id);
                    }
                }
            });
        }
        hasParent(id);
        return list.reverse();
    }
    function ifChildren(category) {
        let childrens = [];
        resultado.map(children => {
            if (children.tray_category_parent_id == category.tray_category_id) {
                childrens.push(children = Object.assign(Object.assign({}, children), { parent_list_id: parentList(children.tray_category_parent_id), children: ifChildren(children) }));
            }
        });
        if (childrens.length == 0) {
            return null;
        }
        return childrens.sort(compare);
    }
    function compare(a, b) {
        if (a.order_list > b.order_list) {
            return 1;
        }
        if (a.order_list < b.order_list) {
            return -1;
        }
        if (a.order_list == b.order_list) {
            return 0;
        }
    }
    return tree.sort(compare);
}
exports.default = buildCategoryTree;
