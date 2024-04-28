// import * as dotenv from 'dotenv'
// dotenv.config({ path: `${process.cwd()}/.env`})
import axios from 'axios'

import {
  Lines,
  type IContact,
  type SendTo,
  type FacturaDirectaContent,
} from './facturaDirecta.d.js'
import { CartItem, OrderLines } from '../../generated/graphql.js'
import { to } from './facturaDirecta.d.js';

const CLIENT_ID = process.env.FACTURA_DIRECTA_CLIENT_ID
const API_KEY = process.env.FACTURA_DIRECTA_API_KEY
const API_URI = process.env.FACTURA_DIRECTA_API_URI

export const TAX = ['S_IGIC_7']

const { ADMIN_EMAIL, OWNER_EMAIL, PRINTER_EMAIL } = process.env

// Ruta de la API de facturadirecta a la que deseas acceder
// const API_PATH = '/api/profile';
const URL = `${API_URI}/${CLIENT_ID}`
// Función para realizar una solicitud a la API de facturadirecta

const headers = {
  'facturadirecta-api-key': `${API_KEY}`,
}

const getItems = (items: CartItem[]) => {
  return items.map((item) => {
    console.log(item)
    const line = {
      account: '700000',
      quantity: item.quantity,
      unitPrice: item.product.price,
      text: item.product.description,
      tax: TAX
    } as OrderLines
    console.log(line)
    if (item.product.uuid) line.document = `pro_${item.product.uuid}`
    return line
  })
}

async function sendEstimate(uuid: string, receivers: SendTo)  {
  receivers.to = [...receivers.to, ADMIN_EMAIL, PRINTER_EMAIL, OWNER_EMAIL] as to

  console.log(receivers)
  try {
    const { data } = await axios.put(`${URL}/estimates/${uuid}/send`, receivers, {
      headers,
    })
    //console.log('data', data)
    return data
  } catch (error) {
    const { message } = error as Error
    throw new Error(`Error al enviar la estimación: ${message}`)
  }
}

async function getContactById(contactId: string) {
  const path = `/contacts/${contactId}`

  try {
    const { data } = await axios.get(URL + path, { headers })
    return data
  } catch (error) {
    throw new Error(
      `Error al buscar o crear el contacto: ${(error as Error).message}`
    )
  }
}

async function getOrCreateContact(payload: IContact) {
  const {
    content: { main },
  } = payload

  try {
    // Comprobar si existe ya el usuario en Factura Directa
    const { data } = await axios.get(URL + `/contacts?search=${main.email}`, {
      headers,
    })
    if (data?.items.length) {
      return data.items[0]
    }

    const response = await axios.post(URL + '/contacts', payload, { headers })
    return response.data
  } catch (response) {
    console.log(response)
    throw new Error(`Error al crear contacto: ${response}`)
  }
}

async function createEstimate(payload: FacturaDirectaContent) {
  try {
    const { data } = await axios.post(URL + '/estimates', payload, { headers })
    return data
  } catch (error) {
    console.log(error)
    throw new Error(
      `Error al crear el presupuesto, por favor póngase en contacto con nosotros`
    )
  }
}

async function createInvoice(payload: FacturaDirectaContent) {
  try {
    const { data } = await axios.post(URL + '/invoices', payload, { headers })
    return data
  } catch (error) {
    console.log(error)
    throw new Error(
      `Error al crear la factura, por favor póngase en contacto con nosotros`
    )
  }
}

async function sendInvoice(uuid: string, to: SendTo) {
  try {
    const { data } = await axios.put(`${URL}/invoices/${uuid}/send`, to, {
      headers,
    })

    return data
  } catch (error) {
    throw new Error(`Ha ocurrido algo an enviar la factura email: ${error}`)
  }
}

async function getInvoiceListById(id: string) {
  try {
    const { data } = await axios(`${URL}/invoices/?contact=${id}`, {
      headers,
    })
    const invoices = data.items.filter(
      ({ content }: FacturaDirectaContent) => content.main.contact === id
    ) as FacturaDirectaContent[]

    return invoices
  } catch (error) {
    throw new Error(`Ha ocurrido algo al recuperar las facturas: ${error}`)
  }
}

async function getInvoices() {
  try {
    const { data } = await axios(URL + '/invoices', { headers })
    return data
  } catch (error) {
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
  getItems,
  sendEstimate,
  sendInvoice,
  getAllProducts,
  getAllContacts,
  createProduct,
  getContactById,
  getOrCreateContact,
  createEstimate,
  createInvoice,
  getInvoices,
  getInvoiceListById,
}
