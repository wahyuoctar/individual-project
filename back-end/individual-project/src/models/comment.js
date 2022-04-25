const { DataTypes} = require("sequelize")

const Comment = (sequelize) => {
    return sequelize.define(
        "Comment", {
            content: {
                type: DataTypes.STRING,
            }
        }
    )
}

module.exports = Comment