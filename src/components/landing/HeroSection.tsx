// src/components/landing/HeroSection.tsx
const HeroSection = () => {
    return (
      <section className="h-screen flex flex-col justify-center items-center text-center">
        <h1 className="text-5xl font-bold">Whirrl.ai</h1>
        <p className="text-lg mt-4">Convert videos into dynamic GIFs with AI-powered customization.</p>
        <button className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg">
          Get Started
        </button>
      </section>
    );
  };
  
  export default HeroSection;
  