import { Download } from 'lucide-react';

interface GifGalleryProps {
  gifUrls: string[];
}

export default function GifGallery({ gifUrls }: GifGalleryProps) {
  if (gifUrls.length === 0) {
    return null;  // Don't render anything if no GIFs
  }

  const handleDownload = (url: string) => {
    const link = document.createElement("a");
    link.href = `http://localhost:5000/gifs/${url}`;
    link.download = url.split('/').pop() || "generated.gif";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="gif-gallery" className="py-12 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#2C2C2C] mb-4">
            Your GIFs are ready!
          </h2>
          <button 
            onClick={() => gifUrls.forEach(handleDownload)}
            className="px-8 py-3 bg-[#9F8B6C] hover:bg-[#8A7555] text-white font-medium transition-colors inline-flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Download All</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gifUrls.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-video bg-white border border-[#E8E6E1] overflow-hidden">
                <img
                  src={`${url}`}
                  alt={`GIF ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                  <button 
                    onClick={() => handleDownload(url)}
                    className="p-2 bg-[#9F8B6C] hover:bg-[#8A7555] transition-colors"
                  >
                    <Download className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
