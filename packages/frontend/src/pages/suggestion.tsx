import { useState, useRef, useCallback } from "react";
//import emotionRecognitionService from "../../../backend/services/emotionRecognitionService";
import Webcam from "react-webcam";
import { SpotifyLoginService } from "../services/spotifyLoginService.ts";
import { backendUri } from "../services/uriService";
import "../styling/suggestionPage.scss";
import { useNavigate } from "react-router-dom";

const videoConstraints = {
  width: 840,
  height: 420,
  facingMode: "user",
};

export default function Suggestion() {
  const [isCaptureEnable, setCaptureEnable] = useState(true);
  // const [url, setUrl] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const [screenshotCaptured, setScreenshotCaptured] = useState(false);
  const navigate = useNavigate();

  // Captures screenshots from webcam
  const capture = useCallback(() => {
    console.log("start capture");

    if (screenshotCaptured)
      return;

    // Captures screenshot
    const imageSrc = webcamRef.current?.getScreenshot(videoConstraints);

    if (imageSrc) {
      console.log(imageSrc);

      setScreenshotCaptured(true);

      const spotifyId = localStorage.getItem("spotify_id");
      const token = localStorage.getItem("spotify_access_token") || "";

      const promise = fetch(backendUri + `/${spotifyId}/suggestions`, {
        // const promise = fetch(backendUri + "/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": token,
        },
        body: JSON.stringify({ image: imageSrc })
      });

      promise.then(async (res) => {
        if (res.status === 201) {
          return res.json();
        } else if (res.status === 401) {
          if (await SpotifyLoginService.refreshAccessToken()) {
            location.reload();
          } else {
            document.location = "/";
          }
        } else {
          throw new Error(`Failed to send image: ${res.statusText}`);
        }
      }).then((data) => {
        console.log("Successful: ", data);
        navigate("/home");
      }).catch((error) => {
        console.error("Error in request:", error);
      });
    }
  }, [webcamRef, screenshotCaptured]);

  // Starts webcam for 3 seconds
  const startWebcam = () => {
    console.log("start webcam");

    // Turns camera off after 3 seconds
    setTimeout(() => {
      capture();
      setCaptureEnable(false);
    }, 3000);
  };

  if (isCaptureEnable) {
    startWebcam();
  }

  return (
    <div className="webcam">
      {
        isCaptureEnable ? (
          <div>
            <h3 className="title">Reading Emotion...</h3>
            <Webcam
              audio={false}
              width={840}
              height={420}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              style={{ transform: "scaleX(-1)" }}
            />
          </div>
        ) : (
          <div className="loadingSpinner">
            <img width={400} height={400} src="/images/loading-spinner.gif" alt="Loading Spinner" />
          </div>
        )
      }
    </div>
  );
}
