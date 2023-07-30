import { Box, H3, Text } from '@adminjs/design-system';
import React from 'react';
const DontTouchThis = (props) => {
    const { record } = props;
    return (React.createElement(Box, { flex: true, flexDirection: ['column', 'column', 'column', 'row'], style: { gap: 16 } },
        React.createElement(Box, { variant: "container", boxShadow: "card" },
            React.createElement(H3, null, "Example of a simple page"),
            React.createElement(Text, null, "Where you can put almost everything like this:"),
            React.createElement(Box, { as: "div" },
                React.createElement("img", { src: "https://i.redd.it/rd39yuiy9ns21.jpg", alt: "stupid cat", width: 300 }))),
        React.createElement(Box, { variant: "container", boxShadow: "card" },
            React.createElement(Text, null, "Or (more likely), operate on a returned record:"),
            React.createElement(Box, { maxHeight: 500, overflowY: "scroll" },
                React.createElement("pre", { style: { fontFamily: 'monospace' } }, JSON.stringify(record, null, 2))))));
};
export default DontTouchThis;
