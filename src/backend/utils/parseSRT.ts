import fs from "fs";


type SubtitleSegment = {
  start: number; // in seconds
  end: number; // in seconds
  text: string;
};

// Function to parse .srt file and extract speech segments
export const parseSRT = (srtPath: string): SubtitleSegment[] => {
    console.log("Parsing SRT file at:", srtPath);
    const srtContent = fs.readFileSync(srtPath, "utf8");
    console.log("SRT Content:\n", srtContent); // Log raw content
    const segments: SubtitleSegment[] = [];
  
    const srtRegex = /(\d+)\s*\n(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*\n([\s\S]+?)(?=\n\d+\s*\n|\n*$)/g;
      
    let match;
    while ((match = srtRegex.exec(srtContent)) !== null) {
        console.log("Matched Segment:", match); // Debug extracted data
      const start =
        parseInt(match[2]) * 3600 + // hours to seconds
        parseInt(match[3]) * 60 + // minutes to seconds
        parseInt(match[4]) + // seconds
        parseInt(match[5]) / 1000; // milliseconds to seconds
  
      const end =
        parseInt(match[6]) * 3600 +
        parseInt(match[7]) * 60 +
        parseInt(match[8]) +
        parseInt(match[9]) / 1000;
  
      const text = match[10].replace(/\r/g, "").trim(); // Clean text
  
      segments.push({ start, end, text });
    }
    return segments;
  };

export const extractSpeechSegments = (srtPath: string, minDuration = 3): SubtitleSegment[] => {
    const segments = parseSRT(srtPath);

    return segments.filter(segment => (segment.end - segment.start) >= minDuration);
};

