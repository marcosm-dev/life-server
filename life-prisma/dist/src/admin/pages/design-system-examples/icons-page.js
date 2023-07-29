import { Box, H6, Header, Icon } from '@adminjs/design-system';
import React from 'react';
import * as FeatherIcons from 'react-feather';
const IconsPage = () => {
    const IconsSet = Object.keys(FeatherIcons)
        .filter((name) => name !== 'default')
        .map((iconName) => (React.createElement(Box, { width: "120px", height: "120px", key: iconName, style: { textAlign: 'center' } },
        React.createElement(H6, null, iconName),
        React.createElement(Icon, { icon: iconName, size: 32 }))));
    return (React.createElement(Box, { variant: "grey", id: "icons" },
        React.createElement(Header, { as: "a", href: "#icons" }, "Icons"),
        React.createElement(Box, { variant: "container", flex: true, flexWrap: "wrap", justifyContent: "center", style: { gap: '16px' } }, IconsSet)));
};
export default IconsPage;
