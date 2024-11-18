import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { Star, Cpu, Battery, Monitor, Award } from 'lucide-react';
import Carousel from './Carousel';
import InfoSection from './InfoSection';
import BrandSection from './BrandSection';
import TestimonialsSection from './TestimonialSection';
import BenefitsSection from './BenefitsSection';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  category: string;
  averageRating: number | null;
}

const Home: React.FC = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { theme, language } = useThemeLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/productos');
        setProducts(response.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      { threshold: 0.1 }
    );

    const productElements = document.querySelectorAll('.product');
    productElements.forEach((product) => {
      observerRef.current?.observe(product);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [products]);

  const features = [
    {
      icon: <Cpu className="w-12 h-12" />,
      title: language === 'en' ? 'Latest Technology' : 'Última Tecnología',
      description:
        language === 'en'
          ? 'Cutting-edge processors and components'
          : 'Procesadores y componentes de última generación'
    },
    {
      icon: <Battery className="w-12 h-12" />,
      title: language === 'en' ? 'Long Battery Life' : 'Batería Duradera',
      description:
        language === 'en'
          ? 'All-day computing power'
          : 'Energía para todo el día'
    },
    {
      icon: <Monitor className="w-12 h-12" />,
      title: language === 'en' ? 'Premium Displays' : 'Pantallas Premium',
      description:
        language === 'en'
          ? 'Vibrant and crisp visuals'
          : 'Visuales nítidos y vibrantes'
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: language === 'en' ? 'Quality Assured' : 'Calidad Garantizada',
      description:
        language === 'en'
          ? '2-year warranty included'
          : 'Garantía de 2 años incluida'
    }
  ];

  return (
    <div
      className={`${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
      } min-h-screen`}
    >
      <div>
        <Carousel />
        <div className="text-3xl font-bold mb-8 uppercase text-center flex justify-center">
          <h1>
            {language === 'en' ? 'Welcome to Tendai' : 'Bienvenido a Tendai'}
          </h1>
        </div>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg text-center ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                }`}
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Products Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {language === 'en' ? 'Featured Products' : 'Productos Destacados'}
          </h2>
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-800'
                    } product opacity-0`}
                  >
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-0 right-0 m-2 bg-blue-500 text-white px-2 py-1 rounded">
                        {product.category}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                      <p className="text-gray-500 mb-2">{product.brand}</p>
                      <p className="text-2xl font-bold text-blue-500 mb-3">
                        ${product.price}
                      </p>
                      <div className="flex items-center mb-4">
                        <Star className="text-yellow-500" size={20} />
                        {[...Array(5)].map((_, index) => (
                          <span
                            key={index}
                            className={`text-yellow-500 ${
                              index < Math.round(product.averageRating || 0)
                                ? '★'
                                : '☆'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-gray-500">
                          ({(product.averageRating || 0).toFixed(1)})
                        </span>
                      </div>
                      <button
                        onClick={() => navigate(`/productdetails/${product.id}`)}
                        className={`w-full py-2 px-4 rounded ${
                          theme === 'dark'
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-blue-500 hover:bg-blue-600'
                        } text-white transition duration-200`}
                      >
                        {language === 'en' ? 'View Details' : 'Ver Detalles'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => navigate('/products')}
                  className={`py-3 px-6 rounded ${
                    theme === 'dark'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white font-bold transition duration-200`}
                >
                  {language === 'en'
                    ? 'View All Products'
                    : 'Ver Todos los Productos'}
                </button>
              </div>
            </>
          )}
        </section>

        <InfoSection />
        <BenefitsSection />
        <BrandSection />
        <TestimonialsSection />
      </div>
    </div>
  );
};

export default Home;