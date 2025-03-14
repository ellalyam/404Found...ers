import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { findScore, generateSeed } from "./services/generateSeed.js";
import {
  addUser,
  findUser,
  removeUser,
  addSuggestion,
  findSuggestions,
} from "./services/mongoServices.js";
import { getUserId } from "./services/spotifyServices.js";
import { getSuggestions } from "./services/suggestionService.js";
import { getMainEmotion } from "./services/mainEmotion.js";
import { identifyEmotion } from "./services/emotionRecognitionService.js";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));

const app = express();
const port = 8080;
app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.post("/:id/suggestions", async (req, res) => {
  const id = req.params["id"];
  const spotifyToken = req.headers.token;
  await getUserId(spotifyToken)
    .then((idFromToken) => {
      if (id != idFromToken) {
        res.status(400).send({ error: "User ID does not match token" });
        throw Error("Handled");
      } else {
        return idFromToken;
      }
    })
    .then((_) => {
      const image = req.body.image;
      if (!image) {
        res.status(400).send({ error: "Missing encoded image" });
        throw Error("Handled");
      }
      return identifyEmotion(image);
    })
    .then((emotions) => {
      const seed = generateSeed(emotions);
      return getSuggestions(spotifyToken, seed, getMainEmotion(emotions));
    })
    .then((suggestion) => addSuggestion(suggestion, id))
    .then((result) => res.status(201).send(result))
    .catch((error) => {
      if (error.message === "Handled") {
        return;
      } else if (error.message === "Token Expired") {
        res.status(401).send({ error: "Token Expired" });
      } else {
        res.status(500).send();
        console.log(error);
      }
    });
});

// Get previous suggestions from DB
app.get("/:id/suggestions", async (req, res) => {
  const id = req.params["id"];
  const token = req.headers.token;
  await getUserId(token)
    .then((idFromToken) => {
      if (id != idFromToken) {
        res.status(400).send({ error: "User ID does not match token" });
        throw Error("Handled");
      } else {
        return idFromToken;
      }
    })
    .then((id) => findSuggestions(id))
    .then((result) => res.send(result))
    .catch((error) => {
      if (error.message === "Handled") {
        return;
      } else if (error.message === "Token Expired") {
        res.status(401).send({ error: "Token Expired" });
      } else {
        res.status(500).send();
        console.log(error);
      }
    });
});

// Delete user from DB
app.delete("/:id", async (req, res) => {
  const id = req.params["id"];
  const token = req.headers.token;
  await getUserId(token)
    .then((idFromToken) => {
      if (id != idFromToken) {
        res.status(400).send({ error: "User ID does not match token" });
        throw Error("Handled");
      } else {
        return idFromToken;
      }
    })
    .then((_) => removeUser(id))
    .then((_) => res.status(204).send(`Deleted user with id: ${id}`))
    .catch((error) => {
      if (error.message === "Handled") {
        return;
      } else if (error.message === "Token Expired") {
        res.status(401).send({ error: "Token Expired" });
      } else {
        res.status(500).send();
        console.log(error);
      }
    });
});


app.listen(process.env.PORT || port, () => {
  console.log("REST API is listening.");
});
