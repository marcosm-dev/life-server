import { productsVerify } from '../services/cron/products.js'
import connectDB from '../config/db.js'

export async function fetchProductsVerify() {
  console.log('hola mundo')
  try {
    console.log('connectDB...')
    const db = await connectDB()

    if (!db) {
      throw new Error('No se pudo conectar a la base de datos')
    }
    console.log('Actualizando pedidos...')
    await productsVerify()

    await db.disconnect()
    console.log('Fín.')
  } catch (error) {
    console.error(error)
  }
}
