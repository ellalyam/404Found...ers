import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { findScore, generateSeed } from "./services/generateSeed.js";
import { addUser, findUser, removeUser,
         addSuggestion, findSuggestions } from "./services/mongoServices.js";
import { getUserId } from "./services/spotifyServices.js";
import { getSuggestions } from "./services/suggestionService.js";


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


app.get("/:id/suggestions/new", async (req, res) => {
  const id = req.params["id"];
  const token = req.headers.token;
  const idFromToken = await getUserId(token);

  if (id != idFromToken) {
    res.status(400).send({
      error: "User ID does not match token",
    });
    return;
  }

  const emotions = req.query.source.results.predictions.file.models.face
    .grouped_predictions.id.predictions.emotions;
  const seed = generateSeed(emotions);
  const id = await getUserId(spotifyToken);

  // Send seed to spotify API
  getSuggestions(spotifyToken, seed)
    .then((suggestion) => {
      addSuggestion(suggestion, id);
      return suggestion;
    })
    .then((suggestion) => res.send(suggestion));
});

const fakePreviousSuggestions = {
  suggestions: [
    {
      mood: "Anger",
      name: "1",
      id: "randomId",
      dateSuggested: new Date("2025-02-24"),
      tracks: [
        {
          title: "Master Of Puppets",
          album: "Remastered Deluxe Box Set",
          artist: "Metallica",
          coverImage: "/images/default_cover.png",
        },
        {
          title: "Master Of Puppets",
          album: "Remastered Deluxe Box Set",
          artist: "Metallica",
          coverImage: "/images/default_cover.png",
        },
        {
          title: "Master Of Puppets",
          album: "Remastered Deluxe Box Set",
          artist: "Metallica",
          coverImage: "/images/default_cover.png",
        },
      ],
    },
    {
      mood: "Happiness",
      name: "2",
      id: "randomId",
      dateSuggested: new Date("2025-02-24"),
      tracks: [
        {
          title: "What You Know",
          album: "Tourist History",
          artist: "Two Door Cinema Club",
          coverImage: "/images/default_cover.png",
        },
        {
          title: "What You Know",
          album: "Tourist History",
          artist: "Two Door Cinema Club",
          coverImage: "/images/default_cover.png",
        },
        {
          title: "What You Know",
          album: "Tourist History",
          artist: "Two Door Cinema Club",
          coverImage: "/images/default_cover.png",
        },
      ],
    },
    {
      mood: "Sadness",
      name: "3",
      id: "randomId",
      dateSuggested: new Date("2025-02-24"),
      tracks: [
        {
          title: "Another Love",
          album: "Long Way Down",
          artist: "Tom Odell",
          coverImage: "/images/default_cover.png",
        },
        {
          title: "Another Love",
          album: "Long Way Down",
          artist: "Tom Odell",
          coverImage: "/images/default_cover.png",
        },
        {
          title: "Another Love",
          album: "Long Way Down",
          artist: "Tom Odell",
          coverImage: "/images/default_cover.png",
        },
      ],
    },
  ],
};

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

  findSuggestions(idFromToken)
    .then((result) => res.send(result));
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
  removeUser(id)
    .then((_) => res.status(204).send(`Deleted user with id: ${id}`));
});

app.listen(process.env.PORT || port, () => {
  console.log("REST API is listening.");
});
