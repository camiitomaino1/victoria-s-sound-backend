import { DataTypes } from 'sequelize'
import sequelize from '../db.js'

const Product = sequelize.define('Product', {

  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },

  marca: {
    type: DataTypes.STRING,
    allowNull: false
  },

  categoria: {
    type: DataTypes.STRING,
    allowNull: false
  },

  precio: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  descripcion: {
    type: DataTypes.STRING,
    allowNull: false
  },

  imagen: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // Stock available for purchase
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  // Soft delete flag
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }

})

export default Product