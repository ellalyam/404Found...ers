import { test, expect, jest } from "@jest/globals";
import { getRecommendedTracks } from "../services/suggestionService";

global.fetch = jest.fn();

test("getRecommendedTracks correctly returns JSON with main emotion", async () => {
  fetch.mockResolvedValue({
    json: () =>
      Promise.resolve({
        content: [],
      }),
  });

  const res = await getRecommendedTracks({}, "happy");
  expect(res.mood).toBe("happy");
});
