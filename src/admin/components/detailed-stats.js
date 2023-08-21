"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var design_system_1 = require("@adminjs/design-system");
var adminjs_1 = require("adminjs");
var DetailedStats = function (props) {
    return (<design_system_1.DrawerContent>
      <adminjs_1.ActionHeader {...props} omitActions={true}/>
      <design_system_1.H5 mt="xxl">Custom action example</design_system_1.H5>
      <design_system_1.Text>Where you can do whatever you like...</design_system_1.Text>
    </design_system_1.DrawerContent>);
};
exports.default = DetailedStats;
