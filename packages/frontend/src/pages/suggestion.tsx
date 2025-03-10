import { useState, useRef, useCallback } from "react";
import emotionRecognitionService from "../services/emotionRecognitionService";
import Webcam from "react-webcam";

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
      // setUrl(imageSrc);
      console.log(imageSrc);

      //emotionRecognitionService.uploadBase64Image(imageSrc);
      setScreenshotCaptured(true);
      // Using online image with public URL for now to test API
      emotionRecognitionService.identifyEmotion(imageSrc)
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