import { ProductModel } from '../../products/models/Product.js';
import { OrderModel } from '../../orders/models/Order.js'
import { UserModel } from '../../users/models/User.js';

export async function ordersVerify() {
  
  try {
    const ordersDeleted = await OrderModel.deleteMany({ uuid: { $exists: false } })
    console.log('Eliminados pedidos sin uuid')

    await UserModel.updateMany(
      {}, 
      { $set: { orders: [] } }
    ).then(result => {
      console.log('Número de documentos modificados:', result.modifiedCount);
      // Cerrar la conexión después de la actualización
    }).catch(err => {
      console.error('Error al actualizar los documentos:', err);
    });
  

    return ordersDeleted
  } catch (error) {
    throw new Error(`No se han podido eliminar los pedidos: ${error}`)  }
  
}
