const { Op } = require("sequelize");
const { User } = require("../lib/sequelize");
const bcrypt = require("bcrypt");

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
            const {username, fullname, email, password, biography, current_city} = req.body

            // Variable variable yg berfungsi untuk nama file pada avatar yg diupload
            const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN
            const filePath = "ava_pics"
            const { filename} = req.file

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
                ava_pic: `${uploadFileDomain}/${filePath}/${filename}`, 
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

    editUser: async (req, res) => {
        try {
            const { userId } = req.params
            const {fullname, biography, username} = req.body
    
            // Mencari user apakah ada atau tidak
            const findUser = await User.findOne({
                where: {
                    id: userId
                }
            })
    
            if (!findUser) {
                return res.status(400).json({
                    message: "User not Found!"
                })
            }
    
            // Mencari apakah ada yg memiliki username yg sama atau tidak
            const findUsername = await User.findOne({
                where: {
                    username
                }
            })
    
            if (findUsername) {
                return res.status(400).json({
                    message: "Please use different Username!"
                })
            }

            // Variable variable yg berfungsi untuk nama file pada avatar yg diupload
            const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN
            const filePath = "ava_pics"
            const { filename} = req.file

            // todo: edit foto, tapi file pada public ditimpa
            const editedUser = await User.update({
                fullname,
                biography,
                username,
                ava_pic: `${uploadFileDomain}/${filePath}/${filename}`
            }, {
                where: {
                    id: userId
                }
            })

            res.status(200).json({
                message: "User Edited",
                result: editedUser
            })
            
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Can't reach Server"
            })
        }

        
    }
}

module.exports = userControllers