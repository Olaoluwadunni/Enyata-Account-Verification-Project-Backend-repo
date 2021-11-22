const { userSignup, validatePassword, getUser } = require("../services")
const nodemailer = require('nodemailer')
const transporter = require("../verification")


const registerUser = async(req, res, next) => {
    try {
        const { body } = req
        const createUser = await userSignup(body)
        const { password, ...user} = createUser

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        // send verification mail to user
        const mailOptions = {
            from: ' "Verify your Email" <timmysmally@gmail.com>',
            to: user.email,
            subject: `Verify your email`,
            html: `<h2>Dear ${user.firstname}, thank you for registering with us</h2>
                <h4>Please verify your email by clicking on the link below...</h4>
                <a href="http://localhost:8080/user-login"> Verify your email here </a>
            `
        }


        // sending email
        transporter.sendMail(mailOptions, (error, res) => {
            if (error) {
                console.log(error)
            } else {
                console.log('Verification email has been sent. Please check your email')
            }
        })

        res.status(200).json({
            status: 'success',
            message: `User created successfully, check your email for verification`,
            data: user
        })
    } catch (error) {
        return next(error)
    }
}

const loginUser = async(req, res, next) => {
    try {
        const { user, body: { password }  } = req // from my body, extracting password
        const validated = await validatePassword(user, password)
        if (!validated) {
            res.status(401).json({
                status: 'fail',
                message: 'Invalid credentials',
                data: 'Error logging in user'
            })
        } else {
            res.status(200).json({
                status: 'success',
                code: 200,
                message: 'User logged in successfully',
                data: validated
            })
        }
    } catch (error) {
        return next(error)
    }
}

const logout = async(req, res, next) => {
    res.cookie('access-token', '', { maxAge: 1 })

    return next()
}

module.exports = {
    registerUser,
    loginUser,
    logout,
}