import mongoose from 'mongoose';
import { cartItemSchema } from './cart-item.entity.js';
const orderStatusEnum = [
    'PENDING',
    'SUCCESS',
    'AUTHORIZED',
    'CANCELED',
    'FAILURE',
];
const orderSchema = new mongoose.Schema({
    amount: Number,
    status: {
        type: String,
        enum: orderStatusEnum,
        default: 'PENDING',
    },
    TAX: {
        type: Number,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    uuid: {
        type: String,
        required: false
    },
    products: [cartItemSchema]
}, { timestamps: true });
const Order = mongoose.model('Order', orderSchema);
export default Order;
