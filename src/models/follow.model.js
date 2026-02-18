const mongoose = require("mongoose")

const followSchema = new mongoose.Schema({
    follower : {
        type : String
    },
    followee : {
        type : String
    }
},{
    timestamps : true
})

// user A user B ko 2 times follow nahi kar payega
followSchema.index({follower : 1 , followee : 1},{unique : true});

const followModel = mongoose.model("follow",followSchema);
module.exports = followModel;