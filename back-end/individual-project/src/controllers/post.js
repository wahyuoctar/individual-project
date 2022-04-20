const { Post, User, Comment } = require("../lib/sequelize")
const fs = require("fs")

const postControllers = {
    getAllPosts: async (req, res) => {
        try {
            const {_limit = 7, _page = 1 } = req.query

            delete req.query._limit
            delete req.query._page

            const findAllPosts = await Post.findAll({
                where: {
                    ...req.query
                },
                order: [
                    ['createdAt', 'DESC']
                ] ,
                limit: _limit ? parseInt(_limit) : undefined,
                offset: (_page - 1) * _limit,
                include: [
                    {
                        model: User
                    }
                ]
            })

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
            const { caption, location} = req.body
            const {filename} = req.file

            const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN
            const filePath = "image_url"

            const findUser = await User.findOne({
                where: {
                    id: req.token.user_id
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
                user_id: req.token.user_id,
                image_url: `${uploadFileDomain}/${filePath}/${filename}`
            })

            return res.status(201).json({
                message: "Post Added",
                result: postCreated
            })
        } catch (err) {
            console.log(err);
            fs.unlinkSync(__dirname + "/../public/posts" + req.file.filename)
            return res.status(500).json({
                message: "Can't Reach Server"
            })
        }
    },

    editPost: async (req, res) => {
        try {
            const { postId } = req.params
            const { caption, location } = req.body

            const findPost = await Post.findOne({
                where: {
                    id: postId
                }
            })

            if (!findPost) {
                return res.status(400).json({
                    message: "Post not Found!"
                })
            }

            await Post.update({
                caption,
                location
            }, {
                where: {
                    id: postId
            }
            })

            return res.status(200).json({
                message: "Post Updated!"
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Can't Reach Server"
            })
        }
    },

    getPostById: async (req, res) => {
        try {
            const {postId} = req.params
            const findPost = await Post.findOne({
                where: {
                    id: postId
                },
                include: [
                    {
                        model: User
                    }
                ],
                
            })

            return res.status(200).json({
                message: `We Found Post ID: ${postId} !`,
                result: findPost
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Can't Reach Server"
            })
        }
    },

    getPostByUserId: async (req, res) => {
        try {
            const {userId} = req.params
            const findPost = await Post.findAll({
                where: {
                    user_id: userId
                },
                include: [
                    {
                        model: User
                    }
                ],
                order: [
                    ['createdAt', 'DESC']
                ]
            })

            return res.status(200).json({
                message: `We Found Post ID: ${userId} !`,
                result: findPost
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Can't Reach Server"
            })
        }
    },

    getPostComments: async (req, res) => {
        try {
            const { postId } = req.params

            const findPost = await Post.findOne({
                where: {
                    id: postId
                }
            })

            if (!findPost) {
                return res.status(400).json({
                    message: "Post not Found!"
                })
            }

            const getComments = await Comment.findAll({
                where: {
                    post_id: postId
                }
            })

            return res.status(200).json({
                message: "Comments found!",
                result: getComments
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Can't Reach Server"
            })
        }
    },

    addPostComment: async (req, res) => {
        try {
            const { postId } = req.params
            const { content, user_id } = req.body

            const findPost = await Post.findOne({
                where: {
                    id: postId
                }
            })

            if (!findPost) {
                return res.status(400).json({
                    message: "Post not Found!"
                })
            }

            const findUser = await User.findOne({
                where: {
                    id: user_id
                }
            })

            if (!findUser) {
                return res.status(400).json({
                    message: "User doesn't exist!"
                })
            }

            const addComment = await Comment.create({
                content,
                user_id,
                post_id: postId
            })

            return res.status(201).json({
                message: "Comment Added",
                result: addComment
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