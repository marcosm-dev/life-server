import { sequelize } from '../../database/index.js';
import { STRING, INTEGER, BOOLEAN, ENUM } from 'sequelize';

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
      allowNull: true,
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
  { timestamps: true } //para que se pongan los campos de createdAt y updatedAt//
)

export default User