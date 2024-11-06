import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Importando los íconos
import { useThemeLanguage } from '../contexts/ThemeLanguageContext'; // Importando contexto para el tema y lenguaje

const brands = ['Dell', 'Apple', 'HP', 'Lenovo', 'Asus', 'Alienware', 'MSI'];

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); //Extendido o no
  const { theme, language } = useThemeLanguage(); // Usando tema y lenguaje desde el contexto

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <aside className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'} ${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 p-4`}>
      <button 
        onClick={toggleSidebar} 
        className={`text-white p-2 mb-4 ${theme === 'dark' ? 'bg-green-400 hover:bg-green-600' : 'bg-gray-400 hover:bg-gray-500'} rounded focus:outline-none`}
      >
        {isOpen ? (
          <X className="w-6 h-6 transform transition-transform duration-300 ease-in-out" />
        ) : (
          <Menu className="w-6 h-6 transform transition-transform duration-300 ease-in-out" />
        )}
      </button>
      <h2 className={`text-lg font-semibold mb-4 ${isOpen ? 'block' : 'hidden'}`}>
        {language === 'en' ? 'Official companies' : 'Marcas oficiales'}
      </h2>
      <ul className="space-y-2">
        {brands.map((brand) => (
          <li key={brand}>
            <Link
              to={`/brand/${brand.toLowerCase()}`}
              className={`block p-2 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              {isOpen ? brand : brand[0]} {/* Muestra la letra inicial si está cerrado */}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
