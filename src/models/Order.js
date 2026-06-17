import { DataTypes } from 'sequelize'
import sequelize from '../db.js'

// Define the Order model (maps to the "Orders" table in SQLite)
const Order = sequelize.define('Order', {

  // Total amount of the order: required number
  total: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  // Order status: required string
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pendiente'
  }

  // userId is added automatically by the association in index.js

})

export default Order