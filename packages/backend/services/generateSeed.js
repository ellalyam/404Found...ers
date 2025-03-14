
/**
 * Finds a users score for a given emotion
 * @param {JSON} emotions - From Hume (or user form?)
 * @param {string} emotion - The emotion to find
 * @returns {number} - A score 0-1
 */
function findScore(emotions, emotion) {
  return emotions.find((x) => x.name == emotion).score;
}

/**
 *  Generates a measure 0-1 for a target song feature
 * @param {number[]} weights - Weights for each emotion on a seed attribute
 * @param {number[]} userScores - Scores for each emotion from a user
 * @returns {number} - Normalized weighted sum based on userScores
 */
function getMeasure(weights, userScores) {
  let res = weights
    .map((emotion, i) => emotion * userScores[i])
    .sort()
    .slice(-1)[0];

  if (res > 0.5) {
    res = res + 0.05;
  } else {
    res = res - 0.05;
  }

  if (res > 1) {
    return 1;
  } else if (res < 0) {
    return 0;
  } else {
    return res;
  }
}

/**
 * Generates four target measure seed values for Spotify Web API (danceability, energy, speechiness, valence)
 * @param {JSON} emotions - From Hume (or user form?)
 * @returns {JSON} - Seed values
 */
function generateSeed(emotions) {
  // Get scores for emotions of interest
  const scoreArr = [
    findScore(emotions, "Anger"),
    findScore(emotions, "Anxiety"),
    findScore(emotions, "Boredom"),
    findScore(emotions, "Calmness"),
    findScore(emotions, "Concentration"),
    findScore(emotions, "Joy"),
    findScore(emotions, "Romance"),
    findScore(emotions, "Excitement"),
  ];

  // Fiddle with these weights to tune suggestions
  // [anger, anxiety, boredom, calmness, concentration, joy, romance, excitement]
  const weights = {
    danceability: [0.2, 0.1, 0.1, 0.2, 0.15, 0.9, 0.8, 0.9],
    energy: [1.0, 0.2, 0.8, 0.0, 0.3, 0.86, 0.5, 0.9],
    speechiness: [0.4, 0.15, 0.4, 0.35, 0.05, 0.35, 0.4, 0.1],
    valence: [0.0, 0.1, 0.7, 0.5, 0.2, 1.0, 0.9, 0.95],
    acousticness: [0.5, 0.3, 0.7, 0.9, 0.8, 0.5, 0.9, 0.1],
    instrumentalness: [0.9, 0.3, 0.5, 0.7, 0.9, 0.3, 0.4, 0.1],
    liveness: [0.5, 0.5, 0.2, 0.2, 0.1, 0.7, 0.4, 0.9],
    loudness: [1.0, 0.1, 0.3, 0.05, 0.2, 0.85, 0.5, 0.9]
  };

  return {
    danceability: getMeasure(weights["danceability"], scoreArr),
    energy: getMeasure(weights["energy"], scoreArr),
    speechiness: getMeasure(weights["speechiness"], scoreArr),
    valence: getMeasure(weights["valence"], scoreArr),
    acousticness: getMeasure(weights["acousticness"], scoreArr),
    instrumentalness: getMeasure(weights["instrumentalness"], scoreArr),
    liveness: getMeasure(weights["liveness"], scoreArr),
    loudness: getMeasure(weights["loudness"], scoreArr)
    };
}

export { findScore, generateSeed };
