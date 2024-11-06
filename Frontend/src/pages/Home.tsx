import React, { useEffect, useRef } from 'react';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import Carousel from './Carousel';
import InfoSection from './InfoSection';
import BrandSection from './BrandSection';
import TestimonialsSection from './TestimonialSection';
import Rated from './Rated';
import BenefitsSection from './BenefitsSection';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const Home: React.FC = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { theme, language } = useThemeLanguage();

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      { threshold: 0.1 }
    );

    const products = document.querySelectorAll('.product');
    products.forEach((product) => {
      observerRef.current?.observe(product);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} min-h-screen`}>
      <div>
        <Carousel />
        <div className="text-3xl font-bold mb-8 uppercase text-center flex">
          <h1>
            {language === 'en' ? 'Welcome to Tendai' : 'Bienvenido a Tendai'}
          </h1>
        </div>
        <Rated />
        <InfoSection />
        <BenefitsSection />
        <BrandSection />
        <TestimonialsSection />
      </div>
    </div>
  );
};

export default Home;
