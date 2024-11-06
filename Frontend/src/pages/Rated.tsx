import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

interface Rating {
  userId: string;
  productId: number;
  rating: number;
  date: Date;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  averageRating: number;
  totalRatings: number;
}

const Rated: React.FC = () => {
  const { theme, language } = useThemeLanguage();
  const [topProducts, setTopProducts] = useState<Product[]>([]);

  useEffect(() => {
    // In a real application, this would be an API call
    const fetchTopRatedProducts = async () => {
      try {
        // Simulated API response
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        
        // This would be replaced with actual API data
        const ratings: Rating[] = []; // Would come from your backend
        const products: Product[] = []; // Would come from your backend

        // Calculate average ratings for the current month
        const productRatings = new Map<number, { sum: number; count: number; users: Set<string> }>();

        ratings.forEach(rating => {
          const ratingDate = new Date(rating.date);
          if (ratingDate >= firstDayOfMonth) {
            if (!productRatings.has(rating.productId)) {
              productRatings.set(rating.productId, { sum: 0, count: 0, users: new Set() });
            }
            
            const productRating = productRatings.get(rating.productId)!;
            if (!productRating.users.has(rating.userId)) {
              productRating.sum += rating.rating;
              productRating.count += 1;
              productRating.users.add(rating.userId);
            }
          }
        });

        // Calculate average and sort products
        const ratedProducts = products
          .map(product => {
            const ratings = productRatings.get(product.id);
            return {
              ...product,
              averageRating: ratings ? ratings.sum / ratings.count : 0,
              totalRatings: ratings ? ratings.count : 0,
            };
          })
          .filter(product => product.totalRatings > 0)
          .sort((a, b) => b.averageRating - a.averageRating)
          .slice(0, 10);

        setTopProducts(ratedProducts);
      } catch (error) {
        console.error('Error fetching top rated products:', error);
      }
    };

    fetchTopRatedProducts();
  }, []);

  return (
    <section className={`py-12 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {language === 'en' ? 'Top Rated Products' : 'Productos Mejor Calificados'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {topProducts.map((product) => (
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
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(product.averageRating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                    />
                  ))}
                  <span className="ml-2">
                    ({product.totalRatings} {language === 'en' ? 'reviews' : 'reseñas'})
                  </span>
                </div>
                <p className="text-lg font-bold mb-4">${product.price}</p>
                <Link
                  to={`/product/${product.id}`}
                  className={`block text-center py-2 px-4 rounded ${
                    theme === 'dark'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white transition duration-200`}
                >
                  {language === 'en' ? 'View Details' : 'Ver Detalles'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Rated;