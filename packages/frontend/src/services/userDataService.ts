import { SuggestionInterface } from "../components/suggestion.tsx";
import { backendUri } from "./uriService.ts";

export class UserDataService {
  public static async fetchPreviousSuggestions()
                      : Promise<SuggestionInterface[] | undefined> {
    const spotifyToken = localStorage.getItem("spotify_access_token");
    const spotifyId = localStorage.getItem("spotify_id");

    try {
      const headers = new Headers();
      if (spotifyToken) {
        headers.set("Token", spotifyToken);
      }

      const response = await fetch(backendUri + `/${spotifyId}/suggestions`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error | Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error while fetching suggestions | Code: ${error}`);
    }
  }

  public static async deleteUser(): Promise<JSON | undefined> {
    const spotifyToken = localStorage.getItem("spotify_access_token");
    const spotifyId = localStorage.getItem("spotify_id");

    try {
      const headers = new Headers();
      if (spotifyToken) {
        headers.set("Token", spotifyToken);
      }

      const response = await fetch(backendUri + `${spotifyId}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error | Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error while fetching suggestions | Code: ${error}`);
    }
  }
}

export interface UserInterface {
  userProfileImage: string;
  username: string;
  spotifyUserId: string;
}
