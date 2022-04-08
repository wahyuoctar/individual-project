const { Op } = require("sequelize");
const { User } = require("../lib/sequelize");
const bcrypt = require("bcrypt")

const userControllers = {
    getAllUser: async (req, res) => {
        try {
            const getUsers = await User.findAll()

            res.status(200).json({
                message: "Users Data Found.",
                result: getUsers
            })
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Can't Reach Server"
            })
        }
    },

    createNewUser: async (req, res) => {
        try {
            const {username, fullname, email, password, biography, current_city, ava_pict} = req.body

            const findEmailUsername = await User.findOne({
                where: {
                    [Op.or]: [
                        {username},
                        {email}
                    ]
                }
            })

            if (findEmailUsername) {
                return res.status(400).json({
                    message: "Username or Email has Taken"
                })
            }

            const encryptPassword = bcrypt.hashSync(password, 10)

            const createUser = await User.create({
                username, 
                fullname, 
                email, 
                password: encryptPassword, 
                biography,
                ava_pict, 
                current_city
            })

            res.status(201).json({
                message: "User Created!",
                result: createUser
            })
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Can't Reach Server"
            })
        }
    },
}

module.exports = userControllers