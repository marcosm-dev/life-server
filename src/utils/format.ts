import { IInvoice, Lines } from '../services/factura-directa.d.js'
import { IUser } from '../entities/user.entity.d.js'

export const formatContact = (user: IUser) => {
  const contact = {
    content: {
      type: 'contact',
      main: {
        name: user.name,
        fiscalId: user.VATIN,
        currency: 'EUR',
        country: 'ES',
        email: user.email,
        address: user.address,
        zipcode: user.zipCode,
        city: user.city,
        accounts: {
          client: '430000'
        }
      }
    }
  }
  return contact
}

export const generateInvoceData = (uuid: string, lines: Lines[]): IInvoice => {
  const invoice = {
    content: {
      type: 'invoice',
      main: {
        docNumber: {
          series: 'F'
        },
        // taxIncludedPrices: true,
        contact: uuid,
        currency: 'EUR',
        lines
      }
    }
  }

  return invoice
}
