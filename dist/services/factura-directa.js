import dotenv from 'dotenv';
dotenv.config({ path: `${process.cwd()}/.env` });
import axios from 'axios';
import config from './config.js';
const CLIENT_ID = process.env.FACTURA_DIRECTA_CLIENT_ID;
const API_KEY = process.env.FACTURA_DIRECTA_API_KEY;
const API_URI = process.env.FACTURA_DIRECTA_API_URI;
export const TAX = ['S_IGIC_7'];
const API_PATH = '/api/profile';
const URL = `${API_URI}/${CLIENT_ID}`;
const headers = {
    'facturadirecta-api-key': `${API_KEY}`,
};
async function getContactById(contactId) {
    const path = `/contacts/${contactId}`;
    const { data } = await axios.get(URL + path, { headers });
    return data;
}
async function getOrCreateContact(payload) {
    const { content: { main } } = payload;
    try {
        const { data } = await axios.get(URL + `/contacts?search=${main.email}`, { headers });
        if (data?.items.length)
            return data.items[0].content.main;
        const response = await axios.post(URL + '/contacts', payload, { headers });
        return response.data;
    }
    catch (error) {
        return error;
    }
}
async function createInvoice(payload, email) {
    try {
        if (!payload.content.main.contact) {
            const { data: { items } } = await axios.get(URL + `/contacts?search=${email}`, { headers });
            payload.content.main.contact = items[0].content.uuid;
        }
        const { data } = await axios.post(URL + '/invoices', payload, { headers });
        return data.content;
    }
    catch (error) {
        throw new Error(`Error al crear la factura, por favor póngase en contacto con nosotros en el ${config.admin.phone}`);
    }
}
async function getInvoiceListById(id) {
    try {
        const { data } = await axios.get(URL + '/invoices', { headers });
        const invoices = data.items.filter(({ content }) => content.main.contact === id);
        return invoices;
    }
    catch (error) {
        throw new Error(`Ha ocurrido algún problema al crear la factura: ${error}`);
    }
}
async function createProduct(product) {
    try {
        const { data } = await axios.post(URL + '/products', product, { headers });
        console.log(data);
    }
    catch (error) {
        console.log(error);
    }
}
async function getAllProducts() {
    try {
        const { data } = await axios.get(`${URL}/products?limit=100`, { headers });
        return data;
    }
    catch (error) {
        throw new Error('Error al buscar productoss');
    }
}
export { getAllProducts, createProduct, getContactById, getOrCreateContact, createInvoice, getInvoiceListById };
