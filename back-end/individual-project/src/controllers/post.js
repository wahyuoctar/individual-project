const { Post, User, Comment, Like } = require("../lib/sequelize")
const fs = require("fs")

const postControllers = {
    getAllPosts: async (req, res) => {
        try {
            const {_limit = 5, _page = 1 } = req.query

            delete req.query._limit
            delete req.query._page

            const findAllPosts = await Post.findAndCountAll({
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
                        model: User,
                        
                    },
                    {
                        model: Comment,
                        order: [
                            ['createdAt', 'DESC']
                        ]
                    }, {
                        model: Like
                    }
                ],
                distinct: true

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

            await User.increment({
                posts: 1
            },{
                where: {
                    id: req.token.user_id
                }
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

    deletePost: async (req, res) => {
        try {
            const { postId } = req.params
            const findPost = await Post.findOne({
                where: {
                    id: postId
                }
            })

            if (!findPost) {
                return res.status(400).json({
                    message: "Can't find this Post!"
                })
            }

            
            await User.decrement({posts: 1
            },{
                where: {
                    id: findPost.user_id
                }
            })
            
            await Post.destroy({
                where: {
                    id: postId
                }
            })
            return res.status(202).json({
                message: "Post Deleted!"
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
            const {_limit=5, _page = 1 } = req.query

            delete req.query._limit
            delete req.query._page
            const {postId} = req.params
            const findPost = await Post.findOne({
                where: {
                    id: postId
                },
                include: [
                    {
                        model: User,
                    },
                {
                    model: Comment
                }],
                
            })

            const findComment = await Comment.findAndCountAll({
                where: {
                    post_id: postId
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: _limit ? parseInt(_limit) : undefined,
                offset: (_page - 1) * _limit,
                include: [
                    {
                        model: User
                    }
                ],
                distinct: true
            }, )
            

            return res.status(200).json({
                message: `We Found Post ID: ${postId} !`,
                result: {
                    post: findPost,
                    comment: findComment
                }
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

    getPostByUserLike: async (req, res) => {
        try {
            const {userId} = req.params

            const findLike = await Like.findAll({
                where: {
                    user_id: userId
                },
                include: [
                    {
                        model: Post,
                        include: [
                            {
                                model: User
                            },
                            {
                                model: Comment
                            }
                        ]
                    }
                ],
                order: [
                    ['createdAt', 'DESC']
                ] 
            })

            res.status(200).json({
                message: "Find Posts!",
                result: findLike
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Can't Get Posts User has Liked"
            })
        }
    }

}

module.exports = postControllers