import mongoose from 'mongoose'

(async function connectDatabase() {
  // Conexion base de datos
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then((res) => {
    return res.STATES['connected']
    console.log('Connected to MongoDB')
  }).catch((err) => {
    console.error('Error connecting to MongoDB:', err)
  })
  return null
})()