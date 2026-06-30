import { DataTypes } from 'sequelize'
import sequelize from '../db.js'

// Define the OrderItem model (maps to the "OrderItems" table in SQLite)
// Represents a single product within an order, with the quantity and price at purchase time
const OrderItem = sequelize.define('OrderItem', {

  // Quantity of this product purchased
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // Price per unit at the moment of purchase
  // Stored separately from Product.precio so historical orders don't change if the price updates later
  precioUnitario: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  // Product name at the moment of purchase
  // Stored separately so the order still shows correctly even if the product is later deleted
  nombreProducto: {
    type: DataTypes.STRING,
    allowNull: false
  }

  // OrderId and ProductId are added automatically by the associations in index.js

})

export default OrderItem