import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: function() { return !this.googleId },
            minlength: [8, "password must be at least 8 char"],
        },
        profilePic: {
            type: String,
            default: "",
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true, // allows multiple nulls
        },
    },
    { timestamps: true }
)

const User = mongoose.model("User", userSchema)

export default User
