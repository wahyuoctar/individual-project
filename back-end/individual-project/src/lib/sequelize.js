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
const User = require("../models/user")(sequelize)
const Comment = require("../models/comment")(sequelize)
const Post = require("../models/post")(sequelize)
const Like = require("../models/like")(sequelize)
const Session = require("../models/session")(sequelize)
const VerificationToken = require("../models/verification_token")(sequelize)




// Associations 1:M
User.hasMany(Post, {foreignKey: "user_id"})
Post.belongsTo(User, {foreignKey: "user_id"})

// Associations M:M
Comment.belongsTo(User, {foreignKey: "user_id"})
User.hasMany(Comment, {foreignKey: "user_id"})
Comment.belongsTo(Post, {foreignKey: "post_id"})
Post.hasMany(Comment, {foreignKey: "post_id"})

Like.belongsTo(User, {foreignKey: "user_id"})
User.hasMany(Like, {foreignKey: "user_id"})
Like.belongsTo(Post, {foreignKey: "post_id"})
Post.hasMany(Like, {foreignKey: "post_id"})

Session.belongsTo(User, {foreignKey: "user_id"})
User.hasMany(Session, {foreignKey: "user_id"})

VerificationToken.belongsTo(User, {foreignKey: "user_id"})
User.hasMany(VerificationToken, {foreignKey: "user_id"})

module.exports = {
    sequelize,
    User,
    Comment,
    Post,
    Like,
    Session,
    VerificationToken
}