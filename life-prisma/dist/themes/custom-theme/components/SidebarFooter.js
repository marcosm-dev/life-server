import { Avatar, Box, SmallText, Title, Tooltip } from '@adminjs/design-system';
import { ViewHelpers, useTranslation } from 'adminjs';
import React from 'react';
import { useSelector } from 'react-redux';
const h = new ViewHelpers();
const SidebarFooter = () => {
    const session = useSelector((state) => state.session);
    const { title, email, avatarUrl } = session;
    const { tb } = useTranslation();
    if (!session)
        return null;
    return (React.createElement(Box, { mt: "lg", mb: "md" },
        React.createElement(Box, { flex: true, flexDirection: "row", alignItems: "center", px: "xl", mb: "lg" },
            React.createElement(Avatar, { src: avatarUrl, alt: email, mr: "lg" }, email.slice(0, 1).toUpperCase()),
            React.createElement(Tooltip, { direction: "right", title: tb('logout') },
                React.createElement(Box, { as: "a", href: h.logoutUrl() },
                    React.createElement(Title, null, email),
                    title && React.createElement(SmallText, null, title))))));
};
export default SidebarFooter;
