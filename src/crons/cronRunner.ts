import cron from 'node-cron'
import { fetchData } from './orders.js'

export function scheduleCronJobs() {
  console.log('Iniciando tareas cron...')
  //Definiendo la tarea cron para ejecutar cada día '0 * * * *'
  cron.schedule('0 0 * * *', () => {
    fetchData()
      .then(() => console.log('Cron job completed.'))
      .catch(error => console.error('Cron job failed:', error));
  });

  console.log('Cron job has been scheduled.')
}
