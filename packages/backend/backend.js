import dotenv from "dotenv";

import express from "express";
import cors from "cors";
import generateSeed from "./services/generateSeed.js"
import mongoServices from "./services/mongoServices.js"
import suggestionServices from "./services/suggestionService.js";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));

const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());



app.get("/new-suggestion", (req, res) => {
  const spotifyToken = req.query.spotify_token;
  const emotions =
    req.query.source.results.predictions.file.models.face.grouped_predictions.id
      .predictions.emotions;
  const seed = generateSeed(emotions);

  // Send seed to spotify API
  suggestionServices
    .getSuggestions(spotifyToken, seed)
    .then((suggestion) => {
      return mongoServices.addSuggestion(suggestion).then(() => suggestion);
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
          coverImage: "/default_cover.png",
        },
        {
          title: "Master Of Puppets",
          album: "Remastered Deluxe Box Set",
          artist: "Metallica",
          coverImage: "/default_cover.png",
        },
        {
          title: "Master Of Puppets",
          album: "Remastered Deluxe Box Set",
          artist: "Metallica",
          coverImage: "/default_cover.png",
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
          coverImage: "/default_cover.png",
        },
        {
          title: "What You Know",
          album: "Tourist History",
          artist: "Two Door Cinema Club",
          coverImage: "/default_cover.png",
        },
        {
          title: "What You Know",
          album: "Tourist History",
          artist: "Two Door Cinema Club",
          coverImage: "/default_cover.png",
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
          coverImage: "/default_cover.png",
        },
        {
          title: "Another Love",
          album: "Long Way Down",
          artist: "Tom Odell",
          coverImage: "/default_cover.png",
        },
        {
          title: "Another Love",
          album: "Long Way Down",
          artist: "Tom Odell",
          coverImage: "/default_cover.png",
        },
      ],
    },
  ],
};

// Get previous suggestions from DB
app.get("/suggestions/:token", (req, res) => {
  const id = req.params["token"];
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
            coverImage: "/default_cover.png",
          },
          {
            title: "Master Of Puppets",
            album: "Remastered Deluxe Box Set",
            artist: "Metallica",
            coverImage: "/default_cover.png",
          },
          {
            title: "Master Of Puppets",
            album: "Remastered Deluxe Box Set",
            artist: "Metallica",
            coverImage: "/default_cover.png",
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
            coverImage: "/default_cover.png",
          },
          {
            title: "What You Know",
            album: "Tourist History",
            artist: "Two Door Cinema Club",
            coverImage: "/default_cover.png",
          },
          {
            title: "What You Know",
            album: "Tourist History",
            artist: "Two Door Cinema Club",
            coverImage: "/default_cover.png",
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
            coverImage: "/default_cover.png",
          },
          {
            title: "Another Love",
            album: "Long Way Down",
            artist: "Tom Odell",
            coverImage: "/default_cover.png",
          },
          {
            title: "Another Love",
            album: "Long Way Down",
            artist: "Tom Odell",
            coverImage: "/default_cover.png",
          },
        ],
      },
    ],
  };

  //   mongoServices
  //     .findSuggestions(id)
  //     .then((result) => res.send(result));

  res.status(200).send(fakePreviousSuggestions);
});

// Delete user from DB
app.delete("/user/:id", (req, res) => {
  const id = req.params["id"];
  mongoServices
    // removeUser calls removeSuggestions in mongoServices so shouldn't have to worry about deleting suggestions here
    .removeUser(id)
    .then((_) => res.status(204).send(`Deleted user with id: ${id}`));
});

app.listen(process.env.PORT || port, () => {
  console.log("REST API is listening.");
});
