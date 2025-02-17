import { useState } from 'react';
import { Upload, ArrowRight } from 'lucide-react';
import GifGallery from './GifGallery';

export default function UploadSection() {
  // Existing States
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [gifUrls, setGifUrls] = useState<string[]>([]);
  const [previewEnabled, setPreviewEnabled] = useState(false); // Controls preview button
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState('#FFFFFF');

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("video", file);
    formData.append("fontFamily", fontFamily);
    formData.append("fontSize", fontSize.toString());
    formData.append("fontColor", fontColor);

    // Create AbortController for timeout
    const controller = new AbortController();
    const TIMEOUT_DURATION = 300000; // 5 minutes in milliseconds
    
    try {
      console.log("📤 Preparing upload request:", {
        fileType: file.type,
        fileSize: file.size,
        fileName: file.name
      });

      // Set initial progress
      setUploadProgress(10);

      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          controller.abort();
          reject(new Error('Request timed out after 5 minutes'));
        }, TIMEOUT_DURATION);
      });

      // Create fetch promise
      const fetchPromise = fetch("http://localhost:5000/api/upload", {
        method: "POST",
        mode: 'cors',
        credentials: 'omit',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      // Race between fetch and timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      console.log("📥 Response received:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      // Update progress after receiving response
      setUploadProgress(50);

      if (!response.ok) {
        let errorMessage = `HTTP Error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error("Failed to parse error response:", e);
        }
        throw new Error(errorMessage);
      }

      // Update progress while processing response
      setUploadProgress(75);

      const data = await response.json();
      console.log("📥 Response data:", data);
      
      if (!data.gifUrls || !Array.isArray(data.gifUrls)) {
        throw new Error('Invalid response format: missing GIF URLs');
      }

      setUploadProgress(90);

      console.log("📥 API Response Received:", data);
      if (data.gifUrls) {
        console.log("✅ GIF URLs from backend:", data.gifUrls);
        const generatedUrls = data.gifUrls.map((url: string) => {
          const fullUrl = `http://localhost:5000/gifs/${url}`;
          console.log("🔗 Generated GIF URL:", fullUrl);
          return fullUrl;
        });
        
        // Verify GIF URLs are accessible with a shorter timeout
        const GIF_VERIFY_TIMEOUT = 10000; // 10 seconds for GIF verification
        try {
          await Promise.all(generatedUrls.map(async (url: string) => {
            const verifyController = new AbortController();
            const timeoutId = setTimeout(() => verifyController.abort(), GIF_VERIFY_TIMEOUT);
            
            try {
              const response = await fetch(url, { 
                method: 'HEAD',
                signal: verifyController.signal 
              });
              if (!response.ok) {
                console.error(`❌ Failed to access GIF at ${url}:`, response.status);
              } else {
                console.log(`✅ GIF accessible at ${url}`);
              }
            } finally {
              clearTimeout(timeoutId);
            }
          }));
        } catch (error) {
          console.error("❌ Error verifying GIF URLs:", error);
          // Don't throw here, just log the error and continue
        }
        
        setGifUrls(generatedUrls);
      } else {
        console.error("⚠️ No GIF URLs found in API response:", data);
      }
      
      setPreviewEnabled(true);
      setUploadProgress(100);

    } catch (error) {
      console.error("🚨 Upload Error:", error);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          alert("Upload timed out. Please try again.");
        } else {
          console.log("🛑 Error Message:", error.message);
          alert("Upload failed: " + error.message);
        }
      } else {
        console.log("❌ Unknown Error:", error);
        alert("Upload failed: An unknown error occurred");
      }

      setGifUrls([]);
      setPreviewEnabled(false);
    } finally {
      // Only reset progress if there was an error
      if (uploadProgress !== 100) {
        setUploadProgress(0);
      }
      setIsUploading(false);
    }
  };

  const handlePreviewClick = () => {
    if (gifUrls.length > 0) {
      document.getElementById("gif-gallery")?.scrollIntoView({ behavior: "smooth" });
    }
  };

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

      {/* Upload Section */}
      <label className="block p-8 border-2 border-dashed border-[#9F8B6C] rounded-none hover:border-[#8A7555] transition-colors cursor-pointer bg-white">
        <div className="flex flex-col items-center space-y-4">
          <Upload className="w-12 h-12 text-[#9F8B6C]" />
          <span className="text-lg text-[#6B6B6B]">Drop your video here or click to browse</span>
          <input
            type="file"
            className="hidden"
            onChange={async (e) => {
              if (e.target.files?.[0]) await handleFileUpload(e.target.files[0]);
            }}
            accept="video/*"
          />
        </div>
      </label>

      {/* Progress Bar */}
      {isUploading && (
        <div className="w-full bg-[#E8E6E1] h-2 rounded">
          <div className="h-full bg-[#9F8B6C] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
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

      {/* Preview Button */}
      <button
        className={`px-6 py-3 rounded text-white font-medium transition-colors ${
          previewEnabled ? 'bg-[#9F8B6C] hover:bg-[#8A7555]' : 'bg-gray-400 cursor-not-allowed'
        }`}
        disabled={!previewEnabled}
        onClick={handlePreviewClick}
      >
        Preview GIFs
      </button>

      {/* GIF Gallery Component - Only show when GIFs are available */}
      {gifUrls.length > 0 && <GifGallery gifUrls={gifUrls} />}

    </div>
  );
}
