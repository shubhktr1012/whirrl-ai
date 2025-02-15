import path from "path"; // Importing the 'path' module for handling file paths
import { exec } from "child_process"; // Importing 'exec' to run shell commands
import fs from "fs";
import readline from "readline";

// Function to transcribe audio files
//Code from routes/upload.ts
export const transcribeAudio = (audioPath: string): Promise<{txtPath: string, srtPath: string, transcriptLines: string[]}> => {
    return new Promise((resolve, reject) => {
        try {
            const whisperPath = path.resolve(process.cwd(), "whisper.cpp/build/bin/Release/whisper-cli.exe").replace(/\\/g, "/");
            const modelPath = path.resolve(process.cwd(), "whisper.cpp/models/ggml-base.en.bin").replace(/\\/g, "/");

            // Ensure the Whisper binary exists
            if (!fs.existsSync(whisperPath)) {
                reject(new Error(`🚨 Whisper binary not found at: ${whisperPath}`));
                return;
            }

            // Ensure the model file exists
            if (!fs.existsSync(modelPath)) {
                reject(new Error(`🚨 Whisper model not found at: ${modelPath}`));
                return;
            }

            // Defining the output path for the transcript file
            const outputPath = audioPath.replace(".wav", ""); // Save transcript next to the audio file
            const txtPath = `${outputPath}.txt`;
            const srtPath = `${outputPath}.srt`;

            console.log("Transcribing audio:", audioPath); // Log the audio file being transcribed
            console.log("Using Whisper binary at:", whisperPath); // Log the path to the Whisper binary
            console.log("Using Whisper model at: ", modelPath);

            // Constructing the command to run Whisper
            const command = `"${whisperPath}" --file "${audioPath}" --output-txt --output-srt --output-file "${outputPath.replace(/\.txt$/, "")}" --model "${modelPath}"`;
            console.log("Running command:", command); // Log the command being executed

            // Executing the command
            exec(command, (error, stdout, stderr) => {
            if (error) {
                // Rejecting the promise if there's an error
                reject(new Error(`Whisper transcription error: ${stderr || error.message}`));
                return;
            }
            console.log("Transcription complete. Output saved"); // Log success message
            console.log("TXT saved at:", txtPath);
            console.log("SRT saved at:", srtPath);

            // Verify that both `.txt` and `.srt` files exist
            if (!fs.existsSync(txtPath) || !fs.existsSync(srtPath)) {
                reject(new Error(`🚨 Transcript files missing: ${txtPath} or ${srtPath}`));
                return;
            }

            const transcriptStream = fs.createReadStream(txtPath);
            const transcriptLines: string[] = [];

            const r1 = readline.createInterface({
                input: transcriptStream,
                crlfDelay: Infinity,
            });

            r1.on("line", (line) => {
                transcriptLines.push(line.trim()); //Reads only line by line
            });

            r1.on("close", async () => {
                console.log("Transcription Content (Streamed):", transcriptLines.join(" "));

                try {
                    fs.unlinkSync(audioPath);
                    fs.unlinkSync(txtPath);
                } catch (cleanupError) {
                    console.warn("⚠️ Cleanup Warning:", cleanupError);
                }
                resolve({ txtPath, srtPath, transcriptLines });
            });    
        });
    } catch (err) {
        console.error("🚨 Unexpected transcription error:", err);
        reject(new Error("An unexpected error occurred while transcribing audio."));
    }
        
});
};

