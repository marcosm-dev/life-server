import mongoose from 'mongoose';
export const cartItemSchema = new mongoose.Schema({
    quantity: Number,
    amount: Number,
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    productDeleted: mongoose.Schema.Types.Mixed,
});
const CartItem = mongoose.model('CartItem', cartItemSchema);
export default CartItem;
