import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star } from 'lucide-react';
import { debounce } from 'lodash';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  category: string;
  averageRating: number | null;
}

const SearchPage: React.FC = () => {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  const navigate = useNavigate();  // Hook to navigate

  useEffect(() => {
    const fetchData = async () => {
      if (!query.trim()) {
        return <div>Please enter a search query.</div>;
      }
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/search?q=${encodeURIComponent(query)}`);
        console.log('Productos encontrados:', response.data.products);
        setResults(response.data.products);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setResults([]);  // Optionally reset results on error
      } finally {
        setLoading(false);
      }
    };

    const debouncedFetchData = debounce(fetchData, 500);
    debouncedFetchData();

    // Cleanup function to cancel debounced function on unmount
    return () => {
      debouncedFetchData.cancel();
    };
  }, [query]);

  // Handle back button click
  const handleGoBack = () => {
    navigate(-1);  // Go back to the previous page
  };

  return (
    <div className="container p-4 min-h-screen w-full">
      <h1 className="text-3xl font-bold mb-8">
        {`Search Results for: ${query}`}
      </h1>
      <button
        onClick={handleGoBack}  // Trigger go back action
        className="mb-4 px-4 py-2 rounded bg-gray-500 text-white"
      >
        Go Back
      </button>
      {loading && <div className="spinner">Loading...</div>}
      {!loading && results.length === 0 && <p>No results found.</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((product) => (
          <div
            key={product.id}
            className="rounded-lg shadow-lg overflow-hidden bg-white text-gray-800"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold">{product.name}</h3>
              <p className="text-gray-500">{product.brand}</p>
              <p className="text-lg font-semibold">${product.price}</p>
              <div className="flex items-center">
                <Star className="text-yellow-500" size={20} />
                {[...Array(5)].map((_, index) => (
                  <span key={index} className={`text-yellow-500 ${index < Math.round(product.averageRating || 0) ? '★' : '☆'}`} />
                ))}
                <span className="ml-2 text-gray-500">({(product.averageRating || 0).toFixed(1)})</span>
              </div>
              <Link
                to={`/productdetails/${product.id}`}
                className="inline-block mt-4 px-4 py-2 rounded bg-teal-500 hover:bg-teal-600 text-white"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
