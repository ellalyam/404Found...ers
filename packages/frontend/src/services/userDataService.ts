import { SuggestionInterface } from "../components/suggestion.tsx";
import { SpotifyLoginService } from "./spotifyLoginService.ts";
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

      if (response.status === 401) {
        if (await SpotifyLoginService.refreshAccessToken()) {
          return await UserDataService.fetchPreviousSuggestions();
        } else {
          document.location = "/";
        }
      } else if (response.status >= 400) {
        throw new Error(`HTTP Error | Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error while fetching suggestions | Code: ${error}`);
    }
  }

  public static async deleteUser(): Promise<boolean> {
    const spotifyToken = localStorage.getItem("spotify_access_token");
    const spotifyId = localStorage.getItem("spotify_id");

    try {
      const headers = new Headers();
      if (spotifyToken) {
        headers.set("Token", spotifyToken);
      }

      const response = await fetch(backendUri + `/${spotifyId}`, {
        method: "DELETE",
        headers,
      });

      if (response.status === 401) {
        if (await SpotifyLoginService.refreshAccessToken()) {
          return await UserDataService.deleteUser();
        } else {
          document.location = "/";
        }
      } else if (response.status >= 400) {
        throw new Error(`HTTP Error | Status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error(`Error while fetching suggestions | Code: ${error}`);
      return false;
    }
  }
}

export interface UserInterface {
  userProfileImage: string;
  username: string;
  spotifyUserId: string;
}
