const express = require("express");
const userController = require("../controller/user.controller");
const identifyUser = require("../middlewares/auth.middleware");
const userRouter = express.Router();


userRouter.post("/follow/:username",identifyUser, userController.followUserController)
userRouter.delete("/unfollow/:username",identifyUser, userController.unfollowUserController)





module.exports = userRouter;