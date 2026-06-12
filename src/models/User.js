import { DataTypes } from 'sequelize'
import sequelize from '../db.js'

// Define the User model (maps to the "Users" table in SQLite)
const User = sequelize.define('User', {

  // User full name: required string
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // User email: required, must be unique across all users
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  // User password: required string (will be hashed in a future stage)
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // User role: required, possible values are 'user', 'admin', 'sysadmin'
  role: {
    type: DataTypes.STRING,
    allowNull: false
  }

})

export default User