import { sequelize } from '../../database/index.js';
import { STRING, INTEGER } from 'sequelize';

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
export default Product