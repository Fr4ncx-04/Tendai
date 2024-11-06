import React from 'react';
import { useParams } from 'react-router-dom';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

const BrandPage: React.FC = () => {
  const { brandName } = useParams<{ brandName: string }>();
  const { theme, language } = useThemeLanguage();

  return (
    <div className={`container mx-auto mt-10 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
      <h1 className="text-3xl font-bold mb-8">
        {language === 'en' ? `${brandName} Laptops` : `Portátiles ${brandName}`}
      </h1>
      <p>
        {language === 'en' 
          ? `Here you can find all laptops from ${brandName}.` 
          : `Aquí puedes encontrar todos los portátiles de ${brandName}.`}
      </p>
      {/* Add more content specific to the brand here */}
    </div>
  );
};

export default BrandPage;