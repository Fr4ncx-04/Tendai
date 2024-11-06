import React from 'react';
import { Link } from 'react-router-dom';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

const Footer: React.FC = () => {
  const { theme, language } = useThemeLanguage();

  const content = {
    en: {
      about: "About Tendai",
      description: "It's your opportunity to buy quality laptops with accessible payments.",
      officialSuppliers: "Official Suppliers",
      contactUs: "Contact Us",
      email: "Email: support@tendai.com",
      phone: "Phone: (123) 456-7890",
      rights: "All rights reserved.",
    },
    es: {
      about: "Sobre Tendai",
      description: "Es tu oportunidad de adquirir laptops de calidad a pagos accesibles para ti.",
      officialSuppliers: "Proveedores oficiales",
      contactUs: "Contáctanos",
      email: "Correo: support@tendai.com",
      phone: "Teléfono: (123) 456-7890",
      rights: "Todos los derechos reservados.",
    },
  };

  const text = content[language] || content.es;

  return (
    <footer className={`${theme === 'dark' ? 'bg-gray-800 text-white p-8' : 'bg-gray-100 text-black p-8'}`}>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4 uppercase font-bold">{text.about}</h3>
          <p>{text.description}</p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4 uppercase font-bold">{text.officialSuppliers}</h3>
          <ul className="space-y-2">
            <li><Link to="/brand/dell" className="hover:text-gray-300">Dell</Link></li>
            <li><Link to="/brand/asus" className="hover:text-gray-300">Asus</Link></li>
            <li><Link to="/brand/hp" className="hover:text-gray-300">HP</Link></li>
            <li><Link to="/brand/lenovo" className="hover:text-gray-300">Lenovo</Link></li>
            <li><Link to="/brand/alienware" className="hover:text-gray-300">Alienware</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4 uppercase font-bold">{text.contactUs}</h3>
          <p>{text.email}</p>
          <p>{text.phone}</p>
        </div>
      </div>
      <div className="mt-8 text-center">
        <p>&copy; 2024 Tendai. {text.rights}</p>
      </div>
    </footer>
  );
};

export default Footer;
