import { DataTypes } from 'sequelize'
import sequelize from '../db.js'

// Represents a product saved as favorite by a user
// The combination of UserId + ProductId must be unique
const Favorite = sequelize.define('Favorite', {}, {
  indexes: [
    {
      unique: true,
      fields: ['UserId', 'ProductId']
    }
  ]
})

export default Favorite