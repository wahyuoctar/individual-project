const { Op } = require("sequelize");
const { User, VerificationToken } = require("../lib/sequelize");
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
                    username
                }
            })

            if (!findUser) {
                return res.status(400).json({
                    message: "Wrong username or password"
                })
            }

            const passwordCompare = bcrypt.compareSync(password, findUser.password)

            if (!passwordCompare) {
                return res.status(400).json({
                    message: "Wrong username or password"
                })
            }

            delete findUser.dataValues.password

            findUser.last_login = moment()
            findUser.save()

            return res.status(200).json({
                message: "Logged in user",
                result: findUser 
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

            const verificationUrl = `http://localhost:2000/auth/verify-account/${emailToken}`

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
    }
}

module.exports = authControllers