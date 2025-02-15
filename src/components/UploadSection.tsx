import React, { useState } from 'react';
import { Upload, ArrowRight } from 'lucide-react';

export default function UploadSection() {
  //Existing States
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState('#FFFFFF');

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("video", file);
    formData.append("fontFamily", fontFamily); // Use state value
    formData.append("fontSize", fontSize.toString()); // Ensure it's sent as a string
    formData.append("fontColor", fontColor);


    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      alert(`GIF Created! Download at: ${data.gifUrl}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert('Upload failed: ' + errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0); // Reset Progress
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-none border border-[#E8E6E1]">
        <div>
          <label className="block text-sm text-[#6B6B6B] mb-2">Font Family</label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="w-full p-2 border border-[#E8E6E1] rounded-none focus:border-[#9F8B6C] focus:outline-none"
          >
            <option value="Arial">Arial</option>
            <option value="SpaceMono">Space Mono</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-[#6B6B6B] mb-2">Font Size</label>
          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full p-2 border border-[#E8E6E1] rounded-none focus:border-[#9F8B6C] focus:outline-none"
            min="12"
            max="48"
          />
        </div>
        
        <div>
          <label className="block text-sm text-[#6B6B6B] mb-2">Font Color</label>
          <input
            type="color"
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
            className="w-full h-10 cursor-pointer border border-[#E8E6E1]"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="block p-8 border-2 border-dashed border-[#9F8B6C] rounded-none hover:border-[#8A7555] transition-colors cursor-pointer bg-white">
          <div className="flex flex-col items-center space-y-4">
            <Upload className="w-12 h-12 text-[#9F8B6C]" />
            <span className="text-lg text-[#6B6B6B]">
              Drop your video here or click to browse
            </span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              accept="video/*"
            />
          </div>
        </label>

        {isUploading && (
          <div className="w-full bg-[#E8E6E1] h-2">
            <div
              className="h-full bg-[#9F8B6C] transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Or paste a video URL here..."
              className="w-full px-4 py-3 bg-white border border-[#E8E6E1] focus:border-[#9F8B6C] focus:outline-none text-[#2C2C2C] placeholder-[#6B6B6B]"
            />
          </div>
          <button className="px-6 py-3 bg-[#9F8B6C] hover:bg-[#8A7555] text-white font-medium transition-colors flex items-center space-x-2">
            <span>Generate</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
