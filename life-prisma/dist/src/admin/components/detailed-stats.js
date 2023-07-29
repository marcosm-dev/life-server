import React from 'react';
import { H5, Text, DrawerContent } from '@adminjs/design-system';
import { ActionHeader } from 'adminjs';
const DetailedStats = (props) => {
    return (React.createElement(DrawerContent, null,
        React.createElement(ActionHeader, { ...props, omitActions: true }),
        React.createElement(H5, { mt: "xxl" }, "Custom action example"),
        React.createElement(Text, null, "Where you can do whatever you like...")));
};
export default DetailedStats;
