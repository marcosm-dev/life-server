import { IProduct } from '../../products/interfaces/product.interface.ts'
import { OrderLines } from '../../generated/graphql'
import { ICartItem } from '../../orders/interfaces/item.interface.ts'

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

export interface FacturaDirectaContent {
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

export type to = string[]

export interface SendTo {
  to: to
}

export type ContentType = 'estimate' | 'invoice'
