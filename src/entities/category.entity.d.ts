import *  as mongoose from 'mongoose'

export interface ICategory extends mongoose.Document {
    name: string
    urlImage: string
  }