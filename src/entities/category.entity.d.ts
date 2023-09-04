import { Document } from 'mongoose'

type ICategory = Document & {
  name: string
  urlImage: string
}
