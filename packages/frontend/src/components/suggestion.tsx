import { TrackInterface } from "./track";
import "../styling/suggestionComponent.scss";
import { useEffect, useState } from "react";
import { ComponentMapper } from "../services/componentMapper";

export interface SuggestionResponse {
  suggestions: SuggestionInterface[];
}

export interface SuggestionInterface {
  mood: string;
  name: string;
  id: string;
  dateSuggested: Date;
  tracks: {
    title: string;
    album: string;
    artist: string;
    coverImage: string;
  }[];
}

const Suggestion: React.FC<SuggestionInterface> = ({
  id,
  dateSuggested,
  mood,
  tracks,
}) => {
  const trackString = tracks.map((track) => track.title).join(", ");

  const [trackDisplay, setTrackDisplay] = useState(false);
  const [suggestedTracks, setSuggestedTracks] = useState<TrackInterface[]>();

  useEffect(() => {
    setSuggestedTracks(tracks);
  }, [tracks]);
  return (
    <div
      id={id}
      className="suggestionContainer"
      onClick={() => {
        setTrackDisplay(!trackDisplay);
      }}>
      <div className="suggestionRow">
        <h2 id="emotion" className="suggestionElement">
          {mood}
        </h2>
        <h2 id="tracks" className="suggestionElement">
          {trackString}
        </h2>
        <h2 id="date" className="suggestionElement">
          {
            `${String(dateSuggested.getMonth() + 1).padStart(2, "0")}/${String(dateSuggested.getDate()).padStart(2, "0")}/${String(dateSuggested.getFullYear()).slice(-2)}`
          }
        </h2>
      </div>
      <div className="trackContainer">
        {trackDisplay ? ComponentMapper.mapTracks(suggestedTracks) : null}
      </div>
    </div>
  );
};

export default Suggestion;
