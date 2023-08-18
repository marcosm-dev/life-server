import { Box, Header, Link, Placeholder, Text } from '@adminjs/design-system';
import React, { lazy, Suspense } from 'react';
const ButtonsPage = lazy(() => import('./buttons-page.js'));
const FormPage = lazy(() => import('./form-page.js'));
const IconsPage = lazy(() => import('./icons-page.js'));
const IllustrationPage = lazy(() => import('./illustrations-page.js'));
const MessagesPage = lazy(() => import('./messages-page.js'));
const ModalPage = lazy(() => import('./modal-page.js'));
const TabsPage = lazy(() => import('./tabs-page.js'));
const TypographyPage = lazy(() => import('./typography-page.js'));
const DesignSystemPage = () => {
    const STORYBOOK_URL = window.AdminJS.env.STORYBOOK_URL;
    return (React.createElement(React.Fragment, null,
        React.createElement(Box, { variant: "grey", id: "storyook", "data-css": "design-system-examples" },
            React.createElement(Header, { as: "a", href: "#storyook" }, "Storybook"),
            React.createElement(Box, { variant: "container" },
                React.createElement(Text, null,
                    "For more examples visit our Storybook",
                    React.createElement(Link, { href: STORYBOOK_URL, ml: "md" }, STORYBOOK_URL)))),
        React.createElement(Suspense, { fallback: React.createElement(DesignSytemPagePlaceholder, null) },
            React.createElement(ButtonsPage, null),
            React.createElement(TypographyPage, null),
            React.createElement(ModalPage, null),
            React.createElement(TabsPage, null),
            React.createElement(MessagesPage, null),
            React.createElement(IllustrationPage, null),
            React.createElement(IconsPage, null),
            React.createElement(FormPage, null))));
};
const DesignSytemPagePlaceholder = () => (React.createElement(React.Fragment, null, Array.from({ length: 3 }).map((_, index) => (React.createElement(Box, { variant: "grey", key: index },
    React.createElement(Placeholder, { height: 33, width: 240 }),
    React.createElement(Box, { variant: "container" },
        React.createElement(Placeholder, null)))))));
export default DesignSystemPage;
