import { HumeClient, convertBase64ToBlob } from "hume";

class EmotionRecognitionService {

    // Receives images and sends to Hume for analysis
    public static async identifyEmotion(imageSrc: string): Promise<void> {
        try {
            // Connect to Hume.ai
            const client = new HumeClient({ apiKey: "NyEnSqsDCJWluAYaBquATgHslcPB8Y0HC5T7mkfN0JiUp0SR" });
            console.log("Create client");

            // Used to poll job until complete
            const checkJobStatus = async (jobId: string) => {
                while (true) {
                    // Gets job details (including status)                   
                    const waiting = await client.expressionMeasurement.batch.getJobDetails(response.jobId);
                    console.log("Got job details");
                  
                    // Determines status
                    // Returns json if completed
                    // Returns nothing/raises error if failed
                    // Keeps looping if job is still in progress
                    if (waiting.state.status === "COMPLETED") {
                        console.log("Job complete", waiting);
                        return waiting;
                    } else if(waiting.state.status === "IN_PROGRESS") {
                        console.log("Job still working", waiting);
                    } else if (waiting.state.status === "FAILED") {
                        console.error("Job failed.");
                        return;
                    }
                
                    // Repolls every 3 seconds
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }
            };
            
            console.log("Processing image");
            console.log(imageSrc);
            const base64String = imageSrc.replace(/^data:image\/\w+;base64,/, ""); 
            const blobFile = convertBase64ToBlob(base64String);
            console.log(blobFile);
            // Send to Hume.ai
            const response = await client.expressionMeasurement.batch.startInferenceJobFromLocalFile(
                [blobFile],
                {}
            );
            console.log(response);
            console.log(response.jobId);

            // Validates job
            if(response) {
                console.log("working");
                
                // Call to poll job status
                const checking = await checkJobStatus(response.jobId);

                // Validates that job is complete
                if(checking) {
                    // Get job predictions (JSON)
                    const result = await client.expressionMeasurement.batch.getJobPredictions(response.jobId);
                    console.log("Response: ", result);
                }
            } else {
                console.log("not working");
            }

            // TO DO:
            // Send to backend
            // Public URL
            // Add comments & remove console.logs
            // Hide API key
            
        } catch (error) {
            console.error("Error processing image", error);
        }

    }
  }

export default EmotionRecognitionService;
