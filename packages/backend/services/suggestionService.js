import spotifyServices from "./spotifyServices.js";

/**
  * Gets recommended songs with the given seed and parameters
  * @param  {JSON}    seed        Artist IDs and song parameters
  * @return {Array<String>}       Array of Spotify track IDs
  */
async function getRecommendedTracks(seed) {
  const url = "https://api.reccobeats.com/v1/track/recommendation?";
  const response = await fetch(url + new URLSearchParams({
    size: 5,
    ...seed,
  }), {
    headers: {
      "Accept": "application/json",
    },
  });

  const responseData = await response.json();
  return responseData.content.map((track) => track.href.substring(31));
}

/**
  * Gets track suggestions from ReccoBeats API
  * @param   {String}  accessToken Spotify user's API access token
  * @param   {JSON}    songParams  Target values for danceability, energy,
  *                                speechiness, and valence
  * @return  {Array<String>}       Array of Spotify track IDs
  */
async function getSuggestions(accessToken, songParams) {
  // Get user's top tracks and add to seed
  const seed = {
    seeds: await spotifyServices.getUserTopTracks(accessToken, 5),
    ...songParams,
  }

  // Get track suggestions with updated seed
  const responseData = await getRecommendedTracks(seed);
  return responseData;
}

export default {
  getSuggestions,
};
