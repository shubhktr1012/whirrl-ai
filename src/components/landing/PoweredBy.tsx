import { SiOpenai, SiFfmpeg, SiReact, SiTailwindcss, SiNodedotjs } from 'react-icons/si';

const techStack = [
  { icon: SiOpenai, name: 'OpenAI Whisper' },
  { icon: SiFfmpeg, name: 'FFmpeg' },
  { icon: SiReact, name: 'React' },
  { icon: SiTailwindcss, name: 'Tailwind CSS' },
  { icon: SiNodedotjs, name: 'Node.js' },
];

export default function PoweredBy() {
  return (
    <section id="powered-by" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Powered By
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-12">
          Whirrl.ai is built using cutting-edge technologies to deliver the best GIF generation experience.
        </p>

        <div className="flex flex-wrap justify-center gap-10">
          {techStack.map((tech, index) => (
            <div key={index} className="flex flex-col items-center">
              <tech.icon className="w-12 h-12 text-[#9F8B6C] dark:text-[#9F8B6C] mb-2" />
              <span className="text-gray-900 dark:text-white font-medium">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}