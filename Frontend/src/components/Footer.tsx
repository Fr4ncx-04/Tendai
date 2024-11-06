import React from 'react';
import { Link } from 'react-router-dom';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

const Footer: React.FC = () => {
  const { theme, language, toggleTheme, setLanguage } = useThemeLanguage();

  return (
    <footer className={`${theme==='dark' ? 'bg-gray-800 text-white p-8':'bg-gray-100 text-black p-8'}`}>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4 uppercase font-bold">Sobre Tendai</h3>
          <p>Es tu oportunidad de adquirir laptops de calidad a pagos accesibles para ti</p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4 uppercase font-bold">Proveedores oficiales</h3>
          <ul className="space-y-2">
            <li><Link to="/brand/dell" className="hover:text-gray-300">Dell</Link></li>
            <li><Link to="/brand/asus" className="hover:text-gray-300">Asus</Link></li>
            <li><Link to="/brand/hp" className="hover:text-gray-300">HP</Link></li>
            <li><Link to="/brand/lenovo" className="hover:text-gray-300">Lenovo</Link></li>
            <li><Link to="/brand/alienware" className="hover:text-gray-300">Alienware</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4 uppercase font-bold">Contactanos</h3>
          <p>Correo: support@tendai.com</p>
          <p>Telefono: (123) 456-7890</p>
        </div>
      </div>
      <div className="mt-8 text-center">
        <p>&copy; 2024 Tendai. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;