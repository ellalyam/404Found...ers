import React from "react";
import "../styling/track.scss";

export interface TrackInterface {
  title: string;
  artist: string;
  spotifyUrl: string;
}

const Track: React.FC<TrackInterface> = ({
  title,
  artist,
  spotifyUrl
}) => {
  return (
    <a className="trackRow" target="_blank" href={spotifyUrl}>

      <h2 id="title" className="suggestionElement">
        {title}
      </h2>
      <h2 id="artist" className="suggestionElement">
        {artist}
      </h2>
    </a>
  );
};

export default Track;
