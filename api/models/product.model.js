import { sequelize } from '../../database/index.js';
import { STRING, INTEGER } from 'sequelize';
import OrderItem from './order-item.model.js';
import Order from './order.model.js';

const Product = sequelize.define(
  'products',
  {
    name: {
      type: STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: STRING,
      allowNull: true
    },
    price: {
      type: INTEGER,
      allowNull: true
    },
    accesories: {
      type: STRING
    },
    urlMoreInfo: {
      type: STRING
    },
    stock: {
      type: INTEGER,
      allowNull: false
    },
    urlImage: {
      type: STRING,
      allowNull: false
    },
  },
  { timestamps: false } //para que se ponga en automatico los campos//
)

// Definir la relación de muchos a muchos(Many - to - Many) entre Product y Order a través de OrderItem
Product.belongsToMany(Order, {
  through: OrderItem,
});

export default Product