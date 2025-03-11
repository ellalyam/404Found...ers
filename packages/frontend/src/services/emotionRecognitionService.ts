//import dotenv from "dotenv";
import { SpotifyLoginService } from "./spotifyLoginService.ts";
import { HumeClient } from "hume";
import { Blob } from "buffer";
// NOTE: the above import is necessary to pass the type checker, but the service
// doesn't actually work unless you remove it. This will be a non-issue once
// the API call is done from the backend.
import { backendUri } from "./uriService.ts";

//dotenv.config();
//const { HUMEAI_API_KEY } = process.env;

class EmotionRecognitionService {
  // Receives images and sends to Hume for analysis
  public static async identifyEmotion(imageSrc: string): Promise<void> {
    try {
      // Connect to Hume.ai
      const client = new HumeClient({
        apiKey: "NyEnSqsDCJWluAYaBquATgHslcPB8Y0HC5T7mkfN0JiUp0SR",
      });
      console.log("Create client");

      // Used to poll job until complete
      const checkJobStatus = async (jobId: string) => {
        while (true) {
          // Gets job details (including status)
          const waiting =
            await client.expressionMeasurement.batch.getJobDetails(
              jobId,
            );
          console.log("Got job details");

          // Determines status
          // Returns json if completed
          // Returns nothing/raises error if failed
          // Keeps looping if job is still in progress
          if (waiting.state.status === "COMPLETED") {
            console.log("Job complete", waiting);
            return waiting;
          } else if (waiting.state.status === "IN_PROGRESS") {
            console.log("Job still working", waiting);
          } else if (waiting.state.status === "FAILED") {
            console.error("Job failed.");
            return;
          }

          // Repolls every 3 seconds
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      };

      console.log("Processing image");
      console.log(imageSrc);
      const base64String = imageSrc.replace(/^data:image\/\w+;base64,/, "");
      const blobFile = EmotionRecognitionService.base64ImageToBlob(base64String);
      console.log(blobFile);

      // Send to Hume.ai
      const response =
        await client.expressionMeasurement.batch.startInferenceJobFromLocalFile(
          [blobFile],
          {},
        );
      console.log(response);
      console.log(response.jobId);

      // Validates job
      if (response) {
        console.log("working");

        // Call to poll job status
        const checking = await checkJobStatus(response.jobId);

                // Validates that job is complete
                if(checking) {
                    // Get job predictions (JSON)
                    const result = await client.expressionMeasurement.batch.getJobPredictions(response.jobId);
                    console.log("Response: ", result);

                    const spotifyId = localStorage.getItem("spotify_id");
                    const promise = fetch(backendUri + `/${spotifyId}/suggestions/new`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body : JSON.stringify(result)
                    });
                    return promise.then((res) => {
                        if (res.status === 201) {
                          return res.json();
                        } else {
                          throw new Error("Failed to send JSON.")
                        }
                      });
                }
            } else {
                console.log("not working");
            }

            // TODO:
            // Send to backend
            // Add comments & remove console.logs
            // Hide API key

    } catch (error) {
        console.error("Error processing image", error);
    }
  }

  // convert a base64-encoded image to a blob
  private static base64ImageToBlob(base64String: string): Blob {
    // TODO move to frontend. The Blob type that Hume expects is not usable
    // in frontend code. When this gets moved to the backend, use
    //   import { Blob } from "node:buffer";
    // to get the Blob type we need.
    const binaryString = window.atob(base64String);
    const len = binaryString.length;

    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new Blob([bytes], { type: "image/jpeg" });
  }
}

export default EmotionRecognitionService;
