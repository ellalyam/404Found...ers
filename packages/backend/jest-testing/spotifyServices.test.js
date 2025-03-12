import { test, expect, jest } from "@jest/globals";
import { getUserId, getUserTopTracks } from "../services/spotifyServices";

global.fetch = jest.fn();

test("Gets user ID", async () => {
  fetch.mockResolvedValue({
    json: () => Promise.resolve({ id: "user123" }),
  });

  const user = await getUserId("token");
  expect(user).toBe("user123");
});

test("Catches a fetch error", async () => {
  fetch.mockResolvedValue({
    json: () => Promise.resolve({ error: "fail" }),
  });

  const user = await getUserId("token");
  expect(user).toBe(undefined);
});

test("Returns array of top tracks", async () => {
  fetch.mockResolvedValue({
    json: () => Promise.resolve({ items: [{ id: 1 }, { id: 2 }] }),
  });

  const tracks = await getUserTopTracks("token", 2);
  expect(tracks).toEqual([1, 2]);
});
