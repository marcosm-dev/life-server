"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DASHBOARD = exports.override = exports.add = exports.componentLoader = void 0;
var adminjs_1 = require("adminjs");
var path_1 = require("path");
var url = require("url");
// @ts-ignore
var __dirname = url.fileURLToPath(new URL('.', import.meta.url));
exports.componentLoader = new adminjs_1.ComponentLoader();
var add = function (url, componentName) {
    return exports.componentLoader.add(componentName, path_1.default.join(__dirname, url));
};
exports.add = add;
var override = function (url, componentName) {
    return exports.componentLoader.override(componentName, path_1.default.join(__dirname, url));
};
exports.override = override;
exports.DASHBOARD = (0, exports.add)('components/dashboard', 'Dashboard');
// export const Components = {
//   Dashboard: componentLoader.add('components/dashboard', 'Dashboard'),
//   // other custom components
// }
// /**
//  * Overridable components
//  */
// override('components/top-bar', 'Version')
// override('components/login', 'Login')
// override('components/sidebar-resource-section', 'SidebarResourceSection')
// /**
//  * Common components
//  */
// export const PRODUCTS_LIST = add('components/products-list', 'ProductList')
// export const DONT_TOUCH_THIS_ACTION = add('components/dont-touch-this-action', 'CustomAction')
// export const DETAILED_STATS = add('components/detailed-stats', 'DetailedStats')
// export const THUMB = add('components/thumb', 'Thumb')
// /**
//  * Pages
//  */
// export const CUSTOM_PAGE = add('pages/custom-page', 'CustomPage')
// export const DESIGN_SYSTEM_PAGE = add('pages/design-system-examples/index', 'DesignSystemPage')
