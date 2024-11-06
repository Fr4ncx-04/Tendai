import React from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import laptops from './Laptops'; // Puedes mantener la lista original o usar la del código 2

const BrandProducts: React.FC = () => {
  const { brand } = useParams<{ brand: string }>(); // Fusiona `brand` de código 2 con `brandName` de código 1
  const brandKey = brand?.toLowerCase();
  const brandLaptops = laptops.filter(laptop => laptop.specs.marca.toLowerCase() === brandKey); // Filtrar la marca
  const navigate = useNavigate();
  const { theme, language } = useThemeLanguage();

  const handleViewDetails = (productId: number) => {
    navigate(`/product-details/${productId}`);
  };

  return (
    <div className={`container mx-auto mt-10 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-3xl font-bold mb-8">
        {language === 'en' ? `${brand} Laptops` : `Portátiles ${brand}`}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {brandLaptops.map((laptop) => (
          <div key={laptop.id} className={`rounded-lg shadow-md overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <img src={laptop.image} alt={laptop.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{laptop.name}</h2>
              <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>${laptop.price}</p>
              <button
                onClick={() => handleViewDetails(laptop.id)}
                className={`inline-block px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                {language === 'en' ? 'View Details' : 'Ver Detalles'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandProducts;
