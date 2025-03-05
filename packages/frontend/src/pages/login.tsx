import ActionButton from "../components/actionButton";
import "../styling/login.scss";
import { SpotifyLoginService } from "../services/spotifyLoginService";
// Ella commented this out to get CI running (it doesn't work with unused variables)
// import { useNavigate } from "react-router-dom";

export default function Login() {
  // Ella commented this out to get CI running (it doesn't work with unused variables)
  // const navigate = useNavigate();

  if (localStorage.getItem("isLoggedIn") === "true") {
    document.location = "home";
  }

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  if (!(code === null)) {
    SpotifyLoginService.getAccessToken(code);
    return;
  }

  return (
    <div className="loginContainer">
      <div className="loginForm">
        <h1 className="title">Tune/In</h1>
        <ActionButton
          action={() => {
            SpotifyLoginService.logUserIn();
          }}
          imagePath="/spotify_logo.png"
          text="Login With Spotify"
        />
      </div>
    </div>
  );
}
