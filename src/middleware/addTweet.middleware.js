/*
--------------------------
Middleware to add a new tweet 
to data.json file when 
posting to /tweets
--------------------------
*/
const fs = require("fs");
const path = require("path");
const pathToDataJson = path.join(__dirname, "..", "..", "assets", "data.json");

const { DateTime } = require("luxon");

const addNewTweet = (req, res, next) => {
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
      next();
    });
  });
};

module.exports = { addNewTweet };
