import { Box, Header } from '@adminjs/design-system';
import React from 'react';
import { ModalExample } from '../../components/design-system-examples/index.js';
const ModalPage = () => (React.createElement(Box, { variant: "grey", id: "modal" },
    React.createElement(Header, { as: "a", href: "#modal" }, "Modal"),
    React.createElement(Box, { variant: "container" },
        React.createElement(ModalExample, null))));
export default ModalPage;
