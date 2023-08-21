"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable react/jsx-one-expression-per-line */
var react_1 = require("react");
var design_system_1 = require("@adminjs/design-system");
var adminjs_1 = require("adminjs");
var SidebarResourceSection = function (_a) {
    var resources = _a.resources;
    var elements = (0, adminjs_1.useNavigationResources)(resources);
    var translateLabel = (0, adminjs_1.useTranslation)().translateLabel;
    var openUrl = function (url) { return function () {
        window.open(url, '_blank');
    }; };
    elements.unshift({
        icon: 'Truck',
        label: translateLabel('kanbanBoard'),
        onClick: openUrl('https://github.com/orgs/SoftwareBrothers/projects/5'),
    });
    elements.unshift({
        icon: 'PieChart',
        label: translateLabel('stats'),
        onClick: openUrl('https://stats.adminjs.co'),
    });
    return <design_system_1.Navigation label={translateLabel('navigation')} elements={elements}/>;
};
exports.default = SidebarResourceSection;
