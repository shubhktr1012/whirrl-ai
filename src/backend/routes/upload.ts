import { Router } from 'express'; // Import Router from express to create routes
import { Request, Response } from 'express'; // Import Request and Response types from express
import { upload } from '../utils/upload'; // Import upload middleware for handling file uploads
import { convertToGIF, extractAudio, getVideoMetadata } from '../utils/ffmpeg'; // Import function to convert video to GIF and extract audio
import { transcribeAudio } from "../utils/transcribe"; // Import the transcribe function
import { parseSRT } from "../utils/parseSRT"; // Import parseSRT function
import fs from 'fs'; // Import file system module for file operations
import path from 'path'; // Import path module for handling file paths

const router = Router(); // Create a new router instance

// Define an interface for the timestamp structure
interface Timestamp {
  start: number;
  end: number;
}

// Define an interface for manual segments
interface ManualSegment {
  userStart: number;
  userEnd: number;
  speechStart: number;
  speechEnd: number;
  text: string;
}

// POST /api/upload
router.post('/upload', upload.single('video'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      console.warn('⚠️ No file uploaded');
      res.status(400).json({ error: 'No file uploaded' });
      return void 0;
    }

    // Allowed video MIME types
    const allowedMimeTypes = ["video/mp4", "video/quicktime", "video/x-matroska"];

    // Check if the uploaded file is a valid video format
    if (!req.file || !allowedMimeTypes.includes(req.file.mimetype)) {
      console.warn(`❌ Invalid file type: ${req.file?.mimetype || "none"}`);
      res.status(400).json({ error: "Invalid file format. Only MP4, MOV, and MKV are allowed." });
      return void 0;
    }

    console.log("Processing video:", req.file.path);

    //Code to ffmpeg.ts
    const audioPath = await extractAudio(req.file.path);
    console.log("Audio extraction complete:", audioPath);
    //Code back from ffmpeg.ts

    //Code to transcribe.ts
    const {txtPath, srtPath, transcriptLines} = await transcribeAudio(audioPath);
    console.log("SRT file saved at", srtPath);

    let speechSegments = parseSRT(srtPath);
    console.log("Extracted Speech Segments:", speechSegments);

    // ✅ Delete SRT file after parsing
    fs.unlink(srtPath, (err) => {
      if (err) console.warn(`⚠️ Failed to delete SRT file: ${srtPath}`, err);
      else console.log(`🗑️ Deleted SRT file: ${srtPath}`);
    });

    // Read user-selected timestamps (if provided)
    const timestamps = req.body.timestamps 
    ? typeof req.body.timestamps === "string"
      ? JSON.parse(req.body.timestamps)  // Ensure timestamps are properly parsed
      : req.body.timestamps
    : [];

    console.log("🕒 Using timestamps:", timestamps);

    // Validate timestamps (max 5 allowed)
    if (timestamps.length > 5) {
      res.status(400).json({ error: "You can select up to 5 timestamps only." });
      return void 0;
    }

    // Extract video metadata to validate timestamps
    const { duration: videoDuration } = await getVideoMetadata(req.file.path);

    // Ensure timestamps are valid
    for (const { start, end } of timestamps) {
      if (start < 0 || end <= start || end > videoDuration) {
        return void res.status(400).json({ 
          error: `Invalid timestamp: Start (${start}s) must be less than End (${end}s), and within the video duration (${videoDuration}s).`
        });
      }
    }

    // If timestamps are provided, map them into ManualSegment objects
    let selectedSegments: ManualSegment[] = [];
    if (timestamps.length > 0) {
      selectedSegments = timestamps.map(({ start: userStart, end: userEnd }: Timestamp) => {
        // Find the speech segment that falls within the user range
        const matched = speechSegments.find(seg =>
          seg.start >= userStart - 0.5 && seg.end <= userEnd + 0.5
        );
        if (!matched) {
          console.warn(`⚠️ No speech segment found for user timestamp ${userStart}-${userEnd}`);
          return null;
        }
        console.log(`✅ Matched segment for ${userStart}-${userEnd}:`, matched);
        return {
          userStart,
          userEnd,
          speechStart: matched.start,
          speechEnd: matched.end,
          text: matched.text
        };
      }).filter(Boolean) as ManualSegment[];
    } else if (selectedSegments.length === 0) {
      console.warn("⚠️ No valid timestamps found. Falling back to first 5 speech segments.");
      selectedSegments = speechSegments.slice(0, 5).map(seg => ({
        userStart: seg.start,
        userEnd: seg.end,
        speechStart: seg.start,
        speechEnd: seg.end,
        text: seg.text
      }));
    }    

    const transcriptText = transcriptLines.join(" ");
    console.log("Transcription Text:", transcriptText);

    // 1. Get font/style options from the frontend
    const fontFamily = req.body.fontFamily ? req.body.fontFamily.toLowerCase() : 'arial';
    let fontSize = req.body.fontSize ? parseInt(req.body.fontSize) : 24; // Convert only numbers
    if (isNaN(fontSize) || fontSize <= 0) {
      console.warn('⚠️ Invalid font size received. Using default (24px).');
      fontSize = 24;
    }

    let fontColor = req.body.fontColor ? req.body.fontColor.replace("#", "") : "FFFFFF"; // Keep as a string
    if (!/^[0-9A-Fa-f]{6}$/.test(fontColor)) {
      console.warn('⚠️ Invalid font color received. Using default (#FFFFFF).');
      fontColor = "FFFFFF";
    }

    console.log('🎨 Font Options:', { fontFamily, fontSize, fontColor });
    console.log("Received font options:", req.body); // can remove after development
    // 4. Generate GIF with captions
    const gifOutputDir = path.resolve(process.cwd(), "gifs").replace(/\\/g, "/");
    if (!fs.existsSync(gifOutputDir)) 
      fs.mkdirSync(gifOutputDir, { recursive: true });
    
    /* // 3. TODO: Replace with actual transcription later (Phase 3)
    const mockCaptions = "This is a sample caption. Replace with Whisper transcription."; // Placeholder for captions */
    
    // Extract video metadata including width, height
    const { width, height } = await getVideoMetadata(req.file.path);  // Remove duration since we already have it

    console.log("📝 Received JSON Body:", req.body);
    console.log("🎯 Segments being passed to GIF function:", selectedSegments);

    const gifPaths = await convertToGIF( 
      req.file.path,  // Path to uploaded video
      gifOutputDir,   // Output directory for the GIFs
      selectedSegments, // Use selectedSegments instead of segmentsToUse
      { 
        fontName: fontFamily, 
        fontSize: Math.round(height * 0.05),  // 5% of video height
        fontColor, 
      }
    );

    res.status(200).json({ // Respond with success message and GIF URL
      message: 'GIF generated with captions!', // Success message
      gifUrls: gifPaths.map((p) => `/gifs/${path.basename(p)}`), // URL to download the GIF
    });

    const deleteFile = (filePath: string) => {
      fs.unlink(filePath, (err) => {
        if (err) console.warn(`⚠️ Failed to delete ${filePath}`, err);
        else console.log(`🗑️ Deleted: ${filePath}`);
      });
    };
    
    // ✅ Delete audio file after transcription
    if (fs.existsSync(audioPath)) {
      deleteFile(audioPath);
    } else {
      console.warn(`⚠️ Audio file not found: ${audioPath}, skipping deletion.`);
    }
    
    
    // ✅ Delete uploaded video after processing
    deleteFile(req.file.path);
    
    // (GIFs will be deleted later using a background cleanup job)

    const logMemoryUsage = (step: string) => {
      const used = process.memoryUsage();
      console.log(`📊 Memory Usage after ${step}:`);
      console.log(`   RSS: ${(used.rss / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   Heap Used: ${(used.heapUsed / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   External: ${(used.external / 1024 / 1024).toFixed(2)} MB`);
    };
    
    // Example Usage: Add this after key steps
    logMemoryUsage("Audio Extraction"); // After extracting audio
    logMemoryUsage("Transcription");    // After transcribing audio
    logMemoryUsage("GIF Generation");   // After generating GIFs

  } catch (error) { // Catch any errors that occur
    console.error('🚨 Upload Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
    });
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

export default router; // Export the router for use in other parts of the application
