import { SuggestionInterface } from "../components/suggestion";

export class UserDataService {
  public static async fetchPreviousSuggestions(): Promise<any> {
    const access_token = localStorage.getItem("spotify_access_token");

    try {
      const response = await fetch(`http://localhost:8000/suggestions/${access_token}`);
      if (!response.ok) {
        throw new Error(`HTTP Error | Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error while fetching suggestions | Code: ${error}`);
    }
  }

  public static async deleteUser(): Promise<any> {
    const access_token = localStorage.getItem("spotify_access_token");
    try {
      const response = await fetch(`http://localhost:8000/user/${access_token}`, {method: 'DELETE'});
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
