import * as dotenv from 'dotenv'
dotenv.config({ path: `${process.cwd()}/.env`})
import axios from 'axios'

import config from './config.js'
import { Contact, Invoice, InvoiceTo } from './factura-directa.d.js'

const CLIENT_ID = process.env.FACTURA_DIRECTA_CLIENT_ID
const API_KEY = process.env.FACTURA_DIRECTA_API_KEY
const API_URI = process.env.FACTURA_DIRECTA_API_URI

export const TAX = ['S_IGIC_7']

// Ruta de la API de facturadirecta a la que deseas acceder
const API_PATH = '/api/profile'
const URL = `${API_URI}/${CLIENT_ID}`

console.log(URL)
// Función para realizar una solicitud a la API de facturadirecta

const headers = {
  'facturadirecta-api-key': `${API_KEY}`,
}

async function getContactById(contactId: string) {
  const path = `/contacts/${contactId}`

  try {
    const { data } = await axios.get(URL + path, { headers })
    return data
  } catch (error: any) {
    throw new Error(`Error al buscar o crear el contacto: ${error.message}`)
  }

}

async function getOrCreateContact(payload: Contact) {
  const { content: { main } } = payload 


  try {

      // Comprobar si existe ya el usuario en Factura Directa
      const { data } = await axios.get(URL + `/contacts?search=${main.email}`, { headers })
      if (data?.items.length) {
        return data.items[0]
      }
      
      const response = await axios.post(URL + '/contacts', payload, { headers })
      return response.data
    

  } catch (response: any) {
      throw new Error(`Error al crear contacto: ${response.message}`)
  }
}

async function createInvoice(payload: Invoice) {
  try {
      const { data } = await axios.post(URL + '/invoices', payload, { headers })
      return data

  } catch (error) {
      console.log(error)
      throw new Error(`Error al crear la factura, por favor póngase en contacto con nosotros en el ${config.admin.phone}`)
  }
}

async function sendInvoice(uuid: string, to: InvoiceTo) {
  try {
    const { data } = await axios.put(`${URL}/invoices/${uuid}/send`, to, { headers })

    return data
  } catch (error: any) {
    throw new Error (`Ha ocurrido algo an enviar la factura email: ${error.message}`)
  }
}

async function getInvoiceListById(id: string) {
  try {
    const { data } = await axios(URL + '/invoices', { headers })
    // @ts-ignore
    const invoices: any = data.items.filter(({ content }) => content.main.contact === id)
    
    return invoices
  } catch(error: any) {
    throw new Error(`Ha ocurrido algún problema al crear la factura: ${error}`)
  }
}

async function createProduct(product: any) {
  try {
    const { data } = await axios.post(URL + '/products', product, { headers })
    console.log(data)
  } catch (error) {
    console.log(error)
  }
}

async function getAllProducts() {
  try {
      const { data } = await axios(`${URL}/products?limit=100`, { headers })
      console.log(JSON.stringify(data, null, 2))
      return data
  } catch (error) {
      throw new Error('Error al buscar productoss')
  }
}

async function getAllContacts() {
  try {
      const { data } = await axios(`${URL}/contacts`, { headers })
      console.log(JSON.stringify(data, null, 2))
      return data
  } catch (error) {
      throw new Error('Error al buscar contactos')
  }
}

export {
  sendInvoice,
  getAllProducts,
  createProduct,
  getContactById,
  getOrCreateContact,
  createInvoice,
  getInvoiceListById
}