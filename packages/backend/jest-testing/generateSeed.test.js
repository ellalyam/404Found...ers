import { test, expect } from "@jest/globals";
import { findScore, generateSeed } from "../services/generateSeed.js";

const emotions = [
  { name: "Anger", score: 0.1 },
  { name: "Anxiety", score: 0.2 },
  { name: "Boredom", score: 1 },
  { name: "Calmness", score: 0.4 },
  { name: "Concentration", score: 0.1 },
  { name: "Joy", score: 0.3 },
  { name: "Romance", score: 0.1 },
  { name: "Excitement", score: 0.2 },
];

test("Finds correct score for a given emotion string", () => {
  expect(findScore(emotions, "Joy")).toBe(0.3);
  expect(findScore(emotions, "Anger")).toBe(0.1);
});

test("Returns object with seed properties", () => {
  const result = generateSeed(emotions);

  expect(result).toHaveProperty("danceability");
  expect(result).toHaveProperty("energy");
  expect(result).toHaveProperty("speechiness");
  expect(result).toHaveProperty("valence");
  expect(typeof result.danceability).toBe("number");
  expect(typeof result.energy).toBe("number");
  expect(typeof result.speechiness).toBe("number");
  expect(typeof result.valence).toBe("number");
});
