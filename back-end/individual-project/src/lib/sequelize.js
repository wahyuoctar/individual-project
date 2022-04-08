const { Sequelize } = require("sequelize")
const mysqlConfig = require("../configs/database")

const sequelize = new Sequelize({
    username: mysqlConfig.MYSQL_USERNAME,
    password: mysqlConfig.MYSQL_PASSWORD,
    database: mysqlConfig.MYSQL_DATABASE,
    port: 3306,
    dialect: "mysql",
    logging: false
})

// Models

// Associations 1:M

// Associations M:M

module.exports = {
    sequelize
}