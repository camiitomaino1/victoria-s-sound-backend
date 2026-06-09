import { Sequelize } from 'sequelize'

// Create a Sequelize instance connected to a local SQLite file
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
})

export default sequelize