import { createLogger, format, transports } from 'winston'
const { combine, timestamp, printf } = format

// Define el formato de los mensajes de log
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`
})

// Crea el logger
const logger = createLogger({
  level: 'debug',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  transports: [
    new transports.Console() // Salida de log en la consola
  ]
})

export { logger }
