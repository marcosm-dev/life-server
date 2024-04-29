import { OrderModel } from '../../orders/models/Order.js'

export async function ordersVerify(): Promise<void> {
  
  try {
    // const ordersDeleted = await OrderModel.deleteMany({ uuid: { $exists: false } })
    console.log('Eliminados pedidos sin uuid')
    
    const orders = await OrderModel.find({ isSend: { $eq: 0 } })
    // await UserModel.updateMany(
    //   {}, 
    //   { $set: { orders: [] } }
    // ).then(result => {
    //   console.log('Número de documentos modificados:', result.modifiedCount);
    //   // Cerrar la conexión después de la actualización
    // }).catch(err => {
    //   console.error('Error al actualizar los documentos:', err);
    // });
  
    
  } catch (error) {
    throw new Error(`No se han podido eliminar los pedidos: ${error}`)  }
  
}

export async function verifySendedOrders(): Promise<void> {
  
  try {
    
    const orders = await OrderModel.find({ isSend: { $eq: 0 } })

    console.log('Pedidos sin enviar:', orders)
    // await UserModel.updateMany(
    //   {}, 
    //   { $set: { orders: [] } }
    // ).then(result => {
    //   console.log('Número de documentos modificados:', result.modifiedCount);
    //   // Cerrar la conexión después de la actualización
    // }).catch(err => {
    //   console.error('Error al actualizar los documentos:', err);
    // });
  
    
  } catch (error) {
    throw new Error(`No se han podido eliminar los pedidos: ${error}`)  }
  
}
