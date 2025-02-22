import { Router } from 'express'; // Import Router from express to create routes
import { Request, Response } from 'express'; // Import Request and Response types from express
import { upload } from '../utils/upload.js'; // Import upload middleware for handling file uploads
import { convertToGIF, extractAudio, getVideoMetadata } from '../utils/ffmpeg.js'; // Import function to convert video to GIF and extract audio
import { transcribeAudio } from "../utils/transcribe.js"; // Import the transcribe function
import { parseSRT } from "../utils/parseSRT.js"; // Import parseSRT function
import fs from 'fs'; // Import file system module for file operations
import path from 'path'; // Import path module for handling file paths

const router = Router(); // Create a new router instance

// Define an interface for the timestamp structure
interface Timestamp {
  start: number;
  end: number;
}

// Define an interface for speech segments
interface SpeechSegment {
  start: number;
  end: number;
  text: string;
}

// Define an interface for manual segments
interface ManualSegment {
  userStart: number;
  userEnd: number;
  speechStart: number;
  speechEnd: number;
  text: string;
}

// Allowed video MIME types
const ALLOWED_FORMATS = [
  "video/mp4",
  "video/x-m4v",
  "video/quicktime",
  "video/mov",
  "video/x-matroska"
];

// POST /api/upload
router.post('/upload', upload.single('video'), async (req: Request, res: Response) => {
  console.log('\n=== Processing Upload Request ===');
  console.log('Request Headers:', JSON.stringify(req.headers, null, 2));
  
  // Set CORS headers for the actual response
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin, X-Requested-With');
  
  try {
    if (!req.file) {
      console.warn('⚠️ No file uploaded');
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Validate file type
    const mimeType = req.file.mimetype.toLowerCase();
    if (!ALLOWED_FORMATS.includes(mimeType)) {
      console.warn(`⚠️ Invalid file type: ${mimeType}`);
      res.status(400).json({ 
        error: `Invalid file type. Allowed formats: ${ALLOWED_FORMATS.join(', ')}`,
        receivedType: mimeType
      });
      const deleteFile = (filePath: string) => {
        fs.unlink(filePath, (err) => {
          if (err) console.warn(`⚠️ Failed to delete ${filePath}`, err);
          else console.log(`🗑️ Deleted: ${filePath}`);
        });
      };
      deleteFile(req.file.path);
      return;
    }

    console.log(`✅ File type validated: ${mimeType}`);
    console.log("🎥 Processing video:", req.file.path);

    try {
      //Code to ffmpeg.ts
      const audioPath = await extractAudio(req.file.path);
      console.log("🎵 Audio extraction complete:", audioPath);
      
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

      /// Ensure timestamps are properly formatted and safe to use
      let selectedSegments: ManualSegment[] = timestamps.length > 0
      ? timestamps.map(({ start, end, useCustomText, customText }: { 
          start: string; 
          end: string; 
          useCustomText: boolean; 
          customText: string; 
        }) => ({
          userStart: Number(start),
          userEnd: Number(end),
          speechStart: Number(start),  
          speechEnd: Number(end),
          text: useCustomText ? customText : "",  // If useCustomText is enabled, use it
        }))
      : speechSegments.slice(0, 5).map(seg => ({
          userStart: seg.start,
          userEnd: seg.end,
          speechStart: seg.start,
          speechEnd: seg.end,
          text: seg.text,
        }));

      console.log("🎯 Final Segments for GIFs:", selectedSegments);

      const transcriptText = transcriptLines.join(" ");
      console.log("Transcription Text:", transcriptText);

      // 1. Get font/style options from the frontend
      const fontFamily = req.body.fontFamily ? req.body.fontFamily.toLowerCase() : 'arial';
      let fontSize = req.body.fontSize ? parseInt(req.body.fontSize) : 24; // Convert only numbers
      if (isNaN(fontSize) || fontSize <= 0) {
        console.warn('⚠️ Invalid font size received. Using default (24px).');
        fontSize = 24; // Fallback to default if invalid
      } else {
        fontSize = Math.max(fontSize, 24); // Ensure font size is at least 24
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
      // const { width, height } = await getVideoMetadata(req.file.path);  // Remove duration since we already have it

      console.log("📝 Received JSON Body:", req.body);
      console.log("🎯 Segments being passed to GIF function:", selectedSegments);

      const gifPaths = await convertToGIF( 
        req.file.path,  // Path to uploaded video
        gifOutputDir,   // Output directory for the GIFs
        selectedSegments, // Use updated segments with custom text
        { 
          fontName: fontFamily, 
          fontSize: fontSize,  // Updated to use fontSize variable
          fontColor, 
        }
      );

      // Clean up files
      if (fs.existsSync(audioPath)) {
        const deleteFile = (filePath: string) => {
          fs.unlink(filePath, (err) => {
            if (err) console.warn(`⚠️ Failed to delete ${filePath}`, err);
            else console.log(`🗑️ Deleted: ${filePath}`);
          });
        };
        deleteFile(audioPath);
      }
      const deleteFile = (filePath: string) => {
        fs.unlink(filePath, (err) => {
          if (err) console.warn(`⚠️ Failed to delete ${filePath}`, err);
          else console.log(`🗑️ Deleted: ${filePath}`);
        });
      };
      deleteFile(req.file.path);

      // Log memory usage
      const logMemoryUsage = (step: string) => {
        const used = process.memoryUsage();
        console.log(`📊 Memory Usage after ${step}:`);
        console.log(`   RSS: ${(used.rss / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Heap Used: ${(used.heapUsed / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   External: ${(used.external / 1024 / 1024).toFixed(2)} MB`);
      };
      logMemoryUsage("Audio Extraction");
      logMemoryUsage("Transcription");
      logMemoryUsage("GIF Generation");

      // Send the response with just the filenames
      res.json({
        message: "GIFs generated successfully!",
        gifUrls: gifPaths.map(p => path.basename(p))
      });
    } catch (error) { // Catch any errors that occur
      console.error('🚨 Upload Error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
      });
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
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
