import mongoose from "mongoose";
import { User, Suggestion } from "./models/user.js";

/**
 * Saves a new user to the DB
 * @param {JSON} user
 */
function addUser(user) {
    const thisUser = new User(user);
    const promise = thisUser.save();
    return promise
}

/**
 * Finds an existing user in the DB
 * @param {number} spotifyId - Spotify ID associated with a user
 */
function findUser(spotifyId) {
    return User.findById(spotifyId);
}

/**
 * Finds suggestions corresponding with a user
 * @param {number} spotifyId - Spotify ID associated with a user
 */
function findSuggestions(spotifyId) {
    return User.findById(spotifyId)
    .populate("suggestions") 
    .then(user.suggestions); 
}

/**
 * Deletes all suggestions associated with a given user
 * NOTE: This should only be called when deleting a user from the DB
 * @param {number} spotifyId - User associated with suggestion(s)
 */
function removeSuggestions(spotifyId) {
    return Suggestion.deleteMany({ "user": spotifyId });
}

/**
 * Removes a user from the DB
 * @param {number} spotifyId - Spotify ID associated with a user
 */
function removeUser(spotifyId) {
    removeSuggestions(spotifyId);
    return User.findByIdAndDelete(spotifyId);
}

/**
 * Saves a new suggestions to the DB
 * @param {JSON} suggestion - Instance of a suggestion
 */
function addSuggestion(suggestion) {
    // May need to reformat suggestion depending on how JSON is formatted from getSuggestions
    const thisSuggestion = new Suggestion(suggestion);
    const promise = thisSuggestion.save();
    return promise
}

export default {
    addUser,
    findUser,
    removeUser,
    addSuggestion,
    findSuggestions
}
