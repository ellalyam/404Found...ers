import { getUserTopTracks } from "./spotifyServices.js";

/**
 * Gets recommended songs with the given seed and parameters
 * @param  {JSON}  seed  Artist IDs and song parameters
 * @return {JSON}        Suggestion
 */
async function getRecommendedTracks(seed, mainEmotion) {
  const url = "https://api.reccobeats.com/v1/track/recommendation?";
  const response = await fetch(
    url +
      new URLSearchParams({
        size: 5,
        ...seed,
      }),
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  const responseData = await response.json();
  const outputData = {
    mood: mainEmotion,
    dateSuggested: new Date(),
    tracks: responseData.content.map((track) => {
      return {
        title: track.trackTitle,
        artist: track.artists[0].name,
        spotifyUrl: track.href,
      };
    }),
  };
  return outputData;
  //return responseData.content.map((track) => track.href.substring(31));
}

/**
 * Gets track suggestions from ReccoBeats API
 * @param   {String}  accessToken  Spotify user's API access token
 * @param   {JSON}    songParams   Target values for danceability, energy,
 *                                 speechiness, and valence
 * @param   {String}  mainEmotion  Most prevalent emotion
 * @return  {JSON}                 Suggestion
 */
async function getSuggestions(accessToken, songParams, mainEmotion) {
  // Get user's top tracks and add to seed
  const seed = {
    seeds: await getUserTopTracks(accessToken, 5),
    ...songParams,
  };

  // Get track suggestions with updated seed
  const responseData = await getRecommendedTracks(seed, mainEmotion);
  return responseData;
}

export { getSuggestions, getRecommendedTracks };
