import { motion } from "framer-motion";

const mockGIFs = [
  "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
  "https://media.giphy.com/media/l0HlPjezGYjV9lnVC/giphy.gif",
  "https://media.giphy.com/media/26Ff5aFexn3kXQwXC/giphy.gif",
  "https://media.giphy.com/media/xT5LMqIRp4lM5xHuDe/giphy.gif",
];

export default function MockExamples() {
  return (
    <section id="examples" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            See It In Action
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Whirrl.ai creates stunning GIFs with perfectly timed captions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {mockGIFs.map((gif, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-900 p-2 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md overflow-hidden"
            >
              <img 
                src={gif} 
                alt={`Example GIF ${index + 1}`} 
                className="w-full h-48 object-cover rounded-md" 
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}