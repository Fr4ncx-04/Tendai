import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import axios from 'axios';
import { Star } from 'lucide-react';

interface Laptop {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  category: string;
  averageRating: number | null; 
}

const Products: React.FC = () => {
  const { theme, language } = useThemeLanguage();
  const [sortOption, setSortOption] = useState<string>('all');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [allLaptops, setAllLaptops] = useState<Laptop[]>([]);
  const [filteredLaptops, setFilteredLaptops] = useState<Laptop[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/productos');
        setAllLaptops(response.data);
        setFilteredLaptops(response.data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let sortedArray = [...allLaptops];

    if (brandFilter !== 'all') {
      sortedArray = sortedArray.filter(laptop => laptop.brand.toLowerCase() === brandFilter);
    }
    if (categoryFilter !== 'all') {
      sortedArray = sortedArray.filter(laptop => laptop.category.toLowerCase() === categoryFilter);
    }

    switch (sortOption) {
      case 'price-high':
        sortedArray.sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        sortedArray.sort((a, b) => a.price - b.price);
        break;
    }

    setFilteredLaptops(sortedArray);
  }, [sortOption, brandFilter, categoryFilter, allLaptops]);

  // Función para manejar el regreso a la página anterior
  const handleBack = () => {
    navigate(-1); 
  };

  return (
    <div className={`container p-4 min-h-screen w-full ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <h1 className="text-3xl font-bold mb-8">
        {language === 'en' ? 'Our Products' : 'Nuestros Productos'}
      </h1>

      
      <button 
        onClick={handleBack} 
        className={`mb-8 px-4 py-2 rounded ${theme === 'dark' ? 'bg-teal-500 hover:bg-teal-600' : 'bg-teal-500 hover:bg-teal-600 text-white'}`}
      >
        {language === 'en' ? 'Go Back' : 'Regresar'}
      </button>

      <div className="flex flex-wrap gap-4 mb-8">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border`}
        >
          <option value="all">{language === 'en' ? 'Sort by' : 'Ordenar por'}</option>
          <option value="price-high">{language === 'en' ? 'Price: High to Low' : 'Precio: Mayor a Menor'}</option>
          <option value="price-low">{language === 'en' ? 'Price: Low to High' : 'Precio: Menor a Mayor'}</option>
        </select>

        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border`}
        >
          <option value="all">{language === 'en' ? 'All Brands' : 'Todas las Marcas'}</option>
          <option value="dell">Dell</option>
          <option value="apple">Apple</option>
          <option value="lenovo">Lenovo</option>
          <option value="hp">HP</option>
          <option value="asus">Asus</option>
          <option value="alienware">Alienware</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border`}
        >
          <option value="all">{language === 'en' ? 'All Categories' : 'Todas las Categorías'}</option>
          <option value="business">{language === 'en' ? 'Business' : 'Negocios'}</option>
          <option value="gaming">{language === 'en' ? 'Gaming' : 'Juegos'}</option>
          <option value="creative">{language === 'en' ? 'Creative' : 'Creatividad'}</option>
          <option value="ultrabook">{language === 'en' ? 'Ultrabook' : 'Ultraportátil'}</option>
          <option value="convertible">{language === 'en' ? 'Convertible' : 'Convertible'}</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredLaptops.map((laptop) => (
          <div
            key={laptop.id}
            className={`rounded-lg shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
          >
            <img src={laptop.image} alt={laptop.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold">{laptop.name}</h3>
              <p className="text-gray-500">{laptop.brand}</p>
              <p className="text-lg font-semibold">${laptop.price}</p>
              <div className="flex items-center">
                <Star className="text-yellow-500" size={20} />
                {[...Array(5)].map((_, index) => (
                  <span key={index} className={`text-yellow-500 ${index < Math.round(laptop.averageRating || 0) ? '★' : '☆'}`} />
                ))}
                <span className="ml-2 text-gray-500">({(laptop.averageRating || 0).toFixed(1)})</span>
              </div>
              <Link
                to={`/productdetails/${laptop.id}`}
                className={`inline-block mt-4 px-4 py-2 rounded ${theme === 'dark' ? 'bg-teal-500 hover:bg-teal-600' : 'bg-teal-500 hover:bg-teal-600 text-white'}`}
              >
                {language === 'en' ? 'View Details' : 'Ver Detalles'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
