/**
 * Gets the Spotify user ID of a user
 * @param   {String}  accessToken Spotify user's API access token
 * @return  {String}              Spotify user's ID
 */
async function getUserId(accessToken) {
  const url = "https://api.spotify.com/v1/me";

  const response = await fetch(url, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });

  if (response.status === 401) {
    throw Error("Token Expired");
  }

  const userData = await response.json();

  if (userData.error) {
    console.log(userData.error);
  }
  return userData.id;
}

/**
 * Gets the top n tracks of a Spotify user
 * @param   {String}        accessToken Spotify user's API access token
 * @param   {Number}        count       The maximum number of returned tracks
 * @return  {Array<String>}             Array of Spotify track IDs
 */
async function getUserTopTracks(accessToken, count) {
  const url = "https://api.spotify.com/v1/me/top/tracks?";

  const response = await fetch(
    url +
      new URLSearchParams({
        type: "tracks",
        time_range: "long_term",
        limit: count,
      }),
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    },
  );

  if (response.status === 401) {
    throw Error("Token Expired");
  } else if (response.status >= 400) {
    throw Error(`Request failed: ${response.body}`)
  }

  const responseData = await response.json();
  return responseData.items.map((item) => item.id);
}

export { getUserId, getUserTopTracks };
