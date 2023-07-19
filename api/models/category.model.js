import { sequelize } from '../../database/index.js';
import { STRING } from 'sequelize';

const Category = sequelize.define(
  'categories',
  {
    name: {
      type: STRING,
      allowNull: false,
      unique: true
    },
    urlImage: {
      type: STRING,
      allowNull: true
    }
  },
  { timestamps: false } //para que se pongan los campos de createdAt y updatedAt//
)

export default Category