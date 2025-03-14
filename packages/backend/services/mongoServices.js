import mongoose from "mongoose";
import { User, Suggestion } from "../models/user.js";

/**
 * Saves a new user to the DB
 * @param {JSON} user
 */
function addUser(user) {
  const thisUser = new User(user);
  const promise = thisUser.save();
  return promise;
}

/**
 * Finds an existing user in the DB, if user w/ spotifyID DNE in Mongo, Add user instance and return
 * @param {number} spotifyId - Spotify ID associated with a user
 */
async function findUser(spotifyId) {
  let user = await User.findOne(
    { spotifyId },
    "spotifyId suggestions",
  );
  if (!user) {
    user = await addUser({
      spotifyId: await spotifyId,
      suggestions: [],
    });
  }
  return user;
}

/**
 * Finds suggestions corresponding with a user
 * @param String spotifyId - Spotify ID associated with a user
 */
async function findSuggestions(spotifyId) {
  const sIds = await findUser(spotifyId).then((user) => user.suggestions);
  return await Promise.all(sIds.map(async (id) => 
    Suggestion.findById(id).lean().exec()));
}

/**
 * Deletes all suggestions associated with a given user
 * NOTE: This should only be called when deleting a user from the DB
 * @param {number} spotifyId - User associated with suggestion(s)
 */
function removeSuggestions(spotifyId) {
  return Suggestion.deleteMany({ user: spotifyId });
}

/**
 * Removes a user from the DB
 * @param {number} spotifyId - Spotify ID associated with a user
 */
function removeUser(spotifyId) {
  removeSuggestions(spotifyId);
  return User.findOneAndDelete({ spotifyId });
}

/**
 * Saves a new suggestions to the DB
 * @param {JSON} suggestion - Instance of a suggestion
 */
async function addSuggestion(suggestion, spotifyId) {
  const user = await findUser(spotifyId);

  const thisSuggestion = new Suggestion({
    mood: suggestion.mood,
    name: suggestion.name,
    dateSuggested: new Date(suggestion.dateSuggested),
    tracks: suggestion.tracks,
  });

  const savedSuggestion = await thisSuggestion.save();

  if (!user.suggestions) {
    user.suggestions = [];
  }

  user.suggestions.push(savedSuggestion._id);
  await user.save();
  return savedSuggestion;
}

export { addUser, findUser, removeUser, addSuggestion, findSuggestions };
