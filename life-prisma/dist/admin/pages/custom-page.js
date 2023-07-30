import { Box, Button, H3, Link, Placeholder, Text } from '@adminjs/design-system';
import { ApiClient, useNotice, useTranslation } from 'adminjs';
import React, { useEffect, useState } from 'react';
const api = new ApiClient();
const CustomPage = () => {
    const [text, setText] = useState();
    const addNotice = useNotice();
    const { tc, tm, i18n: { language }, } = useTranslation();
    useEffect(() => {
        api.getPage({ pageName: 'customPage' }).then((res) => {
            setText(tm(res.data.text, { defaultValue: res.data.text }));
        });
    }, [language]);
    const sendSimpleNotice = () => addNotice({
        message: 'CustomPage.message',
        type: 'success',
    });
    const sendTranslatedNotice = () => addNotice({
        message: 'CustomPage.messageWithInterpolation',
        options: {
            someParams: ['param 1', 'param2'].join(', '),
        },
        body: (React.createElement(React.Fragment, null,
            tm('CustomPage.message'),
            " ",
            React.createElement(Link, null, tc('CustomPage.button')))),
    });
    return (React.createElement(Box, { variant: "transparent" },
        React.createElement(Box, { variant: "container" },
            React.createElement(H3, null, tc('CustomPage.header')),
            React.createElement(Box, { flex: true, flexDirection: "column", style: { gap: '1rem' } },
                React.createElement(Text, null, tc('CustomPage.introduction')),
                text ? JSON.stringify(text, null, 2) : React.createElement(Placeholder, { style: { width: 400, height: 14 } }),
                React.createElement(Text, null, tc('CustomPage.ending'))),
            React.createElement(Box, { flex: true, style: { gap: 16 } },
                React.createElement(Button, { variant: "contained", mt: "xl", onClick: sendSimpleNotice }, tc('CustomPage.button')),
                React.createElement(Button, { variant: "contained", mt: "xl", onClick: sendTranslatedNotice }, tc('CustomPage.noticeWithInterpolation'))))));
};
export default CustomPage;
