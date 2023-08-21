"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var design_system_1 = require("@adminjs/design-system");
var adminjs_1 = require("adminjs");
var UserList = function () {
    var _a = (0, react_1.useState)(null), data = _a[0], setData = _a[1];
    var api = new adminjs_1.ApiClient();
    var users = (0, adminjs_1.useResource)('User');
    (0, react_1.useEffect)(function () {
        console.log(users);
        var userData = api.resourceAction({ resourceId: 'User', actionName: 'list' });
        setData(userData);
    }, [users]);
    // api.getDashboard()
    //   .then((response) => {
    //     setData(response.data) // { message: 'Hello World' }
    //   })
    //   .catch((error) => {
    //     // handle any errors
    //   });
    //   const { records: users, isLoading, refresh } = useResource({
    //     resource: 'User', // Reemplaza 'User' con el nombre de tu recurso de usuarios
    //   })
    // Si aún está cargando los datos, puedes mostrar un indicador de carga
    // if (isLoading) {
    //   return <Text>Cargando...</Text>
    // }
    return (<design_system_1.Box>
      <design_system_1.Box display="flex" alignItems="center" justifyContent="space-between">
        <design_system_1.H2>Lista de Usuarios</design_system_1.H2>
        <design_system_1.Button onClick={fetch}>Refrescar</design_system_1.Button>
        {JSON.stringify(data)}
      </design_system_1.Box>
      <design_system_1.Table>
        <design_system_1.TableRow property="id" label="ID"/>
        <design_system_1.TableRow property="name" label="Nombre"/>
        <design_system_1.TableRow property="email" label="Email"/>
        <design_system_1.TableRow property="role" label="Rol"/>
        <design_system_1.TableRow property="createdAt" label="Creado el"/>
      </design_system_1.Table>
    </design_system_1.Box>);
};
exports.default = UserList;
