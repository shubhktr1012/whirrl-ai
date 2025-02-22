import { useState } from "react";
import { Upload } from "lucide-react";
import { uploadVideo } from '../../services/api'; // Fix the import path

const MAX_TIMESTAMPS = 5;

export default function UploadSection() {
  // State variables
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [videoFileName, setVideoFileName] = useState('');
  const [videoThumbnail, setVideoThumbnail] = useState('');
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = async (selectedFile: File) => {
    if(!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setFile(selectedFile);
    setVideoFileName(selectedFile.name);

    const videoURL = URL.createObjectURL(selectedFile);
    console.log('Video URL:', videoURL);
    setVideoThumbnail(videoURL);

    const videoElement = document.createElement("video");
    videoElement.src = videoURL;

    videoElement.onloadedmetadata = () => {
      console.log("✅ Video metadata loaded. Duration:", videoElement.duration);
      setVideoDuration(videoElement.duration);
    };
    
    videoElement.onerror = () => {
      console.error("❌ Error loading video from URL:", videoURL);
    };

    try {
      const response = await uploadVideo(selectedFile, (progress) => {
        setUploadProgress(progress);
      });
      
      console.log('Upload successful:', response);
      // You can now use response.gifPath to display the generated GIF
      // and response.segments for the transcription data
      
    } catch (error: any) {
      console.error('Upload failed:', error);
      // Show error to user
      alert(error.message || 'Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles[0]); //Process first file
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Upload Box */}
      {!file ? (
        <label
          className={`block p-8 border-2 border-dashed rounded-lg transition-colors cursor-pointer
            ${
              isDragging
                ? "border-[#8A7555] bg-gray-50 dark:bg-gray-800"
                : "border-[#9F8B6C] bg-white dark:bg-gray-900"
            }
            hover:border-[#8A7555] dark:hover:border-[#8A7555]`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <Upload className="w-12 h-12 text-[#9F8B6C]" />
            <span className="text-lg text-gray-600 dark:text-gray-300">
              {isDragging ? "Drop the file here!" : "Drag & drop a video or click to browse"}
            </span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              accept="video/*"
            />
          </div>
        </label>
      ) : (
        <div className="p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">{videoFileName}</span>
          {videoThumbnail && (
        <img 
            src={videoThumbnail} 
            alt="Video Thumbnail"
            className="w-16 h-16 rounded-md object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              console.error("Error loading thumbnail:", e);
              setVideoThumbnail(""); // Reset if failed
            }}
          />
        )}
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-[#9F8B6C] h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}
