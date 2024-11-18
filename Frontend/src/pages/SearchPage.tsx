import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Star, Search, ArrowLeft } from 'lucide-react';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { debounce } from 'lodash';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  category: string;
  averageRating: number | null;
  description?: string;
}

const SearchPage: React.FC = () => {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    brand: 'all',
    category: 'all',
    priceRange: 'all',
    sortBy: 'relevance',
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, language } = useThemeLanguage();
  const query = new URLSearchParams(location.search).get('q') || '';

  const brands = ['Dell', 'HP', 'Lenovo', 'Apple', 'Asus', 'Alienware'];
  const categories = ['Gaming', 'Business', 'Student', 'Professional', 'Creative'];
  const priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under $500', value: '0-500' },
    { label: '$500 - $1000', value: '500-1000' },
    { label: '$1000 - $2000', value: '1000-2000' },
    { label: 'Over $2000', value: '2000+' },
  ];

  useEffect(() => {
    setSearchTerm(query);
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = debounce(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        q: searchQuery,
        brand: filters.brand,
        category: filters.category,
        priceRange: filters.priceRange,
        sortBy: filters.sortBy,
      }).toString();

      const response = await fetch(
        `http://localhost:3001/search?${queryParams}`
      );
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      let filteredResults = data.products;

      // Apply client-side sorting if needed
      switch (filters.sortBy) {
        case 'price-low':
          filteredResults.sort((a: Product, b: Product) => a.price - b.price);
          break;
        case 'price-high':
          filteredResults.sort((a: Product, b: Product) => b.price - a.price);
          break;
        case 'rating':
          filteredResults.sort((a: Product, b: Product) => 
            (b.averageRating || 0) - (a.averageRating || 0)
          );
          break;
      }

      setResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    performSearch(searchTerm);
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
    }`}>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-500 hover:text-blue-600"
        >
          <ArrowLeft className="mr-2" />
          {language === 'en' ? 'Back' : 'Volver'}
        </button>
      </div>

      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'en' ? 'Search laptops...' : 'Buscar laptops...'}
              className={`w-full p-3 pl-10 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-300'
              }`}
            />
            <Search className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {language === 'en' ? 'Search' : 'Buscar'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select
          name="brand"
          value={filters.brand}
          onChange={handleFilterChange}
          className={`p-2 rounded ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } border`}
        >
          <option value="all">{language === 'en' ? 'All Brands' : 'Todas las Marcas'}</option>
          {brands.map(brand => (
            <option key={brand} value={brand.toLowerCase()}>{brand}</option>
          ))}
        </select>

        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className={`p-2 rounded ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } border`}
        >
          <option value="all">{language === 'en' ? 'All Categories' : 'Todas las Categorías'}</option>
          {categories.map(category => (
            <option key={category} value={category.toLowerCase()}>{category}</option>
          ))}
        </select>

        <select
          name="priceRange"
          value={filters.priceRange}
          onChange={handleFilterChange}
          className={`p-2 rounded ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } border`}
        >
          {priceRanges.map(range => (
            <option key={range.value} value={range.value}>
              {language === 'en' ? range.label : range.label.replace('Under', 'Menos de').replace('Over', 'Más de')}
            </option>
          ))}
        </select>

        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleFilterChange}
          className={`p-2 rounded ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } border`}
        >
          <option value="relevance">{language === 'en' ? 'Relevance' : 'Relevancia'}</option>
          <option value="price-low">{language === 'en' ? 'Price: Low to High' : 'Precio: Menor a Mayor'}</option>
          <option value="price-high">{language === 'en' ? 'Price: High to Low' : 'Precio: Mayor a Menor'}</option>
          <option value="rating">{language === 'en' ? 'Highest Rated' : 'Mejor Valorados'}</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl">
            {language === 'en' 
              ? 'No products found. Try different search terms or filters.' 
              : 'No se encontraron productos. Intenta con otros términos o filtros.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((product) => (
            <div
              key={product.id}
              className={`rounded-lg shadow-lg overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">
                  {product.name}
                </h3>
                <p className="text-gray-500">{product.brand}</p>
                <p className="text-lg font-bold">${product.price}</p>
                {product.averageRating && (
                  <div className="flex items-center mt-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <p className="ml-1">{product.averageRating.toFixed(1)}</p>
                  </div>
                )}
                <Link
                  to={`/product/${product.id}`}
                  className="block mt-4 text-blue-500 hover:underline"
                >
                  {language === 'en' ? 'View Product' : 'Ver Producto'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
