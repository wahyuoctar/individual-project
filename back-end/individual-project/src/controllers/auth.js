const { Op } = require("sequelize");
const { User, VerificationToken, Session } = require("../lib/sequelize");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const moment = require("moment")
const fs = require("fs")
const mustache = require("mustache")
const mailer = require("../lib/mailer")

const authControllers = {
    loginUser: async (req, res) => {
        try {
            const { username, password } = req.body

            const findUser = await User.findOne({
                where: {
                    [Op.or]: [
                        {username},
                    {email: username}]
                }
            })

            // if (!findUser) {
            //     return res.status(400).json({
            //         message: "Wrong username or password"
            //     })
            // }

            const passwordCompare = bcrypt.compareSync(password, findUser.password)

            if (!passwordCompare || !findUser) {
                return res.status(400).json({
                    message: "Wrong username or password"
                })
            }

            delete findUser.dataValues.password

            await Session.update({
                is_valid: false
            }, {
                where: {
                    user_id: findUser.id,
                    is_valid: true
                }
            })

            const sessionToken = nanoid(64)

            await Session.create({
                token: sessionToken,
                user_id: findUser.id,
                is_valid: true,
                valid_until: moment().add(1, "day")
            })

            findUser.last_login = moment()
            findUser.save()

            return res.status(200).json({
                message: "Logged in user",
                result: {
                    user: findUser,
                    token: sessionToken
                } 
              })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Can't Reach Server"
            })
        }
    },

    registerUser: async (req, res) => {
        try {
            const { username, email, password, fullname } = req.body

            const findUsernameEmail = await User.findOne({
                where: {
                    [Op.or]: [
                        {username},
                        {email}
                    ]
                }
            })

            // Find apakah username atau password sudah digunakan apa belum
            if (findUsernameEmail) {
                return res.status(400).json({
                    message: "Email or Username has been Taken!"
                })
            }

            // Protect password
            const hashPassword = bcrypt.hashSync(password, 10)

            const newUser = await User.create({
                username,
                email,
                password: hashPassword,
                fullname
            })

            // Token untuk email
            const emailToken = nanoid()

            await VerificationToken.create({
                token: emailToken,
                is_valid: true,
                valid_until: moment().add(30, "minutes"),
                user_id: newUser.id
            })

            const verificationUrl = `http://localhost:2000/auth/verify/${emailToken}`

            const template = fs.readFileSync(__dirname + "/../templates/verify.html").toString()

            const renderedTemplate = mustache.render(template, {
                username,
                verify_url: verificationUrl,
                fullname
            })

            await mailer({
                to: email,
                subject: "Please, verify your account!",
                html: renderedTemplate
            })

            return res.status(201).json({
                message: "Register Successfully!"
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Can't Reach Server"
            })
        }
    },

    verifyUser: async (req, res) => {
        try {
            const { token } = req.params

            const findToken = await VerificationToken.findOne({
                where: {
                    token,
                    is_valid: true,
                    valid_until: {
                        [Op.gt]: moment().utc(),
                      }
                }
            })

            if (!findToken) {
                return res.status(400).json({
                    message: "Token is invalid!"
                })
            }

            await User.update({
                is_verified: true
            },{
                where: {
                    id: findToken.user_id
                }
            })

            findToken.is_valid = false
            findToken.save()

            return res.redirect(`http://localhost:3000/verification-success?referral=${token}`)
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Can't Reach Server"
            })
        }
    },

    keepLogin: async (req, res) => {
        try {
            const {token} = req

            const newToken = nanoid(21)
            const findUser = await User.findByPk(token.user_id)

            delete findUser.dataValues.password
            await Session.update({
                token: newToken,
                valid_until: moment().add(1, "day")
            },
            {
                where: {
                    id: token.id
                }
            })

            return res.status(200).json({
                message: "Token just updated!",
                result: {
                    user: findUser,
                    token: newToken
                }
            })
            
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Can't Reach Server"
            })
        }
    },
    
    resendVerificationEmail: async (req, res) => {
        try {
            const {user_id} = req.token

            await VerificationToken.update({ is_valid: false}, {
                where: {
                    is_valid: true,
                    user_id
                }
            })

            const verificationToken = nanoid(21)

            await VerificationToken.create({
                token: verificationToken,
                is_valid: true,
                user_id,
                valid_until: moment().add(1, "hour")
            })

            const findUser = await User.findByPk(user_id)

            const verificationLink = `http://localhost:2000/auth/verify/${verificationToken}`

            const template = fs.readFileSync(__dirname + "/../templates/verify.html").toString()

            const renderTemplate = mustache.render(template, {
                username: findUser.username,
                verify_url: verificationLink,
                full_name: findUser.fullname
            })

            await mailer({
                to: findUser.email,
                subject: "Verify your Account!",
                html: renderTemplate
            })

            return res.status(201).json({
                message: "Resent Verification Email"
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Can't Reach Server"
            })
        }
    }
}

module.exports = authControllers