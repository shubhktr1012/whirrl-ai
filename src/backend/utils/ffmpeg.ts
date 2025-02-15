import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

type FontOptions = {
    fontName: string;
    fontSize: number;
    fontColor: string;
};

export interface ManualSegment {
    userStart: number;
    userEnd: number;
    speechStart: number;
    speechEnd: number;
    text: string;
}

// Helper to format time in HH:MM:SS,mmm
const formatTime = (t: number): string => {
    const hours = Math.floor(t / 3600);
    const minutes = Math.floor((t % 3600) / 60);
    const seconds = Math.floor(t % 60);
    const milliseconds = Math.floor((t - Math.floor(t)) * 1000);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")},${String(milliseconds).padStart(3, "0")}`;
};

//Code from routes/upload.ts
export const extractAudio = (
    inputVideoPath: string
): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            const audioOutputDir = path.resolve(process.cwd(), "audio").replace(/\\/g, "/");

            // Ensure the audio output directory exists
            if (!fs.existsSync(audioOutputDir)) {
                fs.mkdirSync(audioOutputDir, { recursive: true });
                console.log("✅ Created missing audio directory:", audioOutputDir);
            }

            // Define the audio file name and path
            const audioFileName = `audio-${Date.now()}.wav`;
            const outputAudioPath = path.join(audioOutputDir, audioFileName).replace(/\\/g, "/");

            console.log("🔄 Name of audio file:", audioFileName);

            ffmpeg(inputVideoPath)
            .output(outputAudioPath)
            .audioCodec('pcm_s16le') // 16-bit PCM audio
            .audioFrequency(16000) // Convert to 16kHz
            .noVideo()
            .on('end', () => {
                console.log("✅ Audio extracted successfully:", outputAudioPath);
                resolve(outputAudioPath);
            }) 
            .on('error', (err) => {
                console.error("❌ FFmpeg audio extraction error:", err.message);
                reject(new Error(`FFmpeg error: ${err.message}`));
            })
            .run();
        } catch (err) {
            reject(new Error(`Unexpected error in extractAudio: ${err}`));
        }   
    });
};

export const getVideoMetadata = (
    videoPath: string
  ): Promise<{ width: number; height: number; duration: number }> => {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) {
          reject(new Error(`Failed to get video metadata: ${err.message}`));
          return;
        }
  
        const stream = metadata.streams.find((s) => s.codec_type === "video");
        if (!stream || !stream.width || !stream.height) {
          reject(new Error("Could not determine video resolution."));
          return;
        }
  
        const duration = metadata.format.duration;
        if (!duration) {
          reject(new Error("Could not determine video duration."));
          return;
        }
  
        resolve({ width: stream.width, height: stream.height, duration });
      });
    });
  };
  

// Function to split text into multiple lines
const wrapText = (text: string, maxCharsPerLine: number = 40): string => {
    const words = text.split(" ");
    let lines: string[] = [];
    let currentLine = "";

    for (let word of words) {
        if ((currentLine + word).length <= maxCharsPerLine) {
            currentLine += (currentLine.length > 0 ? " " : "") + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    if (currentLine.length > 0) {
        lines.push(currentLine);
    }

    return lines.join("\\n"); // FFmpeg uses "\n" for new lines
};

//Code back to routes/upload.ts
export const convertToGIF = async (
    inputPath: string,
    gifOutputDir: string,
    segments: ManualSegment[],
    fontOptions: FontOptions
): Promise<string[]> => {
    // Ensure output directory exists
    if (!fs.existsSync(gifOutputDir)) {
        fs.mkdirSync(gifOutputDir, { recursive: true });
    }

    // Get video resolution
    const { width, height, duration: videoDuration } = await getVideoMetadata(inputPath);
    let gifPaths: string[] = [];

    // Process each timestamped segment separately
    const processSegment = (index: number): Promise<string[]> => {
        if (index >= segments.length) {
            return Promise.resolve(gifPaths);
        }

        const segment = segments[index];

        // Make sure we don't go past the video duration
        const gifStart = Math.max(0, segment.userStart);
        const gifEnd = Math.min(segment.userEnd, videoDuration);
        const gifDuration = gifEnd - gifStart;

        console.log(`🎬 Processing GIF: User range ${gifStart}s to ${gifEnd}s (duration: ${gifDuration}s)`);

        if (gifStart >= videoDuration) {
            console.warn(`⏳ Skipping segment ${index}: Start time exceeds video duration.`);
            return processSegment(index + 1);
        }

        // If no text is provided, use an empty string (captions will be blank)
        if (!segment.text) {
            console.warn(`⚠️ No text for segment ${index}; using empty caption.`);
            segment.text = "";
        }

        // Calculate caption start time relative to GIF start
        const captionStart = Math.max(0, segment.userStart - gifStart);
        const captionEnd = Math.max(captionStart + 0.1, segment.userEnd - gifStart);

        const outputName = `gif-${Date.now()}-${index}.gif`;
        const outputPath = path.resolve(gifOutputDir, outputName).replace(/\\/g, "/");

        console.log(`🎬 Creating GIF from ${gifStart}s to ${gifEnd}s: ${outputPath}`);
        console.log(`📝 Caption appears from ${captionStart.toFixed(2)}s to ${captionEnd.toFixed(2)}s`);

        const fontColor = fontOptions.fontColor.startsWith("#")
            ? fontOptions.fontColor.slice(1) // Remove #
            : fontOptions.fontColor;

        const fontSize = Math.max(Math.round(height * 0.05), 24); // Ensure min font size
        const wrappedText = wrapText(segment.text, 30); // Ensure text wraps properly

        const srtFilePath = path.resolve(gifOutputDir, `sub-${Date.now()}-${index}.srt`).replace(/\\/g, "/");
        const srtContent =
            `1\n${formatTime(captionStart)} --> ${formatTime(captionEnd)}\n${wrappedText}\n\n`;
        fs.writeFileSync(srtFilePath, srtContent, "utf-8");
        console.log(`📝 Subtitle file created at: ${srtFilePath}`);

        const fullInputPath = path.resolve(process.cwd(), inputPath).replace(/\\/g, "/");

        // Escape colons in the SRT file path (FFmpeg on Windows may require this)
        const safeSrtPath = srtFilePath.replace(/:/g, "\\:");

        return new Promise((resolve, reject) => {
            ffmpeg(fullInputPath)
                .setStartTime(gifStart)
                .setDuration(gifDuration)
                .output(outputPath)
                .outputOptions([
                    "-vf",
                    // Use subtitles filter without the enable clause
                    `subtitles='${safeSrtPath}':force_style='Fontname=${fontOptions.fontName},Fontsize=${fontSize},PrimaryColour=&H00${fontColor}'`,
                    "-s", `${width}x${height}`,
                    "-r", "15"
                ])
                .on("end", () => {
                    console.log(`✅ GIF created: ${outputPath}`);
                    fs.unlinkSync(srtFilePath); // Clean up temporary SRT file
                    gifPaths.push(outputPath);
                    processSegment(index + 1).then(resolve).catch(reject); // Continue processing
                })
                .on("error", (err) => reject(new Error(`FFmpeg error: ${err.message}`)))
                .run();
        });
    };

    return processSegment(0); // Start processing segments
};






