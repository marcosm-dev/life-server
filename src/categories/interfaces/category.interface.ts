import { Document } from 'mongoose'

export type ICategory = Document & {
  name: string
  urlImage: string
  productsCount: number
}
