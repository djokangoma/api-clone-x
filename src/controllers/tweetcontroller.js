const fs = require("fs");
const path = require("path");

const pathToData = path.join(__dirname, "..", "..", "assets", "data.json");

const data = fs.existsSync(pathToData)
  ? require("../../assets/data.json")
  : require("../../assets/initial-data.json");

const pathToDataJson = path.join(__dirname, "..", "..", "assets", "data.json");

const tweets = data.tweets;

//Import de Luxon pour le formatage de la date
const { DateTime } = require("luxon");
/*
--------------------------
Retrieve all tweets
--------------------------
*/
async function getAllTweets(req, res) {
  const page = req.query.page || 1;
  const tweetPerPage = req.query.tweetPerPage || 15;
  const startIndex = (page - 1) * tweetPerPage;
  const endIndex = page * tweetPerPage;

  try {
    // Tri des tweets du plus récent au plus ancien
    const sortedTweets = tweets.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    // return res.send(sortedTweets);
    const tweetDisplayed = sortedTweets.slice(startIndex, endIndex);
    return res.json({
      totalPages: Math.ceil(sortedTweets.length / tweetPerPage),
      currentPage: page,
      tweetPerPage: tweetPerPage,
      totalTweets: sortedTweets.length,
      tweets: tweetDisplayed,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/*
--------------------------
Create and save a new tweet
--------------------------
*/
async function createTweets(req, res) {
  try {
    //tweets.push(newTweet);
    //return res.status(201).send(tweets[tweets.length - 1]);
    fs.readFile(pathToDataJson, "utf-8", (err, data) => {
      if (err) {
        console.error("Erreur lors de la lecture du fichier JSON : ", err);
        return;
      }

      const jsonData = JSON.parse(data);
      const tweets = jsonData.tweets;
      //◊// Ajouter le nouveau tweet à la liste des tweets
      req.body.text = req.body.text.trim();
      const newTweet = {
        id: tweets.length + 1, // Incrémenter le compteur d'ID
        author: req.body.author,
        media: req.body.media,
        retweetCount: req.body.retweetCount,
        favoriteCount: req.body.favoriteCount,
        repliesCount: req.body.repliesCount,
        text: req.body.text.trim(),
        // Formater la date de création avec Luxon
        createdAt: DateTime.local()
          .setZone("Africa/Abidjan")
          .toFormat("EEE MMM dd yyyy HH:mm:ss (GMT+01:00) (WAT)"),
      };

      tweets.push(newTweet);

      // Réécrire le fichier JSON avec le nouveau tweet ajouté
      fs.writeFile(pathToDataJson, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          console.error("Erreur lors de l'écriture du fichier JSON : ", err);
          return;
        }
        console.log("Nouveau tweet ajouté avec succès !");
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAllTweets,
  createTweets,
};
