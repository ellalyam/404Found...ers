import { test, expect, jest } from "@jest/globals";
import {
  addUser,
  findUser,
  removeUser,
  addSuggestion,
  findSuggestions,
} from "../services/mongoServices.js";
import { User, Suggestion } from "../models/user.js";

test("placeholder", () => {
  expect(2+2).toBe(4);
})

test("Creates & saves a user", async () => {
  const userData = { spotifyId: "abc123", suggestions: [] };
  const user = { ...userData };
  jest.spyOn(User.prototype, "save").mockResolvedValue(user);
  const result = await addUser(userData);

  expect(result).toEqual(user);
  expect(User.prototype.save).toHaveBeenCalled();
});

// test("Returns a user from the DB", async () => {
//   const user = { spotifyId: "abc123", suggestions: [] };
//   jest.spyOn(User, "findById").mockResolvedValue(user);
//   const result = await findUser("abc123");

//   expect(result).toEqual(user);
// });

// test("If a user is not in the DB, create new user & return", async () => {
//   const user = { spotifyId: "abc123", suggestions: [] };
//   jest.spyOn(User, "findById").mockResolvedValue(null);
//   jest.spyOn(User.prototype, "save").mockResolvedValue(user);
//   const result = await findUser("abc123");

//   expect(User.findById).toHaveBeenCalledWith("abc123");
//   expect(User.prototype.save).toHaveBeenCalled();
//   expect(result).toEqual(user);
// });

// test("Returns suggestions given a spotify ID", async () => {
//   const user = {
//     spotifyId: "abc123",
//     suggestions: ["Hello, I'm a suggestion :)"],
//   };
//   User.findById.mockReturnValue({
//     populate: jest.fn().mockResolvedValue(user),
//   });
//   const spotifyId = "abc123";
//   const suggestions = await findSuggestions(spotifyId);

//   expect(suggestions).toEqual(user.suggestions);
//   expect(User.findById).toHaveBeenCalledWith(spotifyId);
// });

// test("Deletes users suggestions and then deletes user", async () => {
//   const deleteRes = { spotifyId: "abc123" };
//   jest.spyOn(Suggestion, "deleteMany").mockResolvedValue({ deletedCount: 1 });
//   jest.spyOn(User, "findByIdAndDelete").mockResolvedValue(deleteRes);
//   const result = await removeUser("abc123");

//   expect(Suggestion.deleteMany).toHaveBeenCalledWith({ user: "abc123" });
//   expect(User.findByIdAndDelete).toHaveBeenCalledWith("abc123");
//   expect(result).toEqual(deleteRes);
// });

// test("Saves new suggestion", async () => {
//   const user = {
//     spotifyId: "abc123",
//     suggestions: [],
//     save: jest.fn().mockResolvedValue(true),
//   };

//   jest.spyOn(User, "findById").mockResolvedValue(user);

//   const suggestion = {
//     mood: "This is a song you should listen to because you are very sad",
//     name: "name",
//     id: "suggestion1",
//     dateSuggested: new Date(),
//     tracks: ["1", "2", "3"],
//   };

//   const suggestionObj = { ...suggestion };
//   jest.spyOn(Suggestion.prototype, "save").mockResolvedValue(suggestionObj);
//   const result = await addSuggestion(suggestion, "abc123");

//   expect(result).toEqual(suggestionObj);
//   expect(Suggestion.prototype.save).toHaveBeenCalled();
// });
