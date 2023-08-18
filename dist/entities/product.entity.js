import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
    accessories: String,
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    description: String,
    name: {
        type: String,
        unique: true,
    },
    price: Number,
    stock: Number,
    urlImage: String,
    urlMoreInfo: String,
    uuid: String
});
const Product = mongoose.model('Product', productSchema);
export default Product;
