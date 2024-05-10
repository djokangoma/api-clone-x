const express = require("express");
const tweetRouter = express.Router();

const {
  getAllTweets,
  createTweets,
} = require("../controllers/");

const { isAValidTweet } = require("../middlewares/validTweet.middleware");
const {addTweet } = require("../middleware/addTweet.middleware");
// const { addNewTweet } = require("../middlewares/addNewTweet.middleware");

//Get all tweets
tweetRouter.get("/", getAllTweets);

//Create new tweet
tweetRouter.post("/", isAValidTweet, createTweets);

//exports tweetRouter
module.exports = tweetRouter;
