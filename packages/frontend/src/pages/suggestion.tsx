import { useState, useRef, useCallback } from "react";
//import emotionRecognitionService from "../../../backend/services/emotionRecognitionService";
import Webcam from "react-webcam";
import { backendUri } from "../services/uriService";

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user",
};

export default function Suggestion() {
  const [isCaptureEnable, setCaptureEnable] = useState(true);
  // const [url, setUrl] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const [screenshotCaptured, setScreenshotCaptured] = useState(false);

  // Captures screenshots from webcam
  const capture = useCallback(async () => {
    console.log("start capture");

    if (screenshotCaptured)
      return;

    // Captures screenshot
    const imageSrc = webcamRef.current?.getScreenshot();
    

    if (imageSrc) {
      console.log(imageSrc);

      setScreenshotCaptured(true);

      const spotifyId = localStorage.getItem("spotify_id");
      const token = localStorage.getItem("spotify_access_token") || "";
      
      const promise = fetch(backendUri + `/${spotifyId}/suggestions/new`, {
      //const promise = fetch(backendUri + "/suggestions/new", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "token": token,
        },
        body: JSON.stringify({ imageUrl: imageSrc })
      });

      promise.then((res) => {
        if (res.status === 201) {
          return res.json();
        } else {
          throw new Error(`Failed to send image: ${res.statusText}`);
        }
      }).then((data) => {
        console.log("Successful: ", data);
      }).catch((error) => {
        console.error("Error in request:", error);
      });
    }
  }, [webcamRef, screenshotCaptured]);

  // Starts webcam for 3 seconds
  const startWebcam = () => {
    console.log("start webcam");

    // Captures image 1.5 seconds into webcam being open
    setTimeout(() => {
      console.log("create capture");
      capture();
    }, 1500);

    // Turns camera off after 3 seconds
    setTimeout(() => {
      setCaptureEnable(false);
    }, 3000);
  };

  if (isCaptureEnable) {
    startWebcam();
  }

  return (
    <div className="webcam">
      {isCaptureEnable && (
        <div>
          <Webcam
            audio={false}
            width={720}
            height={360}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            style={{ transform: "scaleX(-1)" }}
          />
        </div>
      )}
    </div>
  );
}