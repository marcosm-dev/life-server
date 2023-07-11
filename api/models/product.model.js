const { sequelize } = require('../../database')
const { DataTypes } = require('sequelize')

const Product = sequelize.define(
  'products',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    accesories: {
      type: DataTypes.STRING
    },
    urlMoreInfo: {
        type: DataTypes.STRING
      },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    urlImage: {
      type: DataTypes.STRING,
      allowNull: false
    },
    
  },
  { timestamps: false } //para que se ponga en automatico los campos//
)

module.exports = Product