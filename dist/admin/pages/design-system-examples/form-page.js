import { Box, CheckBox, CurrencyInput, DropZone, Header, Input, Label, PhoneInput, Select, TextArea, } from '@adminjs/design-system';
import { useTranslation } from 'adminjs';
import React, { useState } from 'react';
const FormPage = () => {
    const [value, setValue] = useState();
    const [date, setDate] = useState('2021-06-17');
    const options = [
        { value: '1', label: 'Office 1' },
        { value: '2', label: 'Office 2' },
    ];
    const { translateComponent } = useTranslation();
    return (React.createElement(Box, { variant: "grey", id: "form" },
        React.createElement(Header, { as: "a", href: "#form" }, "Form"),
        React.createElement(Box, { variant: "container" },
            React.createElement(Box, { p: "xl", flex: true, justifyContent: "space-between", style: { gap: 16 } },
                React.createElement(Box, { width: "100%" },
                    React.createElement(Label, { htmlFor: "firstName" }, "First name"),
                    React.createElement(Input, { id: "firstName", width: 1 })),
                React.createElement(Box, { width: "100%" },
                    React.createElement(Label, { htmlFor: "lastName" }, "Last name"),
                    React.createElement(Input, { id: "lastName", width: 1 })),
                React.createElement(Box, { width: "100%" },
                    React.createElement(Label, { htmlFor: "phone" }, "Phone"),
                    React.createElement(PhoneInput, { id: "phone" }))),
            React.createElement(Box, { p: "xl", flex: true, justifyContent: "space-between", style: { gap: 16 } },
                React.createElement(Box, { width: "100%" },
                    React.createElement(Label, null, "Select"),
                    React.createElement(Select, { value: value, onChange: (selected) => setValue(selected), options: options })),
                React.createElement(Box, { width: "100%" },
                    React.createElement(Label, null, "Date of birth")),
                React.createElement(Box, { width: "100%" },
                    React.createElement(Label, { htmlFor: "currency" }, "Salary"),
                    React.createElement(CurrencyInput, { id: "currency", intlConfig: { locale: 'en-US', currency: 'GBP' } }))),
            React.createElement(Box, { p: "xl" },
                React.createElement(Label, { htmlFor: "textarea1" }, "Additional"),
                React.createElement(TextArea, { id: "textarea1", width: 1 })),
            React.createElement(Box, { p: "xl" },
                React.createElement(CheckBox, { id: "isActive" }),
                React.createElement(Label, { inline: true, htmlFor: "isActive", ml: "default" }, "Active")),
            React.createElement(Box, { p: "xl" },
                React.createElement(Label, null, "Attachment"),
                React.createElement(DropZone, { validate: { maxSize: 102400, mimeTypes: ['application/pdf', 'image/png'] }, translations: translateComponent('DropZone', { returnObjects: true }) })))));
};
export default FormPage;
