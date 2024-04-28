import connectDB from '../config/db.js'
import { ordersVerify } from '../services/cron/orders.js';

export async function fetchOrdersVerify() {
  console.log('hola mundo')
  try {
    console.log('connectDB...')
    const db = await connectDB()
    
    if (!db) {
      throw new Error('No se pudo conectar a la base de datos')
    }
    console.log('Actualizando pedidos...')
    await ordersVerify()

    
    await db.disconnect()
    console.log('Fín.')
  } catch (error) {
    console.error(error)
  }

}
