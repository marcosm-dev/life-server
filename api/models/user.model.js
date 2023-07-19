import { sequelize } from '../../database/index.js';
import { DataTypes } from 'sequelize';

const { STRING, INTEGER, BOOLEAN, ENUM } = DataTypes

const User = sequelize.define(
  'users',
  {
    name: {
      type: STRING,
      allowNull: false
    },
    lastName: {
      type: STRING,
      allowNull: false
    },
    VATIN: {
      type: STRING,
      allowNull: false
    },
    phone: {
      type: INTEGER,
      allowNull: false,
      unique: true,
    },
    address: {
      type: STRING,
      allowNull: false,
    },
    email: {
      type: STRING,
      allowNull: false,
      unique: true,
      required: true
    },
    role: {
      type: ENUM('ADMIN', 'INSTALADOR'),
      allowNull: false,
    },
    password: {
      type: STRING,
      allowNull: false,
      required: true,
    },
    access: {
      type: BOOLEAN,
      defaultValue: false
    },
  },
  { timestamps: false } //para que se pongan los campos de createdAt y updatedAt//
)

export default User