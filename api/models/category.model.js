const { sequelize } = require('../../database')
const { DataTypes } = require('sequelize')

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

module.exports = Category