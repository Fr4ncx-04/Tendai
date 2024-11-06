import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

const Navbar: React.FC = () => {
  const { theme, language } = useThemeLanguage();

  const categories = [
    { key: '', en: 'Home', es: 'Inicio' },
    { key: 'Products', en: 'Products', es: 'Productos' },
    { key: 'Info', en: 'Info', es: 'Acerca de' },
    { key: 'Support', en: 'Support', es: 'Soporte' },
  ];

  const [isFixed, setIsFixed] = useState(false);

  const handleScroll = () => {
    const headerHeight = 64; // Ajusta esta altura al valor real de tu header
    setIsFixed(window.scrollY > headerHeight);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 z-50 ${
        isFixed ? 'top-0' : 'top-16'
      } ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} p-2 transition-all duration-300 rounded-lg`} style={{ top: '7rem' }}
    >
      <ul className="flex justify-between items-center">
        {categories.map((category) => (
          <li key={category.key}>
            <Link
              to={`/${category.key}`}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                theme === 'dark'
                  ? 'text-white hover:bg-gray-600'
                  : 'text-gray-700 hover:bg-gray-200'
              } transition duration-150 ease-in-out`}
            >
              {language === 'en' ? category.en : category.es}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;