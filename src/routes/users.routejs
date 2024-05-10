const express = require("express");
const userRouter = express.Router();

const {
  getAllUsers,
  getDetailsOfAUser,
  getTweetsOfOneUser,
  getTweetsOfOneUserWithMedia,
  getIdOfCurrentUserConnected,
} = require("../controllers/usersController");

//Get all users
userRouter.get("/", getAllUsers);
//Get Id Of current user connected
userRouter.get("/loggedInUserId", getIdOfCurrentUserConnected);
//Get details of one user by his handle
userRouter.get("/:handle", getDetailsOfAUser);
//Get tweets of one user by his handle
userRouter.get("/:handle/tweets", getTweetsOfOneUser);
//Get tweets of one user by his handle with media like video and photo
userRouter.get("/:handle/media", getTweetsOfOneUserWithMedia);

//exports tweetRouter
module.exports = userRouter;
