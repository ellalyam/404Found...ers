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
  return (
    weights
      .map((emotion, i) => emotion * userScores[i])
      .reduce((a, v) => a + v, 0) / weights.reduce((a, v) => a + v, 0)
  );
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
    danceability: [0.7, 0.7, 0.1, 0.65, 0.95, 0.8, 0.9, 0.5],
    energy: [1.0, 0.15, 0.8, 0.1, 0.35, 0.4, 0.4, 0.4],
    speechiness: [0.5, 0.15, 0.4, 0.35, 0.05, 0.35, 0.4, 0.45],
    valence: [0.15, 0.85, 0.7, 0.65, 0.5, 0.95, 0.9, 0.95],
  };

  // TODO: Delete before final submission
  // Hardcoded emotion-weight vectors for parameter tuning
  const ew_vectors = [
    [
      weights.danceability[0],
      weights.energy[0],
      weights.speechiness[0],
      weights.valence[0],
    ],
    [
      weights.danceability[1],
      weights.energy[1],
      weights.speechiness[1],
      weights.valence[1],
    ],
    [
      weights.danceability[2],
      weights.energy[2],
      weights.speechiness[2],
      weights.valence[2],
    ],
    [
      weights.danceability[3],
      weights.energy[3],
      weights.speechiness[3],
      weights.valence[3],
    ],
    [
      weights.danceability[4],
      weights.energy[4],
      weights.speechiness[4],
      weights.valence[4],
    ],
    [
      weights.danceability[5],
      weights.energy[5],
      weights.speechiness[5],
      weights.valence[5],
    ],
    [
      weights.danceability[6],
      weights.energy[6],
      weights.speechiness[6],
      weights.valence[6],
    ],
    [
      weights.danceability[7],
      weights.energy[7],
      weights.speechiness[7],
      weights.valence[7],
    ],
  ];
  console.log("EMOTION WEIGHT VECTORS");
  console.log(ew_vectors);

  const seed = {
    danceability: getMeasure(weights["danceability"], scoreArr),
    energy: getMeasure(weights["energy"], scoreArr),
    speechiness: getMeasure(weights["speechiness"], scoreArr),
    valence: getMeasure(weights["valence"], scoreArr),
  };

  console.log("SEED");
  console.log(seed);

  return seed;
}

export { findScore, generateSeed };
