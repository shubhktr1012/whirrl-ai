import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/landing/NavBar';
import Features from '../components/landing/Features';
import ContactForm from '../components/landing/ContactForm';
import PoweredBy from '../components/landing/PoweredBy';
import MockExamples from '../components/landing/MockExamples';

const Home = () => {
  return (
    <div className="relative w-full min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      
      {/* Hero Section */}
      <section id="hero" className="flex flex-col items-center justify-center min-h-screen text-center pt-16">
        <motion.h1
          className="text-6xl font-bold tracking-wide text-gray-900 dark:text-white drop-shadow-lg"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Whirrl<span className="text-[#9F8B6C]">.ai</span>
        </motion.h1>
        <motion.p
          className="mt-4 text-xl text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Transform your videos into stunning GIFs effortlessly.
        </motion.p>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Link
            to="/generate"
            className="mt-6 px-6 py-3 text-lg font-semibold text-white bg-[#9F8B6C] rounded-lg hover:bg-[#836D52] transition-all duration-300 shadow-lg"
          >
            Get Started
          </Link>
        </motion.div>
      </section>

      {/* Examples Section */}
      <section id="examples" className="py-20 bg-gray-50 dark:bg-gray-800">
        <MockExamples />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <Features />
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800">
        <ContactForm />
      </section>

      {/* PoweredBy Section */}
      <section id="powered-by" className="py-20 bg-white dark:bg-gray-900">
        <PoweredBy />
      </section>
    </div>
  );
};

export default Home;
