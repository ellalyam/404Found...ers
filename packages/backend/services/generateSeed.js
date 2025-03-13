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
  const weightedEmotions = weights.map((emotion, i) => emotion * userScores[i]).sort().slice(-3);
  return weightedEmotions.reduce((a, v) => a + v, 0) / weightedEmotions.length;
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
    danceability: [0.7, 0.7, 0.1, 0.65, 0.85, 0.8, 0.9, 0.5],
    energy: [1.0, 0.15, 0.8, 0.1, 0.35, 0.4, 0.4, 0.4],
    speechiness: [0.5, 0.15, 0.4, 0.35, 0.05, 0.35, 0.4, 0.45],
    valence: [0.15, 0.85, 0.7, 0.65, 0.4, 0.95, 0.9, 0.95],
  };

  return {
    danceability: getMeasure(weights["danceability"], scoreArr),
    energy: getMeasure(weights["energy"], scoreArr),
    speechiness: getMeasure(weights["speechiness"], scoreArr),
    valence: getMeasure(weights["valence"], scoreArr)
  };

}

export { findScore, generateSeed };
