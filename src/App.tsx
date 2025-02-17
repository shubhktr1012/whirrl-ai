import Header from './components/Header';
import UploadSection from './components/UploadSection';
import Features from './components/Features';
import Contact from './components/Contact';

function App() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2C2C2C]">
      <Header />
      
      {/* Hero Section with Upload */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Transform Videos into
              <br />
              <span className="text-[#9F8B6C]">Engaging GIFs</span> Instantly
            </h1>
            <p className="text-xl text-[#6B6B6B] max-w-2xl mx-auto">
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
  );
}

export default App;