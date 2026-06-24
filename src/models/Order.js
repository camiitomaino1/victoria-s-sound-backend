import { DataTypes } from 'sequelize'
import sequelize from '../db.js'

const Order = sequelize.define('Order', {

  total: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pendiente'
  }

})

export default Order