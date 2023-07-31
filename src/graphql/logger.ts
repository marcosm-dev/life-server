import { createLogger, format, transports } from 'winston'

const { combine, timestamp, printf } = format;

// Define el formato de los mensajes de log
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

// Crea el logger con las opciones deseadas
const logger = createLogger({
  level: 'debug', // Nivel de log (puedes ajustarlo según tus necesidades)
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console(), // Salida de log en la consola
    // También puedes agregar otros tipos de transporte (por ejemplo, escribir en un archivo)
  ],
});

// Exporta el logger para que pueda ser utilizado en otras partes de la aplicación
export { logger }
