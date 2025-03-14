/**
 * Gets emotion with the highest value from emotion JSON (ie most present in facial detection)
 * @param {JSON} emotion - From Hume (or user form?)
 * @return {String}        Emotion with highest rating
 */
function getMainEmotion(emotion) {
  const emotions = [
    "Anger",
    "Anxiety",
    "Boredom",
    "Calmness",
    "Concentration",
    "Joy",
    "Romance",
    "Excitement",
  ];

  return emotion.reduce(
    (max, em) =>
      em.score > max.score && emotions.includes(em.name) ? em : max,
    emotion[0],
  ).name;
}

export { getMainEmotion };
