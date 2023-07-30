import { Box, Tab, Tabs, Header } from '@adminjs/design-system';
import React, { useState } from 'react';
const TabsPage = () => {
    const [selectedTab, setSelectedTab] = useState('first');
    return (React.createElement(Box, { variant: "grey", id: "tabs" },
        React.createElement(Header, { as: "a", href: "#tabs" }, "Tabs"),
        React.createElement(Box, { variant: "container" },
            React.createElement(Tabs, { currentTab: selectedTab, onChange: setSelectedTab },
                React.createElement(Tab, { id: "first", label: "First tab" }, "First"),
                React.createElement(Tab, { id: "second", label: "Second tab" }, "Second"),
                React.createElement(Tab, { id: "third", label: "Third tab" }, "Third")))));
};
export default TabsPage;
