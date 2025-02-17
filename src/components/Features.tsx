import { Upload, Wand2, Download, Share2 } from 'lucide-react';

const features = [
  {
    icon: Upload,
    title: 'Upload Your Video',
    description: 'Drag & drop your video or paste a URL to get started',
  },
  {
    icon: Wand2,
    title: 'AI Magic',
    description:
      'Our AI detects speech and generates perfect GIFs automatically',
  },
  {
    icon: Download,
    title: 'Download GIFs',
    description: 'Get your GIFs with perfectly timed captions',
  },
  {
    icon: Share2,
    title: 'Share Anywhere',
    description:
      'Use your GIFs on social media, presentations, or anywhere else',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white border-y border-[#E8E6E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#2C2C2C] mb-4">
            How It Works
          </h2>
          <p className="text-[#6B6B6B]">
            Transform your videos into engaging GIFs in just a few steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-[#FAF9F6] p-6 border border-[#E8E6E1] hover:border-[#9F8B6C] transition-colors">
                <feature.icon className="w-10 h-10 text-[#9F8B6C] mb-4" />
                <h3 className="text-xl font-semibold text-[#2C2C2C] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#6B6B6B]">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
