"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopBar = void 0;
var design_system_1 = require("@adminjs/design-system");
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var TopBar = function () {
    var versions = (0, react_redux_1.useSelector)(function (state) { return state.versions; });
    var GITHUB_URL = window.AdminJS.env.GITHUB_URL;
    var SLACK_URL = window.AdminJS.env.SLACK_URL;
    var DOCUMENTATION_URL = window.AdminJS.env.DOCUMENTATION_URL;
    return (<design_system_1.Box flex flexGrow={1} justifyContent="end" alignItems="center">
      <design_system_1.Text ml="xl" mr="auto">
        {versions.admin}
      </design_system_1.Text>
      <design_system_1.Button color="text" as="a" href={SLACK_URL} target="_blank">
        <design_system_1.Icon icon="Slack"/>
        Slack
      </design_system_1.Button>
      <design_system_1.Button color="text" as="a" href={GITHUB_URL} target="_blank">
        <design_system_1.Icon icon="GitHub"/>
        GitHub
      </design_system_1.Button>
      <design_system_1.Button color="text" as="a" href={DOCUMENTATION_URL} target="_blank">
        <design_system_1.Icon icon="BookOpen"/>
        Documentation
      </design_system_1.Button>
    </design_system_1.Box>);
};
exports.TopBar = TopBar;
exports.default = TopBar;
