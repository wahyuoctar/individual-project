const {DataTypes} = require("sequelize")

const User = (sequelize) => {
    return sequelize.define(
        "User", {
            username: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            fullname: {
                type: DataTypes.STRING,
                allowNull: false
            },
            followers: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            following: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            posts: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            ava_pic: {
                type: DataTypes.STRING
            },
            biography: {
                type: DataTypes.STRING
            },
            current_city: {
                type: DataTypes.STRING,
                defaultValue: "Location"
            },
            is_verified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            last_login: {
                type: DataTypes.DATE
            }
        }
    )
}

module.exports = User