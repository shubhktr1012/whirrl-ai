import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! (Placeholder functionality)");
  };

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-6">
          Get in Touch
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
          Have questions? Fill out the form and we'll get back to you.
        </p>
        
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 shadow-lg rounded-lg">
          <div className="mb-4">
            <label className="block text-gray-900 dark:text-white mb-2">Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              className="w-full p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:border-[#9F8B6C]" 
              required 
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-900 dark:text-white mb-2">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange}
              className="w-full p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:border-[#9F8B6C]" 
              required 
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-900 dark:text-white mb-2">Message</label>
            <textarea 
              name="message" 
              value={formData.message} 
              onChange={handleChange}
              rows={4}
              className="w-full p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:border-[#9F8B6C]"
              required
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#9F8B6C] text-white py-3 rounded hover:bg-[#836D52] transition-colors">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
