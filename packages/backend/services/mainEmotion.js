/**
 * Gets emotion with the highest value from emotion JSON (ie most present in facial detection)
 * @param {JSON} emotion - From Hume (or user form?)
 * @return {String}        Emotion with highest rating
 */
function getMainEmotion(emotion) {
    return emotion.reduce(
      (max, em) => (em.score > max.score ? em : max),
      emotion[0],
    ).name;
}

export { getMainEmotion };