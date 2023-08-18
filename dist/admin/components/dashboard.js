import React, { useEffect, useState } from 'react';
import { Box, Table, Button, H2, TableRow, } from '@adminjs/design-system';
import { ApiClient, useResource } from 'adminjs';
const UserList = () => {
    const [data, setData] = useState(null);
    const api = new ApiClient();
    const users = useResource('User');
    useEffect(() => {
        console.log(users);
        const userData = api.resourceAction({ resourceId: 'User', actionName: 'list' });
        console.log(userData);
        setData(userData);
    }, [users]);
    return (React.createElement(Box, null,
        React.createElement(Box, { display: "flex", alignItems: "center", justifyContent: "space-between" },
            React.createElement(H2, null, "Lista de Usuarios"),
            React.createElement(Button, { onClick: fetch }, "Refrescar"),
            JSON.stringify(data)),
        React.createElement(Table, null,
            React.createElement(TableRow, { property: "id", label: "ID" }),
            React.createElement(TableRow, { property: "name", label: "Nombre" }),
            React.createElement(TableRow, { property: "email", label: "Email" }),
            React.createElement(TableRow, { property: "role", label: "Rol" }),
            React.createElement(TableRow, { property: "createdAt", label: "Creado el" }))));
};
export default UserList;
