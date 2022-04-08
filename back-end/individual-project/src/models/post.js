const {DataTypes} = require("sequelize")

const Post = (sequelize) => {
    return sequelize.define(
        "Post",
        {
            image_url: {
                type: DataTypes.STRING,
                allowNull: false
            },
            caption: {
                type: DataTypes.STRING,
            },
            like_count: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            location: {
                type: DataTypes.STRING
            }
        })
}

module.exports = Post