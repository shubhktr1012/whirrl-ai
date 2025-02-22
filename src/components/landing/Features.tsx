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
    <section id="features" className="py-20 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title & Description */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Transform your videos into engaging GIFs in just a few steps
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 hover:border-[#9F8B6C] transition-colors rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 duration-300">
                {/* Icon */}
                <feature.icon className="w-10 h-10 text-[#9F8B6C] dark:text-[#9F8B6C] mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
