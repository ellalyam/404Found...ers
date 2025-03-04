const clientId: string = "08d7a2df00bd4b64b86be0839bcf858a";
const redirectUri: string = "http://localhost:5173";
// const redirectUri: string = "tune-in-dvgxbqesgcg5gqgv.westus-01.azurewebsites.net";

export class SpotifyLoginService {
  public static async logUserIn(): Promise<number> {
    const redirectUri = "http://localhost:5173";
    //const redirectUri = "tune-in-dvgxbqesgcg5gqgv.westus-01.azurewebsites.net";
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
      redirect_uri: redirectUri,
    };

    // send authorization request
    authUrl.search = new URLSearchParams(authParams).toString();

    // send user to the Spotify authorization page
    window.location.href = authUrl.toString();

    return 3;
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
        redirect_uri: redirectUri,
        code_verifier: authVerifier,
      }),
    };

    localStorage.setItem("isLoggedIn", "true");
    const body = await fetch(url, payload);
    const response = await body.json();

    localStorage.setItem("spotify_access_token", response.access_token);
    localStorage.setItem("spotify_refresh_token", response.refresh_token);
  }

  public static async refreshAccessToken() {
    const refreshToken = localStorage.getItem("spotify_refresh_token");
    if (refreshToken === null) {
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
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
      }),
    };

    const body = await fetch(url, payload);
    const response = await body.json();

    localStorage.setItem("spotify_access_token", response.accessToken);
    if (response.refreshToken) {
      localStorage.setItem("spotify_refresh_token", response.refreshToken);
    }
  }

  public static async getUsername(): Promise<string> {
    const accessToken = localStorage.getItem("spotify_access_token");
    const url = "https://api.spotify.com/v1/me";

    const response = await fetch(url, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });

    const userData = await response.json();

    if (userData.error) {
      return "";
    }
    return userData.display_name;
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
