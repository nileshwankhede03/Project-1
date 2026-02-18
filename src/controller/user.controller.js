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

module.exports = {
    followUserController,
    unfollowUserController
}