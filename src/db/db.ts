import { Sequelize } from "sequelize"

const dbDetails = {
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    host: process.env.DB_HOST!,
    name: process.env.DB_NAME!
}

const db = new Sequelize(dbDetails.name, dbDetails.username, dbDetails.password, {
    host: dbDetails.host,
    dialect: 'mysql',
})

db
    .authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err))

db
    .sync()
    .then(() => console.log('Db sync successful'))
    .catch(err => console.error(`The database did not sync correctly :`, err))