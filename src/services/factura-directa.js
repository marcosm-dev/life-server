"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvoiceListById = exports.createInvoice = exports.getOrCreateContact = exports.getContactById = exports.createProduct = exports.getAllProducts = exports.sendInvoice = exports.TAX = void 0;
var dotenv = require("dotenv");
dotenv.config({ path: "".concat(process.cwd(), "/.env") });
var axios_1 = require("axios");
var config_js_1 = require("./config.js");
var CLIENT_ID = process.env.FACTURA_DIRECTA_CLIENT_ID;
var API_KEY = process.env.FACTURA_DIRECTA_API_KEY;
var API_URI = process.env.FACTURA_DIRECTA_API_URI;
exports.TAX = ['S_IGIC_7'];
// Ruta de la API de facturadirecta a la que deseas acceder
var API_PATH = '/api/profile';
var URL = "".concat(API_URI, "/").concat(CLIENT_ID);
console.log(URL);
// Función para realizar una solicitud a la API de facturadirecta
var headers = {
    'facturadirecta-api-key': "".concat(API_KEY),
};
function getContactById(contactId) {
    return __awaiter(this, void 0, void 0, function () {
        var path, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    path = "/contacts/".concat(contactId);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get(URL + path, { headers: headers })];
                case 2:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data];
                case 3:
                    error_1 = _a.sent();
                    throw new Error("Error al buscar o crear el contacto: ".concat(error_1.message));
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getContactById = getContactById;
function getOrCreateContact(payload) {
    return __awaiter(this, void 0, void 0, function () {
        var main, data, response, response_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    main = payload.content.main;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, axios_1.default.get(URL + "/contacts?search=".concat(main.email), { headers: headers })];
                case 2:
                    data = (_a.sent()).data;
                    if (data === null || data === void 0 ? void 0 : data.items.length) {
                        return [2 /*return*/, data.items[0]];
                    }
                    return [4 /*yield*/, axios_1.default.post(URL + '/contacts', payload, { headers: headers })];
                case 3:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
                case 4:
                    response_1 = _a.sent();
                    throw new Error("Error al crear contacto: ".concat(response_1.message));
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.getOrCreateContact = getOrCreateContact;
function createInvoice(payload) {
    return __awaiter(this, void 0, void 0, function () {
        var data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.post(URL + '/invoices', payload, { headers: headers })];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data];
                case 2:
                    error_2 = _a.sent();
                    console.log(error_2);
                    throw new Error("Error al crear la factura, por favor p\u00F3ngase en contacto con nosotros en el ".concat(config_js_1.default.admin.phone));
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.createInvoice = createInvoice;
function sendInvoice(uuid, to) {
    return __awaiter(this, void 0, void 0, function () {
        var data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.put("".concat(URL, "/invoices/").concat(uuid, "/send"), to, { headers: headers })];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data];
                case 2:
                    error_3 = _a.sent();
                    throw new Error("Ha ocurrido algo an enviar la factura email: ".concat(error_3.message));
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.sendInvoice = sendInvoice;
function getInvoiceListById(id) {
    return __awaiter(this, void 0, void 0, function () {
        var data, invoices, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, axios_1.default)(URL + '/invoices', { headers: headers })
                        // @ts-ignore
                    ];
                case 1:
                    data = (_a.sent()).data;
                    invoices = data.items.filter(function (_a) {
                        var content = _a.content;
                        return content.main.contact === id;
                    });
                    return [2 /*return*/, invoices];
                case 2:
                    error_4 = _a.sent();
                    throw new Error("Ha ocurrido alg\u00FAn problema al crear la factura: ".concat(error_4));
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getInvoiceListById = getInvoiceListById;
function createProduct(product) {
    return __awaiter(this, void 0, void 0, function () {
        var data, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.post(URL + '/products', product, { headers: headers })];
                case 1:
                    data = (_a.sent()).data;
                    console.log(data);
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    console.log(error_5);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.createProduct = createProduct;
function getAllProducts() {
    return __awaiter(this, void 0, void 0, function () {
        var data, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, axios_1.default)("".concat(URL, "/products?limit=100"), { headers: headers })];
                case 1:
                    data = (_a.sent()).data;
                    console.log(JSON.stringify(data, null, 2));
                    return [2 /*return*/, data];
                case 2:
                    error_6 = _a.sent();
                    throw new Error('Error al buscar productoss');
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getAllProducts = getAllProducts;
function getAllContacts() {
    return __awaiter(this, void 0, void 0, function () {
        var data, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, axios_1.default)("".concat(URL, "/contacts"), { headers: headers })];
                case 1:
                    data = (_a.sent()).data;
                    console.log(JSON.stringify(data, null, 2));
                    return [2 /*return*/, data];
                case 2:
                    error_7 = _a.sent();
                    throw new Error('Error al buscar contactos');
                case 3: return [2 /*return*/];
            }
        });
    });
}
