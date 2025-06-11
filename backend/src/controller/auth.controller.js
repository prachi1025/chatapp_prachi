import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js"

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body
    try {
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be atleast 8 characters "})
        }

        const user = await User.findOne({email})
        if (user) {
            return res.status(400).json({ message: "Email already exists"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword =  await bcrypt.hash(password,salt)

        const newUser = new User({
            fullName:fullName,
            email:email,
            password:hashedPassword
        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        } else {
            res.status(400).json({ message: "Invalid user data" })
        }
    } catch (error) {
        console.log("Error in Signup controller", error.message)
        res.status(500).json({ message: "Internal Server Error"})
    }
}

export const login = (req, res) => {
  
}

export const logout = (req, res) => {
    res.send("logout route")
}