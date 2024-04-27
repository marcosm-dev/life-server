import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
dotenv.config()

const DB_MONGO_URI = process.env.MONGO_URI ?? ''

const connectDB = async () => {
  let url: string = `${DB_MONGO_URI}`
    try {
        const connection = await mongoose.connect(url)
        console.log('DB Conectada correctamente')
        return connection
    } catch (error) {
        console.log('Hubo un error')
        console.log(error) // detener la app
    }
  // Log de errores en base de datos
  mongoose.connection.on('error', (error) => console.error(error))
}

export default connectDB
