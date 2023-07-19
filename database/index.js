import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE, process.env.USERNAME, process.env.PASSWORD, {
	host: process.env.HOST,
	dialect: 'postgres',
	port: process.env.DB_PORT,
})

async function checkConnection() {
	try {
		await sequelize.authenticate()
		console.log('Connection to DB has been established successfully.')
	} catch (error) {
		throw error
	}
}

async function syncModels(value) {
	const state = {
		alter: { alter: true },
		force: { force: false },
	}

	try {
		await sequelize.sync(state[value] || '')
		console.log(`All models were synchronized successfully using sync(${JSON.stringify(state[value]) || ''}).`)
	} catch (error) {
		throw error
	}
}

// Sincronizar el modelo con la base de datos
// (async () => {
// 	try {
// 		await sequelize.sync({ alter: true }); // Esto creará la tabla en la base de datos
// 		console.log('Modelo sincronizado correctamente.');
// 	} catch (error) {
// 		console.error('Error al sincronizar el modelo:', error);
// 	}
// })();

export { sequelize, checkConnection, syncModels }