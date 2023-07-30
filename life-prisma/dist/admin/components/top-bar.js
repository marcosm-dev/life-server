import { Box, Button, Icon, Text } from '@adminjs/design-system';
import React from 'react';
import { useSelector } from 'react-redux';
const TopBar = () => {
    const versions = useSelector((state) => state.versions);
    const GITHUB_URL = window.AdminJS.env.GITHUB_URL;
    const SLACK_URL = window.AdminJS.env.SLACK_URL;
    const DOCUMENTATION_URL = window.AdminJS.env.DOCUMENTATION_URL;
    return (React.createElement(Box, { flex: true, flexGrow: 1, justifyContent: "end", alignItems: "center" },
        React.createElement(Text, { ml: "xl", mr: "auto" }, versions.admin),
        React.createElement(Button, { color: "text", as: "a", href: SLACK_URL, target: "_blank" },
            React.createElement(Icon, { icon: "Slack" }),
            "Slack"),
        React.createElement(Button, { color: "text", as: "a", href: GITHUB_URL, target: "_blank" },
            React.createElement(Icon, { icon: "GitHub" }),
            "GitHub"),
        React.createElement(Button, { color: "text", as: "a", href: DOCUMENTATION_URL, target: "_blank" },
            React.createElement(Icon, { icon: "BookOpen" }),
            "Documentation")));
};
export { TopBar };
export default TopBar;
