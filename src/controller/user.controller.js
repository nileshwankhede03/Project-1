const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");

/**
 * @route POST /api/users/follow/:userid
 */
async function followUserController(req,res) 
{
    const followerUsername = req.user.username; // action karne wala (LogIn user)
    const followeeUsername = req.params.username; // action receive karne wala

    // can't follow yourself
    if(followeeUsername === followerUsername)
    {
        return res.status(400).json({
            message : "You can not follow yourself"
        })
    }

    const isFolloweeExists = await userModel.findOne({
        username : followeeUsername
    })

    if(!isFolloweeExists)
    {
        res.status(404).json({
            message : "User you are trying to follow does not exists"
        })
    }

    // can't follow double to 1 username
    const isAlreadyFollowinguser = await followModel.findOne({
        follower : followerUsername,
        followee : followeeUsername
    });

    if(isAlreadyFollowinguser)
    {
        return res.status(200).json({
            message : `You are already following ${followeeUsername}`,
            follow : isAlreadyFollowinguser
        })
    }


    // create in DB users
    const followRecord = await followModel.create({
        follower : followerUsername,
        followee : followeeUsername
    })

    res.status(201).json({
        message : `You are now following ${followeeUsername}`,
        follow : followRecord
    })
}

async function unfollowUserController(req,res) 
{
    const followerUsername = req.user.username;
    const followeeUsername = req.params.username;

    const isUserFollowing = await followModel.findOne({
        follower : followerUsername,
        followee : followeeUsername
    })

    if(!isUserFollowing)
    {
        res.status(200).json({
            message : `You are not following ${followeeUsername}`
        })
    }

    await followModel.findByIdAndDelete(isUserFollowing._id);

    res.status(200).json({
        message : `You have unfollowed ${followeeUsername}`
    })
}

/**
 * PUT /api/users/accept/username
 */
async function acceptFollowRequestController(req,res) 
{
    const loggedInUser = req.user.username;     // nilesh
    const requestSender = req.params.username;  // aditi

    // can not change status of yourself
    if(requestSender === loggedInUser)
    {
        return res.status(400).json({
            message: "Invalid request"
        });
    }

    const existingRequest = await followModel.findOne({
        follower : requestSender,
        followee : loggedInUser
    });

    // chk req nasen trr no follow state will performed
    if(!existingRequest){
        return res.status(404).json({
            message : "Request not found"
        });
    }

    if(existingRequest.status !== "PENDING"){
        return res.status(400).json({
            message : "Request already processed"
        });
    }

    const acceptUserRequest = await followModel.findOneAndUpdate(
        {
            follower : requestSender,   // aditi (action karnara)
            followee : loggedInUser,    // nilesh (action received karnara)
            status : "PENDING"
        },
        {
            $set : {status : "ACCEPTED"}
        },
        {
            new : true
        }
    )

    if(!acceptUserRequest){
        return res.status(404).json({
            message : "No pending request found"
        })
    }

    res.status(200).json({
        message : `Request accepted of ${requestSender}`,
        acceptUserRequest
    });
}

/**
 * PUT /api/users/reject/username
 */
async function rejectFollowRequestController(req,res) 
{
    const loggedInUser = req.user.username; // nilesh
    const requestSender = req.params.username; // aditi

    if(requestSender === loggedInUser)
    {
        return res.status(400).json({
            message: "Invalid request"
        });
    }

    const followData = await followModel.findOne({
        follower : requestSender,
        followee : loggedInUser
    })

    // console.log(followData);

    if(!followData)
    {
        return res.status(404).json({
            message : "Request not found"
        });
    }

    if(followData.status != "PENDING")
    {
        return res.status(400).json({
            message : `Cannot reject request with status ${followData.status}`
        });
    }


    const rejectedUserUpdatedData = await followModel.findOneAndUpdate(
        {
            follower : requestSender,   // aditi (action karnara)
            followee : loggedInUser,    // nilesh (action received karnara)
            status : "PENDING"
        },
        {
            $set : {status : "REJECTED"}
        },
        {
            new : true
        }
    )

    if(!rejectedUserUpdatedData)
    {
        return res.status(409).json({
            message : "Request already processed"
        });
    }

    res.status(200).json({
        message : `${requestSender}'s request is REJECTED by ${loggedInUser}`,
        rejectedUserUpdatedData
    })
}
module.exports = {
    followUserController,
    unfollowUserController,
    acceptFollowRequestController,
    rejectFollowRequestController
}