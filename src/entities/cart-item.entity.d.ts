import * as mongoose from 'mongoose';

export interface ICartItem extends Document {
  quantity: number;
  amount: number;
  TAX: number;
  productId: mongoose.Schema.Types.ObjectId;
  orderId: mongoose.Schema.Types.ObjectId;
  productDeleted: mongoose.Schema.Types.Mixed;
}
