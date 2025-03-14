import React from "react";
import "../styling/track.scss";

export interface TrackInterface {
  title: string;
  album: string;
  artist: string;
}

const Track: React.FC<TrackInterface> = ({
  title,
  album,
  artist,
}) => {
  return (
    <a className="trackRow" target="_blank" href="https://open.spotify.com/">

      <h2 id="title" className="suggestionElement">
        {title}
      </h2>
      <h2 id="artist" className="suggestionElement">
        {artist}
      </h2>
      <h2 id="album" className="suggestionElement">
        {album}
      </h2>
    </a>
  );
};

export default Track;
