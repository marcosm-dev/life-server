import React, { useEffect, useState } from 'react';
import { prisma } from 'src/prisma/config.js';
const CustomCategorySelector = (props) => {
    const { property, record, onChange } = props;
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            const allCategories = await prisma.category.findMany();
            setCategories(allCategories);
        };
        fetchCategories();
    }, []);
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        onChange(name, value);
    };
    return (React.createElement("div", null,
        React.createElement("select", { name: property.name, value: record.params[property.name] || '', onChange: handleInputChange },
            React.createElement("option", { value: "" }, "Selecciona una categor\u00EDa"),
            categories.map((category) => (React.createElement("option", { key: category.id, value: category.id }, category.nombre))))));
};
export default CustomCategorySelector;
