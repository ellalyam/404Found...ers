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
app.use(express.json());

app.post("/:id/suggestions/new", async (req, res) => {
//app.post("/suggestions/new", async (req, res) => {
  const id = req.params["id"];
  const token = req.headers.token;
  const idFromToken = await getUserId(token);

  if (id != idFromToken) {
    res.status(400).send({
      error: "User ID does not match token",
    });
    return;
  }

  const imageUrl = req.body.imageUrl;

  if (!imageUrl) {
    return res.status(400).send({ error: "Missing image URL" });
  }
  
  // humeEmotions holds ONLY the emotions part of the JSON
  const emotions = await identifyEmotion(imageUrl);
  console.log("humeEmotions in POST: ", emotions);
  console.log("done");

  if(!emotions) {
    return res.status(500).send({
      error: "Error retrieving user's emotions",
    });
  }

  console.log("Generating seed");
  //return res.status(201).send(emotions);

  const seed = generateSeed(emotions);

  // Send seed to spotify API
  getSuggestions(token, seed)
    .then((suggestion) => {
      addSuggestion(suggestion, id);
      return suggestion;
    })
    .then((suggestion) => res.send(suggestion));
});

// Get previous suggestions from DB
app.get("/:id/suggestions", async (req, res) => {
  const id = req.params["id"];
  const token = req.headers.token;
  const idFromToken = await getUserId(token);

  if (id != idFromToken) {
    res.status(400).send({
      error: "User ID does not match token",
    });
    return;
  }

  findSuggestions(idFromToken).then((result) => res.send(result));
});

// Delete user from DB
app.delete("/:id", async (req, res) => {
  const id = req.params["id"];
  const token = req.headers.token;
  const idFromToken = await getUserId(token);

  if (id != idFromToken) {
    res.status(400).send({
      error: "User ID does not match token",
    });
    return;
  }

  // removeUser calls removeSuggestions in mongoServices so shouldn't have to worry about deleting suggestions here
  removeUser(id).then((_) =>
    res.status(204).send(`Deleted user with id: ${id}`),
  );
});

app.listen(process.env.PORT || port, () => {
  console.log("REST API is listening.");
});
