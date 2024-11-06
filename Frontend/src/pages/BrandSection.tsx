import React from 'react';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const brands = [
  { name: 'Dell', image: '../public/img/Dell.png' },
  { name: 'Apple', image: '../public/img/Apple.png' },
  { name: 'Alienware', image: '../public/img/Alienware.png' },
  {name: 'Hp', image: '../public/img/Hp.png'},
  { name: 'ASUS', image: '../public/img/Asus.png' },
];

const BrandSection: React.FC = () => {
  const { theme } = useThemeLanguage();

  return (
    <section className={`py-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
      <h2 className={`text-2xl font-bold mb-4 text-center ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
        Descubre las mejores marcas
      </h2>
      <div className="flex justify-center space-x-8">
        {brands.map((brand) => (
          <div key={brand.name} className="flex flex-col items-center">
            <img src={brand.image} alt={brand.name} className="w-16 h-16 object-contain mb-2" />
            <span className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrandSection;
