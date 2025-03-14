import dotenv from "dotenv";
import { HumeClient } from "hume";
import { Blob } from "node:buffer";

dotenv.config();
const { HUMEAI_API_KEY } = process.env;

// Receives images and sends to Hume for analysis
async function identifyEmotion(imageSrc) {
  // Connect to Hume.ai
  const client = new HumeClient({
    apiKey: HUMEAI_API_KEY,
  });

  // Used to poll job until complete
  const checkJobStatus = async (jobId) => {
    console.log("check job status");
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
    
  const base64String = imageSrc.replace(/^data:image\/\w+;base64,/, "");
  const blobFile = base64ImageToBlob(base64String);

  // Send to Hume.ai
  const response =
    await client.expressionMeasurement.batch.startInferenceJobFromLocalFile(
      [blobFile],
      {},
    );
    
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
      console.log("got result");
      return result[0].results.predictions[0].models.face.groupedPredictions[0].predictions[0].emotions;
    } else {
      console.log("not working");
    }
  }

}

// convert a base64-encoded image to a blob
function base64ImageToBlob(base64String) {
  const binaryString = Buffer.from(base64String, 'base64');
  const blob = new Blob([binaryString], { type: "image/jpeg" });
  return blob;home
} 

export {identifyEmotion};
