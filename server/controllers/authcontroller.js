const userModel = require("../models/user_model")

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const transporter = require("../config/nodemailer")



const register = async(req,res) => {
    const {username, email, password} = req.body

    if(!username || !email || !password){
        return res.json({success: false, message: "Missing Details"})
    }

    try {

        const existingUSer = await userModel.findOne({email})

        if(existingUSer){
            return res.json({success: false, message: "user already exist"})
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const user = new userModel({username,email,password: hashedPassword})

        await user.save()

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 
            "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const mailOptions = {
            from: process.env.SENDERS_EMAIL,
            to: email,
            subject: "Welcome to SB_Tracker",
            text:  `welcome to SB_Tracker website. your account has been created
                with email id: ${email}`
        }

        await transporter.sendMail(mailOptions)

    return (res.json({success: true}))
        
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

const login = async(req,res) => {
    const {email,password} = req.body;

    if(!email || !password) {
        return res.json({
            success: false,
            message: "Email and Password are required"
        })
    }

    try {
        
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success: false, message: "invalid email"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success: false, message: "invalid password"})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 
            "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({
            success: true
        })
        

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

const logout = async(req,res) => {
    try {
        res.clearCookie("token",
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? 
                "none" : "strict"
            }
        )

        return res.json({success: true, message: "Logged out"})
        
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

const sendVerifyOtp = async(req,res) => {
    try {

        const {userId} = req.body

        const user = await userModel.findById(userId)

        if(user.isAccountVerified){
            return res.json({success: false, message: "Account already verified"})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.verifyOtp = otp

        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save()

        const mailOptions = {
            from: process.env.SENDERS_EMAIL,
            to: user.email,
            subject: "Account verification OTP",
            text: `Your OTP is ${otp}. Verify your account using this otp`
        }

        await transporter.sendMail(mailOptions)

        res.json({success: true, message: "verification OTP sent on email"})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

const verifyEmail = async(req,res) => {
    const {userId, otp} = req.body

    if(!userId || !otp){
        return res.json({success: falsem, message: "Missing Details !"})
    }

    try {
        
        const user = await userModel.findById(userId)

        if(!user){
            return res.json({success: falsem, message: "user not found !"})
        }

        if(user.verifyOtp === "" || user.verifyOtp != otp){
            return res.json({success: false, message: "Invalid otp"})
        }

        if(user.verifyOtpExpireAt < Date.now()) {
            return res.json({success: false, message: "OTP Expired !"})
        }

        user.isAccountVerified = true;

        user.verifyOtp = ""

        user.verifyOtpExpireAt = 0

        await user.save()

        return res.json({message: true, meesage: "Email verified successfully"})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

const isAunthenticated = async(req,res) => {
    try {
        res.json({success: true})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

const sendResetOtp = async(req,res) => {
    const {email} = req.body;

    if(!email) {
        return res.json({success: false, message: "email is required !"})
    }

    try {
        
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success: false, message: "user not found !"})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOtp = otp;

        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000

        await user.save()

        const mailOptions = {
            from: process.env.SENDERS_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password`
        }

        await transporter.sendMail(mailOptions)

        return res.json({success: true, message: "OTP sent to your email"})

    } catch (error) {
        return res.json({success: false, message: error.message})
        
    }
}

const resetPassword = async(req,res) => {
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.json({success: false, message: "all fields are required !"})
    }

    try {

        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success: false, message: "user not found"})
        }

        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.json({success: false, message: "invalid OTP !"})
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success: false, message: "OTP expired !"})
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword

        user.resetOtp = ""

        user.resetOtpExpireAt = 0

        await user.save()

        return res.json({success: true, message: "Password has been resetted successfully !"})
        
        
    } catch (error) {
        return res.json({success: false, message: error.message})
        
    }
}

module.exports = {register,
    login,
    logout,
    sendVerifyOtp,
    verifyEmail,
    isAunthenticated,
    sendResetOtp,
    resetPassword
}