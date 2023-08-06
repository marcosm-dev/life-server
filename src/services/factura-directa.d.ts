export interface Contact {
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

export interface Invoice {
  content: {
    type: string
    main: {
      docNumber: {
        series: string
      }
      contact: string
      taxIncludedPrices: boolean
      currency: string
      lines: {
        document: string
        quantity: number
        tax: string[]
        text: string
        unitPrice: number
      }[]
    }
  }
}
