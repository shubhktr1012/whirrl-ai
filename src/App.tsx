import Navbar from './components/landing/NavBar';
import UploadSection from './components/generator/UploadSection';
import Features from './components/landing/Features';
import Contact from './components/landing/ContactForm';
import LandingPage from './pages/Home';
import { Routes, Route, useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  if (location.pathname.startsWith('/blob:')) {
    return null;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/generate"
        element={
          <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <Navbar />
            
            {/* Hero Section with Upload */}
            <section className="pt-32 pb-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h1 className="text-5xl md:text-6xl font-bold mb-6">
                    Transform Videos into
                    <br />
                    <span className="text-[#9F8B6C]">Engaging GIFs</span> Instantly
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Use AI-powered technology to convert your videos into captivating GIFs with perfect transcriptions.
                  </p>
                </div>
                
                {/* UploadSection now includes the GifGallery component */}
                <UploadSection />
              </div>
            </section>

            {/* Features Section */}
            <Features />

            {/* Contact Section */}
            <Contact />
          </div>
        }
      />
    </Routes>
  );
}

export default App;