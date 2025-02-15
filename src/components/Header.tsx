import React from 'react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-[#E8E6E1] z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-normal">
              <span className="font-light italic">whirrl</span>
              <span className="font-medium">.ai</span>
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a
              href="/"
              className="text-[#6B6B6B] hover:text-[#9F8B6C] transition-colors"
            >
              Home
            </a>
            <a
              href="#features"
              className="text-[#6B6B6B] hover:text-[#9F8B6C] transition-colors"
            >
              Features
            </a>
            <a
              href="#contact"
              className="text-[#6B6B6B] hover:text-[#9F8B6C] transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
