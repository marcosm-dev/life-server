import { Box, Header, Illustration, Text } from '@adminjs/design-system';
import React from 'react';
const variants = [
    'Accept',
    'Cup',
    'Bag',
    'Beware',
    'Notebook',
    'NotFound',
    'Padlock',
    'Photos',
    'Plug',
    'RocketNew',
    'Tags',
    'Folder',
    'Box',
    'Calendar',
    'Cancel',
    'Cards',
    'Clip',
    'Cloud',
    'Details',
    'Docs',
    'Drawer',
    'IdentityCard',
];
const IllustrationPage = () => (React.createElement(Box, { variant: "grey", id: "illustrations" },
    React.createElement(Header, { as: "a", href: "#illustrations" }, "Illustrations"),
    React.createElement(Box, { variant: "container", flex: true, flexWrap: "wrap", style: { rowGap: 32 } }, variants.map((variant) => (React.createElement(Box, { key: variant, width: 200, height: 200, style: { textAlign: 'center' } },
        React.createElement(Illustration, { variant: variant }),
        React.createElement(Text, null, variant)))))));
export default IllustrationPage;
