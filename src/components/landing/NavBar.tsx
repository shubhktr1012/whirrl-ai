import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/90 dark:bg-gray-900/90 shadow-md backdrop-blur-lg" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <button 
          onClick={() => scrollToSection('hero')} 
          className="text-2xl font-bold cursor-pointer text-gray-900 dark:text-white"
        >
          Whirrl<span className="text-[#9F8B6C]">.ai</span>
        </button>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          {["Home", "Features", "Examples", "Contact"].map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section.toLowerCase())}
              className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-[#9F8B6C] dark:hover:text-[#9F8B6C] transition"
            >
              {section}
            </button>
          ))}
        </div>

        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? (
            <Sun size={20} className="text-yellow-500" />
          ) : (
            <Moon size={20} className="text-gray-700" />
          )}
        </button>
      </div>
    </nav>
  );
}
