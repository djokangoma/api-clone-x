const fs = require("fs");
const path = require("path");

const pathToData = path.join(__dirname, "..", "..", "assets", "data.json");

const data = fs.existsSync(pathToData)
  ? require("../../assets/data.json")
  : require("../../assets/initial-data.json");

const users = data.users;
const tweets = data.tweets;
const loggedInUserId = data.loggedInUserId;

/**/
const findUserIdByHandle = (users, targetHandle) => {
  let result = { userId: null, infoUser: null };
  users.forEach((user) => {
    if (user.handle === targetHandle) {
      result.userId = user.id;
      result.infoUser = user;
    }
  });
  return result;
};

const findTweetsOfUserById = (tweets, userId) => {
  let id = null;

  tweets.forEach((tweet) => {
    if (tweet.author === userId) {
      id = tweet.author;
    }
  });
  return id;
};

const sortedTweets = (tweets) => {
  const sorted = tweets.sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
  return sorted;
};

/*
--------------------------
Retrieve all Users
--------------------------
*/
async function getAllUsers(req, res) {
  try {
    return res.send(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/*
--------------------------
Retrieve id of current user 
connected
--------------------------
*/
async function getIdOfCurrentUserConnected(req, res) {
  try {
    return res.json({ loggedInUserId: loggedInUserId });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

/*
--------------------------
returns all infos of a user 
identified by their handle
--------------------------
/users/:handle
*/
async function getDetailsOfAUser(req, res) {
  let { handle } = req.params;

  let targetHandle = `@${handle}`;

  let { userId, infoUser } = findUserIdByHandle(users, targetHandle);

  try {
    if (userId !== null) {
      /*return res.send(
        `L'ID de l'utilisateur avec le handle ${targetHandle} est: ${userId}`
      );*/
      return res.json(infoUser);
    } else {
      return res
        .status(404)
        .send(
          `Aucun utilisateur avec le handle ${targetHandle} n'a été trouvé.`
        );
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/*
--------------------------
returns all tweets from a user 
identified by their handle
--------------------------
/users/:handle/tweets
*/
async function getTweetsOfOneUser(req, res) {
  let { handle } = req.params;

  let targetHandle = `@${handle}`;

  let { userId } = findUserIdByHandle(users, targetHandle);

  const idOfAuthorTweet = findTweetsOfUserById(tweets, userId);

  try {
    const tweetsFiltered = tweets.filter(
      (tweet) => tweet.author === idOfAuthorTweet
    );

    const tweetsFilteredAndSorted = sortedTweets(tweetsFiltered);

    if (idOfAuthorTweet !== null) {
      return res.send(tweetsFilteredAndSorted);
    } else {
      return res
        .status(404)
        .send(
          `Aucun tweet n'a été trouvé pour l'utilisateur avec le handle ${targetHandle} `
        );
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/*
--------------------------
returns all tweets from a user
identified by their handle and 
who have media such as photos 
or videos
--------------------------
/users/:handle/medias
*/
function getTweetsOfOneUserWithMedia(req, res) {
  let { handle } = req.params;

  let targetHandle = `@${handle}`;

  let { userId } = findUserIdByHandle(users, targetHandle);

  const idOfAuthorTweet = findTweetsOfUserById(tweets, userId);

  try {
    const tweetsFiltered = tweets.filter(
      (tweet) => tweet.author === idOfAuthorTweet
    );

    const tweetsFilteredWithMedia = tweetsFiltered.filter(
      (tweet) => tweet.media.length > 0
    );

    const tweetsFilteredAndSorted = sortedTweets(tweetsFilteredWithMedia);

    if (idOfAuthorTweet !== null) {
      return res.send(tweetsFilteredAndSorted);
    } else {
      return res
        .status(404)
        .send(
          `Aucun tweet avec media n'a été trouvé pour l'utilisateur avec le handle ${targetHandle} `
        );
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAllUsers,
  getDetailsOfAUser,
  getTweetsOfOneUser,
  getTweetsOfOneUserWithMedia,
  getIdOfCurrentUserConnected,
};
