import { fetchOrdersVerify } from './src/crons/ordersVerify.js';

try {
  fetchOrdersVerify()
  .then(() => console.log('Cron job completed.'))
  .catch(error => console.error('Cron job failed:', error));
} catch (error) {
  console.error('failed:', error);
}
