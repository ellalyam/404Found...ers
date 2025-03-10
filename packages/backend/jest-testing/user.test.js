import { User, Suggestion } from "../models/user.js";
import { test, expect } from "@jest/globals";

test("Validates a new user", async () => {
  const user = new User({
    spotifyId: "abc123",
    suggestions: [],
  });

  await expect(user.validate()).resolves.toBeUndefined();
});

test("Validates a new suggestion", async () => {
  const suggestion = new Suggestion({
    mood: "Happy",
    name: "Song 1",
    id: "ascbj17268g9",
    dateSuggested: new Date(),
    tracks: [],
  });

  await expect(suggestion.validate()).resolves.toBeUndefined();
});
