import { IUser } from '../users/interfaces/user.inteface.js'
import { ContentType, FacturaDirectaContent } from '../services/facturaDirecta/facturaDirecta.d.js'
import { OrderLines } from '../generated/graphql.js'

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
          client: '430000',
        },
      },
    },
  }
  return contact
}

export const generateContentData = (
  uuid: string,
  lines: OrderLines[]
): FacturaDirectaContent => {
  const invoice = {
    content: {
      type: 'invoice',
      main: {
        docNumber: {
          series: 'F',
        },
        // taxIncludedPrices: true,
        contact: uuid,
        currency: 'EUR',
        lines,
      },
    },
  }
  return invoice
}

export const generateFacturaDirectaContent = (
  uuid: string,
  lines: OrderLines[],
  type: ContentType,
  series: string = 'F'
): FacturaDirectaContent => {
  const content = {
    content: {
      type,
      main: {
        docNumber: {
          series,
        },
        baseState: 'pending',
        contact: uuid,
        currency: 'EUR',
        lines,
      },
    },
  }
  return content
}
