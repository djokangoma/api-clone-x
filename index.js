const cors = require("cors");
const express = require("express");
const app = express();
const PORT = 3000;

const { tweetsBaseURI } = require("./config/paths");
const { usersBaseURI } = require("./config/paths");

const { tweetRouter, userRouter } = require("./routes");

//const { getDetailsOfAUser } = require("./controllers/handleController");

const allowedOrigins = [
  `http://localhost:5173`,
  `https://x-clone-itax.netlify.app`,
  `http://localhost:5173`,
];
/*const corsOptions = {
  origin: `http://localhost:5173`,
};*/
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS`));
    }
  },
};

// Config
app.use(express.json());
app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Routes
app.get("/", (req, res) => {
  return res.send("La racine de l'app");
});
app.use(usersBaseURI, userRouter);
app.use(tweetsBaseURI, tweetRouter);

app.listen(PORT, () => {
  console.log(`Le serveur tourne sur le port ${PORT}`);
});

const fs = require("fs");
const path = require("path");

//const filePath = path.join(__dirname, "../assets/data.json");
const initialDataPath = path.join(
  __dirname,
  "..",
  "assets",
  "initial-data.json"
);
const newDataPath = path.join(__dirname, "..", "assets", "data.json");

// Verification pour savoir si le fichier data.json /assets/data.json exite déjà ou non
if (!fs.existsSync(newDataPath)) {
  // Lecture du contenu du fichier initial-data.json
  fs.readFile(initialDataPath, "utf8", (err, data) => {
    if (err) {
      console.error(`Erreur lors de l'écriture du fichier data.json: `, err);
      return;
    }
    // Écriture du contenu dans le fichier data.json
    fs.writeFile(newDataPath, data, "utf8", (err) => {
      if (err) {
        console.error(`Erreur lors de l'écriture du fichier data.json: `, err);
        return;
      }
      console.log(
        "Le fichier data.json a été créé avec succès en copiant les données de initial-data.json."
      );
    });
  });
}
