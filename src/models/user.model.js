const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        unique : [true, "Username already exists"],
        required : true // must field 
    },
    email : {
        type : String,
        unique : [true, "Email already exists"],
        required : [true, "Email is required"] // must field
    },
    password : {
        type : String,
        required : [true, "Password is required"] // must field
    },
    bio : String,
    profileImage : {
        type : String,
        default : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    }
})

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;