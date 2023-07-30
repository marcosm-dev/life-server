import { Box, Header, MessageBox, Text } from '@adminjs/design-system';
import React from 'react';
const MessagesPage = () => {
    const variants = ['info', 'danger', 'success', 'warning'];
    return (React.createElement(Box, { variant: "grey", id: "modal" },
        React.createElement(Header, { as: "a", href: "#modal" }, "Messages"),
        React.createElement(Box, { variant: "container" },
            variants.map((variant) => (React.createElement(MessageBox, { key: variant, message: variant, variant: variant, mb: "lg", onCloseClick: () => { } }))),
            React.createElement(Text, { my: "xl" }, "With extra body"),
            variants.map((variant) => (React.createElement(MessageBox, { key: variant, message: variant, variant: variant, mb: "lg", onCloseClick: () => { } }, "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga itaque quaerat quia eum ratione ipsum deleniti. Officiis nisi non necessitatibus laudantium blanditiis inventore."))))));
};
export default MessagesPage;
