import { model, Schema } from 'mongoose';

const categorySchema = new Schema({
  name: String,
  urlImage: String,
});

export const CategoryModel = model('Category', categorySchema);
