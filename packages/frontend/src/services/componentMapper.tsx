import { JSX } from "react";
import Track, { TrackInterface } from "../components/track";
import { SuggestionInterface } from "../components/suggestion";
import Suggestion from "../components/suggestion";

export class ComponentMapper {
  public static mapSuggestions(
    suggestions: SuggestionInterface[] | undefined,
  ): JSX.Element[] {
    if (suggestions) {
      return suggestions.map((suggestion, index) => {
        return (
          <Suggestion
            key={index}
            mood={suggestion.mood}
            tracks={suggestion.tracks}
            dateSuggested={new Date(suggestion.dateSuggested)}
          />
        );
      });
    } else {
      return [];
    }
  }
  public static mapTracks(tracks: TrackInterface[] | undefined): JSX.Element[] {
    if (tracks) {
      return tracks.map((track, index) => {
        return (
          <Track
            key={index}
            title={track.title}
            artist={track.artist}
            spotifyUrl={track.spotifyUrl}
          />
        );
      });
    } else {
      return [];
    }
  }
}
