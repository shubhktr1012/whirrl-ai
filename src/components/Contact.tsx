import { Send } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#2C2C2C] mb-4">Get in Touch</h2>
          <p className="text-[#6B6B6B]">Have questions? We'd love to hear from you.</p>
        </div>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#6B6B6B] mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8E6E1] focus:border-[#9F8B6C] focus:outline-none text-[#2C2C2C]"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#6B6B6B] mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8E6E1] focus:border-[#9F8B6C] focus:outline-none text-[#2C2C2C]"
              />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-[#6B6B6B] mb-2">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8E6E1] focus:border-[#9F8B6C] focus:outline-none text-[#2C2C2C]"
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="px-8 py-3 bg-[#9F8B6C] hover:bg-[#8A7555] text-white font-medium transition-colors inline-flex items-center space-x-2"
            >
              <span>Send Message</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </section>
  )};