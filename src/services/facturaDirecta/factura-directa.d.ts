import { OrderLines } from '../generated/graphql'

export interface IContact {
  content: {
    type: string
    main: {
      name: string
      fiscalId: string
      email: string
      currency: string
      country: string
      address: string
      zipcode: string
      city: string
      accounts: {
        client: string
        clientCredit?: string
      }
    }
  }
}

export interface Lines {
  document?: string
  quantity: number
  tax: string[]
  text?: string
  unitPrice: number
  account: string
}

export interface IInvoice {
  content: {
    type: string
    main: {
      docNumber: {
        series: string
      }
      contact: string
      taxIncludedPrices?: boolean
      currency: string
      lines: OrderLines[]
    }
  }
}
export interface InvoiceTo {
  to: string[]
}
