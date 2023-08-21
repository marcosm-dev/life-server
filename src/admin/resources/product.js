"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var product_entity_js_1 = require("../../entities/product.entity.js");
var Product = {
    resource: product_entity_js_1.default,
    options: {
        properties: {
            categoryId: {
                type: 'ID',
                reference: 'Category'
            }
        }
    },
};
exports.default = Product;
