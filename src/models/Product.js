import { DataTypes } from 'sequelize'
import sequelize from '../db.js'

// Define the Product model (maps to the "Products" table in SQLite)
const Product = sequelize.define('Product', {

  // Product name: required string
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // Product brand: required string
  marca: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // Product category: required string
  categoria: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // Product price: required number
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  // Product description: required string
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // Product image URL: optional string
  imagen: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // Soft delete flag: false means the product is deactivated
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }

})

export default Product