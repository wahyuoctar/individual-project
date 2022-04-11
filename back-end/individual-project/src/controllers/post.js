const { Post } = require("../lib/sequelize")

const postControllers = {
    getAllPosts: async (req, res) => {
        try {
            const findAllPosts = await Post.findAll()

            return res.status(200).json({
                message: "We Found All Posts!",
                result: findAllPosts
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Can't Reach Server"
            })
        }
    },

    createNewPost: async (req, res) => {
        try {
            const { caption, location, user_id } = req.body
            const {filename} = req.file

            const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN
            const filePath = "image_url"

            const findUser = await User.findOne({
                where: {
                    id: user_id
                }
            })

            if (!findUser) {
                return res.status(400).json({
                    message: "User not Found!"
                })
            }

            const postCreated = await Post.create({
                caption,
                location,
                user_id,
                image_url: `${uploadFileDomain}/${filePath}/${filename}`
            })

            return res.status(201).json({
                message: "Post Added",
                result: postCreated
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Can't Reach Server"
            })
        }
    }
}

module.exports = postControllers