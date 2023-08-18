import { Box, Button, Header, Icon, Text } from '@adminjs/design-system';
import React from 'react';
const Wrapper = ({ children, title }) => (React.createElement(Box, { mb: "xl" },
    React.createElement(Text, { mb: "md" }, title),
    React.createElement(Box, { flex: true, flexDirection: "row", alignItems: "center", style: { gap: 16 } }, children)));
const colors = ['primary', 'secondary', 'success', 'info', 'danger', 'text'];
const [primary] = colors;
const ButtonsPage = () => (React.createElement(Box, { variant: "grey", id: "buttons" },
    React.createElement(Header, { as: "a", href: "#buttons" }, "Buttons"),
    React.createElement(Box, { variant: "container" },
        React.createElement(Wrapper, { title: "Text (default)" }, colors.map((color) => (React.createElement(Button, { key: color, variant: "text", color: color }, color)))),
        React.createElement(Wrapper, { title: "Text rounded" }, colors.map((color) => (React.createElement(Button, { key: color, variant: "text", rounded: true, color: color }, color)))),
        React.createElement(Wrapper, { title: "Contained" }, colors.map((color) => (React.createElement(Button, { key: color, variant: "contained", color: color }, color)))),
        React.createElement(Wrapper, { title: "Contained rounded" }, colors.map((color) => (React.createElement(Button, { key: color, variant: "contained", rounded: true, color: color }, color)))),
        React.createElement(Wrapper, { title: "Outlined" }, colors.map((color) => (React.createElement(Button, { key: color, variant: "outlined", color: color }, color)))),
        React.createElement(Wrapper, { title: "Outlined rounded" }, colors.map((color) => (React.createElement(Button, { key: color, variant: "outlined", rounded: true, color: color }, color)))),
        React.createElement(Wrapper, { title: "Light" }, colors.map((color) => (React.createElement(Button, { key: color, variant: "light", color: color }, color)))),
        React.createElement(Wrapper, { title: "Light rounded" }, colors.map((color) => (React.createElement(Button, { key: color, variant: "light", rounded: true, color: color }, color)))),
        React.createElement(Wrapper, { title: "Sizes (small, medium, large)" },
            React.createElement(Button, { variant: "outlined", size: "sm", color: primary }, primary),
            React.createElement(Button, { variant: "outlined", color: primary }, primary),
            React.createElement(Button, { variant: "outlined", size: "lg", color: primary }, primary)),
        React.createElement(Wrapper, { title: "With icon" }, colors.map((color) => (React.createElement(Button, { key: color, rounded: true, color: color },
            React.createElement(Icon, { icon: "Plus" }),
            color)))),
        React.createElement(Wrapper, { title: "Icon only" }, colors.map((color) => (React.createElement(Button, { key: color, rounded: true, size: "icon", color: color },
            React.createElement(Icon, { icon: "Home" }))))),
        React.createElement(Wrapper, { title: "Icon only (outlined)" }, colors.map((color) => (React.createElement(Button, { key: color, variant: "outlined", rounded: true, size: "icon", color: color },
            React.createElement(Icon, { icon: "Heart" }))))))));
export default ButtonsPage;
