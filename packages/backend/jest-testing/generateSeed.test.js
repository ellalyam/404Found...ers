import { test, expect } from "@jest/globals";
import { findScore, generateSeed } from "../services/generateSeed.js";

const emotions = [
  { name: "Anger", score: 0.1 },
  { name: "Anxiety", score: 0.2 },
  { name: "Boredom", score: 0.6 },
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

  expect(result).toHaveProperty("target_danceability");
  expect(result).toHaveProperty("target_energy");
  expect(result).toHaveProperty("target_speechiness");
  expect(result).toHaveProperty("target_valence");
  expect(typeof result.target_danceability).toBe("number");
  expect(typeof result.target_energy).toBe("number");
  expect(typeof result.target_speechiness).toBe("number");
  expect(typeof result.target_valence).toBe("number");
});
