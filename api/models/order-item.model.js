import { sequelize } from '../../database/index.js';
import { DataTypes } from 'sequelize';

const OrderItem = sequelize.define('order-item', {
  // No es necesario definir campos adicionales, ya que esta tabla solo contiene relaciones
});

export default OrderItem;
