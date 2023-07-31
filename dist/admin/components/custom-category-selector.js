import React, { useState } from 'react';
const CustomCategorySelector = (props) => {
    const { property, record, onChange } = props;
    const [categories, setCategories] = useState([]);
    console.log(props);
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        onChange(name, value);
    };
    return (React.createElement("div", null,
        React.createElement("select", { name: property.name, value: record.params[property.name] || '', onChange: handleInputChange },
            React.createElement("option", { value: "" }, "Categor\u00EDa"),
            categories.map((category) => (React.createElement("option", { key: category.id, value: category.id }, category.nombre))))));
};
export default CustomCategorySelector;
