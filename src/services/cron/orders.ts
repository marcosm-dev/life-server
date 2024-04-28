import { OrderModel } from '../../orders/models/Order.js'

export async function ordersVerify() {
  
  try {
    const ordersDeleted = await OrderModel.deleteMany({ uuid: { $exists: false } })
    console.log('Eliminados pedidos sin uuid')
    return ordersDeleted
  } catch (error) {
    throw new Error(`No se han podido eliminar los pedidos: ${error}`)  }
  
}
