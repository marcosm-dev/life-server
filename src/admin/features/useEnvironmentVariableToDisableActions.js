"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEnvironmentVariableToDisableActions = void 0;
var adminjs_1 = require("adminjs");
var useEnvironmentVariableToDisableActions = function () {
    if (process.env.DISABLE_ADMINJS_ACTIONS === 'true') {
        return (0, adminjs_1.buildFeature)({
            actions: {
                edit: { isAccessible: false },
                delete: { isAccessible: false },
                bulkDelete: { isAccessible: false },
                new: { isAccessible: false },
            },
        });
    }
    return (0, adminjs_1.buildFeature)({});
};
exports.useEnvironmentVariableToDisableActions = useEnvironmentVariableToDisableActions;
