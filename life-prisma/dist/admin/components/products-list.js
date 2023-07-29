import React from 'react';
import { Box, FormGroup, Label, Table, TableBody, TableCell, TableHead, TableRow } from '@adminjs/design-system';
import { flat, useTranslation } from 'adminjs';
const ProductsList = (props) => {
    const { translateLabel } = useTranslation();
    const params = flat.unflatten(props.record.params);
    return (React.createElement(FormGroup, { mb: 24 },
        React.createElement(Label, null, "Products list"),
        React.createElement(Box, null,
            React.createElement(Table, null,
                React.createElement(TableHead, null,
                    React.createElement(TableRow, null,
                        React.createElement(TableCell, null, translateLabel('ID')),
                        React.createElement(TableCell, null, translateLabel('Name')),
                        React.createElement(TableCell, null, translateLabel('Quantity')),
                        React.createElement(TableCell, null, translateLabel('Unit price')),
                        React.createElement(TableCell, null, translateLabel('Sum')))),
                React.createElement(TableBody, null,
                    !params.products.length && (React.createElement(TableRow, null,
                        React.createElement(TableCell, { colSpan: 5, style: { textAlign: 'center' } }, "No records"))),
                    params.products.length > 0 &&
                        params.products.map(({ quantity, product }) => (React.createElement(TableRow, { key: product.id },
                            React.createElement(TableCell, null, product.id),
                            React.createElement(TableCell, null, product.name),
                            React.createElement(TableCell, null, quantity),
                            React.createElement(TableCell, null, product.price / 100),
                            React.createElement(TableCell, null, (product.price * quantity) / 100)))))))));
};
export default ProductsList;
