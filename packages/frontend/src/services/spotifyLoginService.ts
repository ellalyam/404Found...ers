import { UserInterface } from "./userDataService.ts";
import { frontendUri } from "./uriService.ts";
const clientId: string = "08d7a2df00bd4b64b86be0839bcf858a";

export class SpotifyLoginService {
  public static async logUserIn() {
    const scope = "user-top-read";
    const authUrl = new URL("https://accounts.spotify.com/authorize");

    // begin the PKCE Flow

    // generate a random authorization code
    const authVerifier = SpotifyLoginService.generateRandomStr(64);
    window.localStorage.setItem("spotify_auth_verifier", authVerifier);
    // generate an authorization challenge from the above code
    const authChallenge = SpotifyLoginService.base64encode(
      await SpotifyLoginService.sha256(authVerifier),
    );

    // request authorization from Spotify
    const authParams = {
      response_type: "code",
      client_id: clientId,
      scope,
      code_challenge_method: "S256",
      code_challenge: authChallenge,
      redirect_uri: frontendUri,
    };

    // send authorization request
    authUrl.search = new URLSearchParams(authParams).toString();

    // send user to the Spotify authorization page
    window.location.href = authUrl.toString();
  }

  public static async getAccessToken(code: string) {
    const authVerifier = localStorage.getItem("spotify_auth_verifier");
    if (authVerifier === null) {
      SpotifyLoginService.logUserIn();
      return;
    }

    const url = "https://accounts.spotify.com/api/token";
    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code,
        redirect_uri: frontendUri,
        code_verifier: authVerifier,
      }),
    };

    localStorage.setItem("isLoggedIn", "true");
    const body = await fetch(url, payload);
    const response = await body.json();

    localStorage.setItem("spotify_access_token", response.access_token);
    localStorage.setItem("spotify_refresh_token", response.refresh_token);
    
    const userData = await SpotifyLoginService.getUserProfile();
    localStorage.setItem("spotify_id", userData.spotifyUserId);

    document.location = "home";
  }


  private static semaphore = false;

  public static async refreshAccessToken(): Promise<boolean> {
    if (SpotifyLoginService.semaphore) {
      await new Promise((r) => setTimeout(r, 1000));
      return true;
    } else {
      SpotifyLoginService.semaphore = true;
    }

    const refreshToken = localStorage.getItem("spotify_refresh_token");
    if (refreshToken === null) {
      await SpotifyLoginService.logUserIn();
      return;
    }

    const url = "https://accounts.spotify.com/api/token";

    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
      }),
    };

    const response = await fetch(url, payload);

    if (response.status >= 400) {
      localStorage.setItem("isLoggedIn", "false");
      return false;
    }

    const body = await response.json();

    localStorage.setItem("spotify_access_token", body.access_token);
    if (body.refresh_token) {
      localStorage.setItem("spotify_refresh_token", body.refresh_token);
    }
    SpotifyLoginService.semaphore = false;
    return true;
  }

  public static async getUserProfile(): Promise<UserInterface> {
    const accessToken = localStorage.getItem("spotify_access_token");
    const url = "https://api.spotify.com/v1/me";

    const response = await fetch(url, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });

    if (response.status === 401) {
      if (await SpotifyLoginService.refreshAccessToken()) {
        return await SpotifyLoginService.getUserProfile();
      } else {
        localStorage.setItem("isLoggedIn", "false");
        document.location = "/";
      }
    } else if (response.status >= 400) {
      throw Error(`Failed to get user profile: ${response.body}`);
    }

    const userData = await response.json();

    if (userData.error) {
      console.log(userData.error);
      throw Error("something happened");
    }

    return {
      userProfileImage: (userData.images.length === 0)
                        ? "/images/default_user.png"
                        : userData.images[0].url,
      username: userData.display_name,
      spotifyUserId: userData.id,
    };
  }

  private static generateRandomStr(length: number): string {
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
      "abcdefghijklmnopqrstuvwxyz" +
      "0123456789_.-~";
    const randValues = crypto.getRandomValues(new Uint8Array(length));
    return randValues.reduce((acc, x) => {
      return acc + charset[x % charset.length];
    }, "");
  }

  private static async sha256(plaintext: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    return window.crypto.subtle.digest("SHA-256", data);
  }

  private static base64encode(input: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }
}
