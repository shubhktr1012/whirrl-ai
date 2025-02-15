import React from 'react';
import { Download, Share2 } from 'lucide-react';

const mockGifs = [
  'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
  'https://images.unsplash.com/photo-1682687220063-4742bd7fd538',
  'https://images.unsplash.com/photo-1682687220067-dced0c5fbb6c',
].map((url, index) => ({
  id: index + 1,
  url: `${url}?auto=format&fit=crop&w=500&q=60`,
  preview: `${url}?auto=format&fit=crop&w=500&q=60`,
}));

export default function GifGallery() {
  return (
    <div className="py-12 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#2C2C2C] mb-4">
            Your GIFs are ready!
          </h2>
          <button className="px-8 py-3 bg-[#9F8B6C] hover:bg-[#8A7555] text-white font-medium transition-colors inline-flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Download All</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockGifs.map((gif) => (
            <div key={gif.id} className="relative group">
              <div className="aspect-video bg-white border border-[#E8E6E1] overflow-hidden">
                <img
                  src={gif.url}
                  alt={`GIF ${gif.id}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                  <button className="p-2 bg-[#9F8B6C] hover:bg-[#8A7555] transition-colors">
                    <Download className="w-5 h-5 text-white" />
                  </button>
                  <button className="p-2 bg-[#9F8B6C] hover:bg-[#8A7555] transition-colors">
                    <Share2 className="w-5 h-5 text-white" />
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
