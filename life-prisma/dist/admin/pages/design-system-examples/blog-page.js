import { Box, Button, Drawer, DrawerContent, DropZone, Header, Icon, Input, Label, RichTextEditor, } from '@adminjs/design-system';
import React, { useState } from 'react';
const BlogPage = () => {
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const handler = (html) => {
        console.log(html);
    };
    return (React.createElement(Box, { variant: "grey", id: "blog" },
        React.createElement(Header, { as: "a", href: "#blog" }, "Blog"),
        React.createElement(Box, { width: 1 },
            isDrawerVisible && (React.createElement(Drawer, null,
                React.createElement(DrawerContent, null,
                    React.createElement(Header.H3, null,
                        React.createElement(Button, { size: "icon", rounded: true, mr: "lg", onClick: () => setIsDrawerVisible(false) },
                            React.createElement(Icon, { icon: "X" })),
                        "Article settings"),
                    React.createElement(Label, null, "Drop splash screen"),
                    React.createElement(DropZone, null)))),
            React.createElement(Box, { variant: "container" },
                React.createElement(Box, { flex: true, flexDirection: "row-reverse", mb: "xl" },
                    React.createElement(Button, { size: "icon", onClick: () => setIsDrawerVisible(true) },
                        React.createElement(Icon, { icon: "Settings" })),
                    React.createElement(Button, { variant: "contained", mr: "default" },
                        React.createElement(Icon, { icon: "Share" }),
                        "Publish"),
                    React.createElement(Button, { mr: "default" },
                        React.createElement(Icon, { icon: "Save" }),
                        "Save")),
                React.createElement(Box, { mb: "xxl" },
                    React.createElement(Input, { variant: "xxl", borderless: true, width: 1, placeholder: "Rich text editor example page" })),
                React.createElement(RichTextEditor, { value: "", onChange: handler })))));
};
export default BlogPage;
