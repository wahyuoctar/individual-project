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
    }
}

module.exports = authControllers