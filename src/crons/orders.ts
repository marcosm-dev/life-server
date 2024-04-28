import { ordersVerify } from '../services/cron/orders.js'
import connectDB from '../config/db.js'

export async function fetchData() {
  try {
    console.log('connectDB...')
    await connectDB()
   
    console.log('Actualizando pedidos...')
    await ordersVerify()
    console.log('Fín.')
  } catch (error) {
    console.error(error)
  }
}
