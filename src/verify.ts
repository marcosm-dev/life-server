import { fetchProductsVerify } from "./crons/productsVerify.js";

try {
  fetchProductsVerify()
    .then(() => console.log('Cron job completed.'))
    .catch(error => console.error('Cron job failed:', error))
} catch (error) {
  console.error('failed:', error);
}
