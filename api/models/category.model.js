import { sequelize } from '../../database/index.js';
import { DataTypes } from 'sequelize';

const Category = sequelize.define(
  'categories',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    urlImage: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  { timestamps: false } //para que se pongan los campos de createdAt y updatedAt//
)

export default Category