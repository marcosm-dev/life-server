import React, { useEffect, useState } from 'react'
import {
  Box,
  Table,
  Button,
  H2,
  H5,
  Illustration,
  Text,
  TableRow,
} from '@adminjs/design-system'
import { ApiClient, useResource} from 'adminjs'


const UserList = () => {

  const [data, setData] = useState(null)
  const api = new ApiClient()
  const users = useResource('User')

  useEffect(() => {
    console.log(users)
    const userData = api.resourceAction({ resourceId: 'User', actionName: 'list'})
    console.log(userData)
    setData(userData)
  }, [users])
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

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <H2>Lista de Usuarios</H2>
        <Button onClick={fetch}>Refrescar</Button>
        {JSON.stringify(data)}
      </Box>
      <Table
        // data={users.map((user) => ({
        //   id: user.id,
        //   name: user.name,
        //   email: user.email,
        //   role: user.role,
        //   createdAt: user.createdAt,
        // }))}
      >
        <TableRow property="id" label="ID" />
        <TableRow property="name" label="Nombre" />
        <TableRow property="email" label="Email" />
        <TableRow property="role" label="Rol" />
        <TableRow property="createdAt" label="Creado el" />
      </Table>
    </Box>
  )
}

export default UserList
