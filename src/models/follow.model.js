const mongoose = require("mongoose")

const followSchema = new mongoose.Schema({
    follower : {
        type : String
    },
    followee : {
        type : String
    },
    status : {
        type : String,
        default : "PENDING",
        enum : {
            values : ["PENDING","ACCEPTED","REJECTED"],
            message : "status can only be PENDING, ACCEPTED or REJECTED"
        }
    }
},{
    timestamps : true
})

// user A user B ko 2 times follow nahi kar payega
followSchema.index({follower : 1 , followee : 1},{unique : true});

const followModel = mongoose.model("follow",followSchema);
module.exports = followModel;